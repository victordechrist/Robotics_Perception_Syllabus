import type { LabTask } from '../types';

// Week 1 consensus task — the reasoning path through rigid transformations:
// why homogeneous coordinates exist, why composition order matters, and why
// you verify the rotation block before trusting a pose downstream.
export const week01Task: LabTask = {
  labSlug: 'week-1-math-foundations',
  title: 'Reasoning Through Pose Composition',
  brief:
    'Narrate your way through the transformation pipeline: why we fold rotation and translation into one matrix, why chaining order decides the answer, and what invariant keeps a broken transform from propagating. Each scene asks you to commit a thought; the scoreboard tracks how your reasoning aligns with the canonical path.',
  scenes: [
    {
      id: 'w01-scene-1',
      order: 1,
      title: 'One Matrix to Bind Them',
      narration:
        'A robot pose is rotation plus translation — two separate things in R3. Homogeneous coordinates merge them into a single 4×4 matrix so composition becomes multiplication. Write down why the plain R3 approach (R·p + t) breaks composition, and what the w=1 row buys you.',
      goal: 'Commit a thought explaining why homogeneous coordinates make pose composition a single matrix multiply.',
      goldNodeIds: ['g2', 'g3', 'g4'],
      elicitation: 'code-cell',
      hints: [
        'p\' = R·p + t applied twice gives R2(R1·p + t1) + t2 — nested, not linear.',
        'The [R | t] block with bottom row [0 0 0 1] makes T2 @ T1 exactly encode both steps.',
      ],
    },
    {
      id: 'w01-scene-2',
      order: 2,
      title: 'Order Is Not a Detail',
      narration:
        'A camera mount sits on an arm end-effector, which sits on the world frame. Pose A→B then B→C composes as T_ac = T_ab @ T_bc — reading order flows from the world toward the sensor. Swap it and the answer is quietly wrong. Articulate why T_bc @ T_ab describes a different physical chain.',
      goal: 'Commit a thought on why composition order matters and what each matrix product means physically.',
      goldNodeIds: ['g5', 'g6', 'g7'],
      elicitation: 'code-cell',
      hints: [
        'Matrix products are not commutative — T_ab @ T_bc ≠ T_bc @ T_ab.',
        'T_ab @ T_bc reads "apply the b→c pose in frame b, in the a-frame chain".',
      ],
    },
    {
      id: 'w01-scene-3',
      order: 3,
      title: 'Trust, but Verify',
      narration:
        'Before a computed transform drives a controller or a calibration result, the rotation block must still be a rotation: RᵀR = I and det(R) = +1. Numerical drift or a bad multiply silently breaks this. Commit the check you would add and why each property matters.',
      goal: 'Commit a thought on the orthonormality + determinant invariants and where to put the check in the pipeline.',
      goldNodeIds: ['g8', 'g9', 'g10'],
      elicitation: 'code-cell',
      hints: [
        'np.allclose(R.T @ R, np.eye(3)) catches shear/scale contamination.',
        'det(R) = +1 keeps you in SO(3) — a -1 means a reflection snuck in.',
      ],
    },
  ],
  goldTree: {
    labSlug: 'week-1-math-foundations',
    rootId: 'g1',
    version: 1,
    prunedNodeIds: [],
    activePath: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10'],
    nodes: [
      {
        id: 'g1',
        label: 'Compose poses correctly and verifiably',
        content: 'chain 2D/3D rigid transforms through homogeneous matrices, in the right order, with the rotation block verified before use',
        kind: 'goal',
        status: 'confirmed',
        parentId: null,
      },
      {
        id: 'g2',
        label: 'Unified homogeneous transform',
        content: 'fold rotation and translation into one 4x4 [R|t] matrix so composition becomes multiplication instead of nested R·p + t',
        kind: 'subgoal',
        status: 'confirmed',
      },
      {
        id: 'g3',
        label: 'Append w=1 to points',
        content: 'homogenize 3D points as [x y z 1] so translation participates in the same linear map as rotation',
        kind: 'operator',
        status: 'confirmed',
      },
      {
        id: 'g4',
        label: 'Composition collapses to T2 @ T1',
        content: 'two chained poses multiply into one equivalent transform — the measured payoff of the homogeneous form',
        kind: 'evidence',
        status: 'confirmed',
      },
      {
        id: 'g5',
        label: 'Respect composition order',
        content: 'multiply in frame-chain order world→sensor — swapping order describes a different physical arm chain',
        kind: 'subgoal',
        status: 'confirmed',
      },
      {
        id: 'g6',
        label: 'T_ac = T_ab @ T_bc',
        content: 'rightmost transform applies first; product reads from the sensor back toward the world frame',
        kind: 'operator',
        status: 'confirmed',
      },
      {
        id: 'g7',
        label: 'Swapped order = wrong pose',
        content: 'T_bc @ T_ab generally yields a different translation part — non-commutativity is the evidence order matters',
        kind: 'evidence',
        status: 'confirmed',
      },
      {
        id: 'g8',
        label: 'Verify rotation integrity',
        content: 'gate downstream use of a computed transform on its rotation block still living in SO(3)',
        kind: 'subgoal',
        status: 'confirmed',
      },
      {
        id: 'g9',
        label: 'Check RᵀR = I and det = +1',
        content: 'np.allclose(R.T @ R, eye(3)) plus np.isclose(det(R), 1.0) catches numerical drift, shear, and reflections',
        kind: 'operator',
        status: 'confirmed',
      },
      {
        id: 'g10',
        label: 'Clean transform propagates',
        content: 'a verified T keeps poses consistent through the chain — the failure mode this prevents is silent pose corruption',
        kind: 'evidence',
        status: 'confirmed',
      },
    ],
    edges: [
      { from: 'g1', to: 'g2', relation: 'elaborates' },
      { from: 'g1', to: 'g5', relation: 'elaborates' },
      { from: 'g1', to: 'g8', relation: 'elaborates' },
      { from: 'g2', to: 'g3', relation: 'elaborates' },
      { from: 'g3', to: 'g4', relation: 'elaborates' },
      { from: 'g5', to: 'g6', relation: 'elaborates' },
      { from: 'g6', to: 'g7', relation: 'elaborates' },
      { from: 'g5', to: 'g8', relation: 'depends-on' },
      { from: 'g8', to: 'g9', relation: 'elaborates' },
      { from: 'g9', to: 'g10', relation: 'elaborates' },
    ],
  },
};
