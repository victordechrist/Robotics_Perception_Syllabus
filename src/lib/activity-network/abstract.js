/**
 * Activity abstraction layer: raw `dms:v1:activity` events → higher-level
 * activity instances, driven by a data-driven rule map (activity-map.json).
 *
 * Pure + deterministic: same input events + rules → identical output. Shared
 * by the in-app download and the Node CLI so both produce identical streams.
 *
 * Output instance: { activity, ts, sessionId, userId, path, detail }
 * An `Idle` activity is synthesized wherever the gap between consecutive
 * events of one session exceeds `idleGapMs` (default 30000).
 */

/**
 * @param {Record<string, unknown>} data event.data
 * @param {Record<string, unknown>} match rule.match
 */
function matches(data, match, type, target) {
  if (match.type !== undefined) {
    const types = Array.isArray(match.type) ? match.type : [match.type];
    if (!types.includes(type)) return false;
  }
  if (match.typePrefix !== undefined && !String(type).startsWith(match.typePrefix)) return false;
  if (match.path !== undefined) {
    const paths = Array.isArray(match.path) ? match.path : [match.path];
    if (!paths.some((p) => data.path === p)) return false;
  }
  if (match.pathPrefix !== undefined && !String(data.path ?? '').startsWith(match.pathPrefix)) return false;
  if (match.tag !== undefined) {
    const tags = Array.isArray(match.tag) ? match.tag : [match.tag];
    if (!tags.includes(target?.tag ?? data.tag)) return false;
  }
  if (match.id !== undefined && (target?.id ?? data.id) !== match.id) return false;
  if (match.hrefPrefix !== undefined && !String(data.href ?? '').startsWith(match.hrefPrefix)) return false;
  if (match.label !== undefined) {
    const labels = Array.isArray(match.label) ? match.label : [match.label];
    const hay = [data.label, target?.text, target?.tag]
      .filter((s) => typeof s === 'string')
      .map((s) => s.toLowerCase());
    if (!labels.some((l) => hay.some((h) => h.includes(String(l).toLowerCase())))) return false;
  }
  if (match.et !== undefined && data.et !== match.et) return false;
  if (match.editable !== undefined && Boolean(data.editable) !== Boolean(match.editable)) return false;
  return true;
}

/**
 * Map one activity event to an activity name using ordered rules (first wins).
 * @param {{type: string, data?: Record<string, unknown>}} event
 * @param {Array<{name: string, match: Record<string, unknown>}>} rules
 */
export function classify(event, rules) {
  const data = event.data ?? {};
  const target = typeof data.target === 'object' && data.target !== null ? data.target : {};
  for (const rule of rules) {
    if (matches(data, rule.match ?? {}, event.type, target)) return rule.name;
  }
  return 'Other';
}

/**
 * @param {Array<{ts: string, type: string, data?: Record<string, unknown>}>} events raw log, in stored order
 * @param {{rules: Array<{name: string, match: Record<string, unknown>}>, idleGapMs?: number}} map activity map
 * @returns {Array<{activity: string, ts: string, sessionId: string, userId: string, path: string, detail: Record<string, unknown>}>}
 */
export function toActivityInstances(events, map) {
  const rules = map.rules ?? [];
  const idleGapMs = map.idleGapMs ?? 30000;
  const sorted = [...events].sort((a, b) => (a.ts < b.ts ? -1 : a.ts > b.ts ? 1 : 0));
  const out = [];
  let prevSid = null;
  let prevTs = null;
  for (const e of sorted) {
    const d = e.data ?? {};
    const sid = typeof d.sid === 'string' ? d.sid : 'default';
    const uid = typeof d.uid === 'string' ? d.uid : 'anon';
    const t = Date.parse(e.ts);
    if (prevSid === sid && prevTs !== null && t - prevTs >= idleGapMs) {
      out.push({ activity: 'Idle', ts: new Date(prevTs + idleGapMs).toISOString(), sessionId: sid, userId: uid, path: String(d.path ?? ''), detail: { gapMs: t - prevTs } });
    }
    out.push({
      activity: classify(e, rules),
      ts: e.ts,
      sessionId: sid,
      userId: uid,
      path: String(d.path ?? ''),
      detail: { type: e.type },
    });
    prevSid = sid;
    prevTs = t;
  }
  return out;
}
