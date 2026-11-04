#!/usr/bin/env node
/**
 * CLI: activity log JSON → activity interaction network.
 *
 *   node scripts/activity-network/build-graph.mjs <log.json> \
 *     [--session <id>] [--format json|csv|dot] [--trigger-ms 2000] [--co-ms 10000] \
 *     [--map <activity-map.json>] [--out <file>]
 *
 * <log.json> is the array exported by the site's Download JSON (or any file
 * containing an ActivityEvent[] or a research bundle's `activity` field).
 * Deterministic: same input → same output.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { toActivityInstances } from '../../src/lib/activity-network/abstract.js';
import { buildGraph, graphToCSV, graphToDOT } from '../../src/lib/activity-network/graph.js';

const here = dirname(fileURLToPath(import.meta.url));
const defaultMapPath = resolve(here, '../../src/lib/activity-network/activity-map.json');

function parseArgs(argv) {
  const args = { format: 'json', triggerMs: 2000, coMs: 10000 };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--session') args.sessionId = argv[++i];
    else if (a === '--format') args.format = argv[++i];
    else if (a === '--trigger-ms') args.triggerMs = Number(argv[++i]);
    else if (a === '--co-ms') args.coMs = Number(argv[++i]);
    else if (a === '--map') args.mapPath = argv[++i];
    else if (a === '--out') args.out = argv[++i];
    else positional.push(a);
  }
  args.input = positional[0];
  return args;
}

function loadEvents(path) {
  const raw = JSON.parse(readFileSync(path, 'utf8'));
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.activity)) return raw.activity;
  throw new Error('Input must be an ActivityEvent[] or a research bundle with an `activity` array');
}

const args = parseArgs(process.argv.slice(2));
if (!args.input) {
  console.error('usage: build-graph.mjs <log.json> [--session id] [--format json|csv|dot] [--trigger-ms N] [--co-ms N] [--map file] [--out file]');
  process.exit(1);
}

const map = JSON.parse(readFileSync(args.mapPath ?? defaultMapPath, 'utf8'));
const events = loadEvents(args.input);
const instances = toActivityInstances(events, map);
const graph = buildGraph(instances, {
  triggerWindowMs: args.triggerMs,
  coWindowMs: args.coMs,
  sessionId: args.sessionId,
});

let output;
if (args.format === 'csv') output = graphToCSV(graph);
else if (args.format === 'dot') output = graphToDOT(graph);
else output = JSON.stringify(graph, null, 2);

if (args.out) {
  writeFileSync(args.out, output);
  console.log(`wrote ${args.out} (${graph.nodes.length} nodes, ${graph.edges.length} edges)`);
} else {
  process.stdout.write(output + '\n');
}
