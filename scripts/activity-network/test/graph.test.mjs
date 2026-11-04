import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { toActivityInstances, classify } from '../../../src/lib/activity-network/abstract.js';
import { buildGraph, graphToCSV, graphToDOT } from '../../../src/lib/activity-network/graph.js';

const here = dirname(fileURLToPath(import.meta.url));
const map = JSON.parse(
  readFileSync(resolve(here, '../../../src/lib/activity-network/activity-map.json'), 'utf8'),
);

const T = 1700000000000;
const ev = (type, ms, data = {}) => ({
  id: `e-${ms}`,
  ts: new Date(T + ms).toISOString(),
  type,
  data: { path: '/labs', sid: 's1', uid: 'u1', ...data },
});

test('click→scroll within 2s yields a triggers edge', () => {
  const events = [
    ev('dom.click', 0, { label: 'Labs', href: '/labs' }),
    ev('scroll.depth', 1200, { pct: 50 }),
    ev('dom.click', 5000, { label: 'Lectures', href: '/lectures' }),
  ];
  const instances = toActivityInstances(events, map);
  const graph = buildGraph(instances);
  const names = instances.map((i) => i.activity);
  assert.deepEqual(names, ['NavigateToSection', 'ScrollContent', 'NavigateToSection']);
  const trig = graph.edges.find((e) => e.source === 'NavigateToSection' && e.target === 'ScrollContent' && e.relation === 'triggers');
  assert.ok(trig, 'expected NavigateToSection →triggers→ ScrollContent');
  assert.equal(trig.count, 1);
  assert.equal(trig.avgTimeDeltaMs, 1200);
});

test('Idle synthesized on ≥30s gap within a session', () => {
  const events = [ev('page.view', 0), ev('dom.click', 45000, { label: 'Labs' })];
  const names = toActivityInstances(events, map).map((i) => i.activity);
  assert.deepEqual(names, ['ViewPage', 'Idle', 'NavigateToSection']);
});

test('no Idle across different sessions', () => {
  const events = [ev('page.view', 0), { ...ev('dom.click', 45000), data: { path: '/', sid: 's2', uid: 'u2', label: 'Labs' } }];
  const names = toActivityInstances(events, map).map((i) => i.activity);
  assert.equal(names.includes('Idle'), false);
});

test('precedes + coOccurs edges with correct counts', () => {
  const events = [ev('tab.switch', 0, { tab: 'exercise' }), ev('exercise.check.attempt', 1000), ev('tree.thought.commit', 3000)];
  const graph = buildGraph(toActivityInstances(events, map));
  const prec = graph.edges.filter((e) => e.relation === 'precedes');
  assert.equal(prec.length, 2);
  const co = graph.edges.filter((e) => e.relation === 'coOccurs' && e.source === 'SwitchLabTab');
  assert.ok(co.some((e) => e.target === 'CommitThought'));
});

test('idempotent — same input gives byte-identical output', () => {
  const events = [ev('page.view', 0), ev('dom.click', 500, { label: 'Labs' }), ev('scroll.depth', 1500)];
  const a = JSON.stringify(buildGraph(toActivityInstances(events, map)));
  const b = JSON.stringify(buildGraph(toActivityInstances(events, map)));
  assert.equal(a, b);
});

test('session filter isolates one session', () => {
  const events = [ev('page.view', 0), { ...ev('page.view', 1000), data: { path: '/x', sid: 's2', uid: 'u2' } }];
  const instances = toActivityInstances(events, map);
  const g1 = buildGraph(instances, { sessionId: 's1' });
  assert.equal(g1.nodes.length, 1);
  assert.equal(g1.nodes[0].count, 1);
});

test('CSV + DOT serializers emit expected shape', () => {
  const events = [ev('dom.click', 0, { label: 'Labs' }), ev('scroll.depth', 900)];
  const graph = buildGraph(toActivityInstances(events, map));
  assert.match(graphToCSV(graph), /^source,target,relation,count,weight,avgTimeDeltaMs/);
  assert.match(graphToDOT(graph), /digraph ActivityNetwork/);
});

test('classify falls back to Other for unmapped types', () => {
  assert.equal(classify({ type: 'unknown.thing', data: {} }, map.rules), 'Other');
});
