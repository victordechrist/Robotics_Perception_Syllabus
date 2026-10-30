'use client';

import { useMemo, useState } from 'react';
import { STRUCTURAL_RELATIONS } from '@/lib/consensus/types';
import type { ConsensusGraph, ConsensusNode, NodeKind } from '@/lib/consensus/types';
import { cn } from '@/lib/utils';

interface TreeVisualizerProps {
  graph: ConsensusGraph;
  /** Accessible name for the SVG, e.g. "Your consensus tree". */
  title: string;
  /** Gold node ids the student has matched (gold view rings these). */
  matchedGoldIds?: ReadonlySet<string>;
  /** Gold view: color by match state instead of node status. */
  variant?: 'student' | 'gold';
}

const NODE_W = 184;
const NODE_H = 58;
const H_GAP = 24;
const V_GAP = 44;
const MARGIN = 20;

interface Pos {
  x: number;
  y: number;
}

/** Layered tidy layout over structural edges (n-ary safe). */
function layout(graph: ConsensusGraph) {
  const structural = STRUCTURAL_RELATIONS as readonly string[];
  const children = new Map<string, string[]>();
  graph.nodes.forEach((n) => children.set(n.id, []));
  const hasParent = new Set<string>();
  for (const e of graph.edges) {
    if (!structural.includes(e.relation)) continue;
    if (!children.has(e.from) || !children.has(e.to) || hasParent.has(e.to)) continue;
    children.get(e.from)!.push(e.to);
    hasParent.add(e.to);
  }

  const logical = new Map<string, { col: number; depth: number }>();
  const visited = new Set<string>();
  let leaf = 0;

  const place = (id: string, depth: number): number => {
    visited.add(id);
    const kids = (children.get(id) ?? []).filter((c) => !visited.has(c));
    let col: number;
    if (kids.length === 0) {
      col = leaf++;
    } else {
      const cols = kids.map((k) => place(k, depth + 1));
      col = (cols[0] + cols[cols.length - 1]) / 2;
    }
    logical.set(id, { col, depth });
    return col;
  };

  const roots = [graph.rootId, ...graph.nodes.map((n) => n.id).filter((id) => !hasParent.has(id))];
  for (const id of roots) {
    if (children.has(id) && !visited.has(id)) place(id, 0);
  }

  let maxCol = 0;
  let maxDepth = 0;
  logical.forEach(({ col, depth }) => {
    maxCol = Math.max(maxCol, col);
    maxDepth = Math.max(maxDepth, depth);
  });

  const positions = new Map<string, Pos>();
  logical.forEach(({ col, depth }, id) => {
    positions.set(id, {
      x: MARGIN + col * (NODE_W + H_GAP),
      y: MARGIN + depth * (NODE_H + V_GAP),
    });
  });

  return {
    positions,
    width: MARGIN * 2 + (maxCol + 1) * NODE_W + maxCol * H_GAP,
    height: MARGIN * 2 + (maxDepth + 1) * NODE_H + maxDepth * V_GAP,
  };
}

const KIND_DOT: Record<NodeKind, string> = {
  goal: 'fill-indigo-500',
  subgoal: 'fill-violet-500',
  operator: 'fill-sky-500',
  evidence: 'fill-teal-500',
  hypothesis: 'fill-amber-500',
  error: 'fill-red-500',
  'dead-end': 'fill-slate-400',
};

function nodeBox(node: ConsensusNode, variant: 'student' | 'gold', goldMatched: boolean): string {
  if (variant === 'gold') {
    return goldMatched
      ? 'fill-amber-50 stroke-amber-500 dark:fill-amber-950/50 dark:stroke-amber-400'
      : 'fill-white stroke-slate-300 dark:fill-slate-900 dark:stroke-slate-600';
  }
  if (node.kind === 'error' && node.status !== 'pruned') {
    return 'fill-red-50 stroke-red-500 dark:fill-red-950/50 dark:stroke-red-400';
  }
  switch (node.status) {
    case 'confirmed':
      return 'fill-emerald-50 stroke-emerald-500 dark:fill-emerald-950/50 dark:stroke-emerald-400';
    case 'active':
      return 'fill-sky-50 stroke-sky-500 dark:fill-sky-950/40 dark:stroke-sky-400';
    case 'dead-end':
      return 'fill-slate-100 stroke-slate-400 dark:fill-slate-800 dark:stroke-slate-500';
    case 'pruned':
      return 'fill-slate-50 stroke-slate-300 dark:fill-slate-900 dark:stroke-slate-700';
    case 'dormant':
      return 'fill-amber-50 stroke-amber-400 dark:fill-amber-950/30 dark:stroke-amber-600';
    case 'candidate':
    default:
      return 'fill-transparent stroke-slate-400 dark:stroke-slate-500';
  }
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export function TreeVisualizer({
  graph,
  title,
  matchedGoldIds,
  variant = 'student',
}: TreeVisualizerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { positions, width, height } = useMemo(() => layout(graph), [graph]);
  const activePath = useMemo(() => new Set(graph.activePath), [graph.activePath]);
  const structural = STRUCTURAL_RELATIONS as readonly string[];
  const selected = graph.nodes.find((n) => n.id === selectedId) ?? null;

  return (
    <div className="space-y-3">
      <div className="overflow-auto rounded-xl border border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950/60">
        <svg
          role="img"
          aria-label={`${title}: ${graph.nodes.length} nodes`}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="block"
        >
          <title>{title}</title>
          {/* Edges */}
          {graph.edges.map((e, i) => {
            const a = positions.get(e.from);
            const b = positions.get(e.to);
            if (!a || !b) return null;
            const isStruct = structural.includes(e.relation);
            const onPath = isStruct && activePath.has(e.from) && activePath.has(e.to);
            const x1 = a.x + NODE_W / 2;
            const x2 = b.x + NODE_W / 2;
            if (isStruct) {
              const y1 = a.y + NODE_H;
              const y2 = b.y;
              const my = (y1 + y2) / 2;
              return (
                <path
                  key={`e${i}`}
                  d={`M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`}
                  fill="none"
                  strokeWidth={onPath ? 2.5 : 1.5}
                  className={cn(
                    variant === 'gold'
                      ? 'stroke-amber-400/70'
                      : onPath
                        ? 'stroke-indigo-500 dark:stroke-indigo-400'
                        : 'stroke-slate-300 dark:stroke-slate-600',
                  )}
                />
              );
            }
            const y1 = a.y + NODE_H / 2;
            const y2 = b.y + NODE_H / 2;
            return (
              <g key={`e${i}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  strokeWidth={1.5}
                  strokeDasharray="5 4"
                  className={
                    e.relation === 'repairs'
                      ? 'stroke-emerald-500'
                      : 'stroke-red-400'
                  }
                />
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 4}
                  textAnchor="middle"
                  fontSize="10"
                  className={cn(
                    'font-mono',
                    e.relation === 'repairs'
                      ? 'fill-emerald-600 dark:fill-emerald-400'
                      : 'fill-red-500 dark:fill-red-400',
                  )}
                >
                  {e.relation}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {graph.nodes.map((node) => {
            const p = positions.get(node.id);
            if (!p) return null;
            const goldMatched =
              variant === 'gold' ? !!matchedGoldIds?.has(node.id) : !!node.goldMatchId;
            const onPath = variant === 'student' && activePath.has(node.id);
            const isSelected = node.id === selectedId;
            return (
              <g
                key={node.id}
                transform={`translate(${p.x},${p.y})`}
                role="button"
                tabIndex={0}
                aria-label={`${node.kind} node${goldMatched ? ', gold matched' : ''}: ${node.label}`}
                aria-pressed={isSelected}
                onClick={() => setSelectedId(isSelected ? null : node.id)}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    setSelectedId(isSelected ? null : node.id);
                  }
                }}
                className="cursor-pointer outline-none focus-visible:[&>rect:first-child]:stroke-indigo-500"
              >
                <title>{node.content}</title>
                <rect
                  width={NODE_W}
                  height={NODE_H}
                  rx={10}
                  strokeWidth={isSelected ? 3 : onPath ? 2.25 : 1.5}
                  strokeDasharray={
                    node.status === 'candidate' || node.status === 'pruned' ? '4 3' : undefined
                  }
                  className={nodeBox(node, variant, goldMatched)}
                />
                {goldMatched && variant === 'student' && (
                  <rect
                    x={-3}
                    y={-3}
                    width={NODE_W + 6}
                    height={NODE_H + 6}
                    rx={12}
                    fill="none"
                    strokeWidth={1.5}
                    className="stroke-amber-400"
                  />
                )}
                <circle cx={14} cy={16} r={4} className={KIND_DOT[node.kind]} />
                <text
                  x={24}
                  y={20}
                  fontSize="10"
                  className="fill-slate-500 font-mono uppercase dark:fill-slate-400"
                >
                  {node.kind}
                  {variant === 'student' && node.status !== 'active' ? ` · ${node.status}` : ''}
                  {node.source === 'auto' ? ' · auto' : ''}
                </text>
                {goldMatched && (
                  <text x={NODE_W - 12} y={20} fontSize="12" textAnchor="end" className="fill-amber-500">
                    ★
                  </text>
                )}
                <text
                  x={12}
                  y={42}
                  fontSize="12"
                  className={cn(
                    'font-medium',
                    node.status === 'pruned'
                      ? 'fill-slate-400 line-through dark:fill-slate-500'
                      : 'fill-slate-800 dark:fill-slate-100',
                  )}
                >
                  {truncate(node.label, 26)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {selected && (
        <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <span>{selected.kind}</span>
            {variant === 'student' && <span>· {selected.status}</span>}
            {selected.goldMatchId && variant === 'student' && (
              <span className="text-amber-600 dark:text-amber-400">· ★ gold matched</span>
            )}
            {selected.hintUsed && <span>· hint used</span>}
          </div>
          <p className="font-medium text-slate-900 dark:text-slate-100">{selected.label}</p>
          <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-xs text-slate-600 dark:text-slate-300">
            {selected.content}
          </pre>
        </div>
      )}
    </div>
  );
}
