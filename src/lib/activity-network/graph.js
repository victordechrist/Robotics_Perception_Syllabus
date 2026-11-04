/**
 * Activity interaction network: activity instances → directed property graph.
 *
 * Nodes = activity types with occurrence counts. Edges:
 *   precedes  — adjacent activities in a session's order
 *   triggers  — B starts within triggerWindowMs of A with nothing between
 *   coOccurs  — within coWindowMs sliding window
 * Edge props: count, weight (share of same-relation edges), avgTimeDeltaMs.
 * Deterministic: same input + options → byte-identical output.
 */

/**
 * @param {Array<{activity: string, ts: string, sessionId: string}>} instances
 * @param {{triggerWindowMs?: number, coWindowMs?: number, sessionId?: string}} [opts]
 */
export function buildGraph(instances, opts = {}) {
  const triggerMs = opts.triggerWindowMs ?? 2000;
  const coMs = opts.coWindowMs ?? 10000;

  const filtered = opts.sessionId
    ? instances.filter((i) => i.sessionId === opts.sessionId)
    : instances;

  // Group by session, preserving chronological order (input is time-sorted).
  const bySession = new Map();
  for (const inst of filtered) {
    if (!bySession.has(inst.sessionId)) bySession.set(inst.sessionId, []);
    bySession.get(inst.sessionId).push(inst);
  }

  const nodeCounts = new Map();
  const edges = new Map(); // key `${source}|${target}|${relation}` → {count, totalDelta}

  function addEdge(source, target, relation, deltaMs) {
    const key = `${source}|${target}|${relation}`;
    const e = edges.get(key) ?? { count: 0, totalDelta: 0 };
    e.count += 1;
    e.totalDelta += deltaMs;
    edges.set(key, e);
  }

  for (const inst of filtered) {
    nodeCounts.set(inst.activity, (nodeCounts.get(inst.activity) ?? 0) + 1);
  }

  for (const seq of bySession.values()) {
    const times = seq.map((i) => Date.parse(i.ts));
    for (let i = 0; i < seq.length; i++) {
      const a = seq[i];
      if (i + 1 < seq.length) {
        const b = seq[i + 1];
        const delta = times[i + 1] - times[i];
        addEdge(a.activity, b.activity, 'precedes', delta);
        if (delta <= triggerMs) {
          addEdge(a.activity, b.activity, 'triggers', delta);
        }
      }
      // coOccurs: all activities within the forward window
      for (let j = i + 1; j < seq.length && times[j] - times[i] <= coMs; j++) {
        addEdge(a.activity, seq[j].activity, 'coOccurs', times[j] - times[i]);
      }
    }
  }

  const relationTotals = new Map();
  for (const [key, e] of edges) {
    const relation = key.split('|').pop();
    relationTotals.set(relation, (relationTotals.get(relation) ?? 0) + e.count);
  }

  const nodes = [...nodeCounts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, count]) => ({ id, type: 'Activity', count }));

  const edgeList = [...edges.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, e]) => {
      const [source, target, relation] = key.split('|');
      const total = relationTotals.get(relation) ?? 1;
      return {
        source,
        target,
        relation,
        count: e.count,
        weight: Number((e.count / total).toFixed(4)),
        avgTimeDeltaMs: Math.round(e.totalDelta / e.count),
      };
    });

  return { nodes, edges: edgeList };
}

/**
 * Edges to CSV rows: source,target,relation,count,weight,avgTimeDeltaMs
 * @param {{edges: Array<object>}} graph
 */
export function graphToCSV(graph) {
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = graph.edges.map((e) =>
    [e.source, e.target, e.relation, e.count, e.weight, e.avgTimeDeltaMs].map(esc).join(','),
  );
  return ['source,target,relation,count,weight,avgTimeDeltaMs', ...rows].join('\n');
}

/**
 * Graphviz DOT rendering (digraph, node size ~ count, edge label = relation).
 * @param {{nodes: Array<{id: string, count: number}>, edges: Array<object>}} graph
 */
export function graphToDOT(graph) {
  const q = (s) => `"${String(s).replace(/"/g, '\\"')}"`;
  const lines = ['digraph ActivityNetwork {', '  rankdir=LR;', '  node [shape=box, style=rounded];'];
  for (const n of graph.nodes) {
    lines.push(`  ${q(n.id)} [label=${q(`${n.id} (${n.count})`)}];`);
  }
  for (const e of graph.edges) {
    lines.push(`  ${q(e.source)} -> ${q(e.target)} [label=${q(`${e.relation} ×${e.count}`)}];`);
  }
  lines.push('}');
  return lines.join('\n');
}
