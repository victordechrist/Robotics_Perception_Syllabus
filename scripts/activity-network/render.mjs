#!/usr/bin/env node
/**
 * Render a network JSON (or DOT) into a viewable artifact.
 * Tries `dot -Tsvg` (Graphviz); falls back to a standalone Mermaid HTML file.
 *
 *   node scripts/activity-network/render.mjs network.json [--out network.html]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const [input, ...rest] = process.argv.slice(2);
const outIdx = rest.indexOf('--out');
if (!input) {
  console.error('usage: render.mjs <network.json> [--out file]');
  process.exit(1);
}

const graph = JSON.parse(readFileSync(input, 'utf8'));

try {
  const { graphToDOT } = await import('../../src/lib/activity-network/graph.js');
  const dot = graphToDOT(graph);
  const svg = execFileSync('dot', ['-Tsvg'], { input: dot, maxBuffer: 16 * 1024 * 1024 }).toString();
  const out = outIdx > -1 ? rest[outIdx + 1] : input.replace(/\.json$/, '') + '.svg';
  writeFileSync(out, svg);
  console.log(`wrote ${out} (Graphviz SVG)`);
} catch {
  // Mermaid fallback — standalone HTML the student opens in a browser.
  const esc = (s) => String(s).replace(/"/g, '');
  const lines = ['graph LR'];
  for (const n of graph.nodes) lines.push(`  ${esc(n.id).replace(/\W/g, '_')}["${esc(n.id)} (${n.count})"]`);
  for (const e of graph.edges) {
    lines.push(`  ${esc(e.source).replace(/\W/g, '_')} -->|"${esc(e.relation)} ×${e.count}"| ${esc(e.target).replace(/\W/g, '_')}`);
  }
  const mermaid = lines.join('\n');
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>DMS activity network</title>
<script type="module">import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';mermaid.initialize({startOnLoad:true});</script></head>
<body><pre class="mermaid">${mermaid}</pre></body></html>`;
  const out = outIdx > -1 ? rest[outIdx + 1] : input.replace(/\.json$/, '') + '.html';
  writeFileSync(out, html);
  console.log(`wrote ${out} (Mermaid HTML — Graphviz not found, using fallback)`);
}
