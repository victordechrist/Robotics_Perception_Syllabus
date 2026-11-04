'use client';

import { readActivity, emitActivity } from '@/lib/activity';
import activityMap from './activity-map.json';
import { toActivityInstances } from './abstract.js';
import { buildGraph } from './graph.js';

/** Run abstraction + graph construction over the local log and download JSON. */
export function exportActivityNetwork() {
  const events = readActivity();
  const instances = toActivityInstances(events, activityMap);
  const graph = buildGraph(instances);
  emitActivity('activity.export', {
    data: { format: 'network-json', events: events.length, nodes: graph.nodes.length, edges: graph.edges.length },
  });
  const payload = {
    exportedAt: new Date().toISOString(),
    activityInstances: instances.length,
    ...graph,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const ts = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rp-activity-network-${ts}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
