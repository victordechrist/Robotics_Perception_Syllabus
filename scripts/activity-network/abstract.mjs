#!/usr/bin/env node
/**
 * CLI: raw activity log JSON → higher-level activity instance stream.
 *
 *   node scripts/activity-network/abstract.mjs <log.json> [--map activity-map.json] [--out file]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { toActivityInstances } from '../../src/lib/activity-network/abstract.js';

const here = dirname(fileURLToPath(import.meta.url));
const defaultMapPath = resolve(here, '../../src/lib/activity-network/activity-map.json');

const argv = process.argv.slice(2);
const input = argv[0];
if (!input) {
  console.error('usage: abstract.mjs <log.json> [--map file] [--out file]');
  process.exit(1);
}
const mapIdx = argv.indexOf('--map');
const outIdx = argv.indexOf('--out');
const map = JSON.parse(readFileSync(mapIdx > -1 ? argv[mapIdx + 1] : defaultMapPath, 'utf8'));

const raw = JSON.parse(readFileSync(input, 'utf8'));
const events = Array.isArray(raw) ? raw : raw.activity;
const instances = toActivityInstances(events, map);
const output = JSON.stringify(instances, null, 2);
if (outIdx > -1) {
  writeFileSync(argv[outIdx + 1], output);
  console.log(`wrote ${argv[outIdx + 1]} (${instances.length} activity instances)`);
} else {
  process.stdout.write(output + '\n');
}
