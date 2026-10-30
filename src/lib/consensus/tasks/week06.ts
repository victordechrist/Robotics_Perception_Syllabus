import type { LabTask } from '../types';

export const week06Task: LabTask = {
  labSlug: 'week-6-optical-flow',
  title: 'Reasoning Through Lucas-Kanade Flow',
  brief:
    'Narrate the optical-flow pipeline: why the brightness constancy assumption needs a least-squares solve, why untextured windows must be rejected, and why pyramids handle real displacements. Each scene asks you to commit a thought; the scoreboard tracks alignment.',
  scenes: [
    {
      id: 'w06-scene-1',
      order: 1,
      title: 'One Equation, Two Unknowns',
      narration:
        'Brightness constancy gives Ix·u + Iy·v = −It per pixel — one equation for two unknowns. LK borrows the neighbors\' equations and solves the overdetermined system. Commit why the window-level least-squares formulation resolves the aperture problem partially.',
      goal: 'Commit a thought on the AᵀA·u = −Aᵀb formulation and the aperture problem.',
      goldNodeIds: ['g2', 'g3', 'g4'],
      elicitation: 'code-cell',
      hints: [
        'A window of N pixels gives N equations in 2 unknowns — least squares.',
        'Along an edge, equations are collinear — flow is only recoverable perpendicular to it.',
      ],
    },
    {
      id: 'w06-scene-2',
      order: 2,
      title: 'Texture Decides Solvability',
      narration:
        'The same matrix that yields the flow also tells you whether the window is solvable: AᵀA needs two strong eigenvalues. Flat sky or a straight edge fails the check. Commit why min-eigenvalue gating must precede trusting a flow vector.',
      goal: 'Commit a thought on the eigenvalue gate for flow validity.',
      goldNodeIds: ['g5', 'g6', 'g7'],
      elicitation: 'code-cell',
      hints: [
        'AᵀA is the structure tensor — small min eigenvalue means rank-deficient system.',
        'Corners pass; edges and flats fail — same test as Harris.',
      ],
    },
    {
      id: 'w06-scene-3',
      order: 3,
      title: 'Pyramids Beat Displacement',
      narration:
        'LK assumes sub-pixel-to-small motion; real video displacements exceed it. A coarse-to-fine pyramid handles large motion by solving at reduced resolution first. Commit the scale argument and why tracking forwards-backwards adds evidence.',
      goal: 'Commit a thought on pyramid coarse-to-fine + forward-backward consistency.',
      goldNodeIds: ['g8', 'g9', 'g10'],
      elicitation: 'code-cell',
      hints: [
        'At half resolution, a 40px displacement is 20px — within LK range.',
        'Track forward then backward; surviving round-trip points are trusted.',
      ],
    },
  ],
  goldTree: {
    labSlug: 'week-6-optical-flow',
    rootId: 'g1',
    version: 1,
    prunedNodeIds: [],
    activePath: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10'],
    nodes: [
      { id: 'g1', label: 'Track points with trustworthy optical flow', content: 'least-squares LK per window, eigenvalue-gated, pyramid for real displacements', kind: 'goal', status: 'confirmed', parentId: null },
      { id: 'g2', label: 'Least-squares over the window', content: 'borrow neighboring pixels\' equations to solve the underdetermined flow', kind: 'subgoal', status: 'confirmed' },
      { id: 'g3', label: 'AᵀA·u = −Aᵀb per window', content: 'stack Ix, Iy per pixel in A and −It in b, solve the 2x2 normal equations', kind: 'operator', status: 'confirmed' },
      { id: 'g4', label: 'Per-window flow estimate', content: 'a (u,v) displacement per window — pending a validity check', kind: 'evidence', status: 'confirmed' },
      { id: 'g5', label: 'Reject rank-deficient windows', content: 'flats and straight edges cannot yield a unique flow — drop them', kind: 'subgoal', status: 'confirmed' },
      { id: 'g6', label: 'Min-eigenvalue gate', content: 'eig(AᵀA).min() > threshold keeps only windows textured in both directions', kind: 'operator', status: 'confirmed' },
      { id: 'g7', label: 'Reliable flow survives', content: 'corners and textured patches carry valid motion; ambiguous windows removed', kind: 'evidence', status: 'confirmed' },
      { id: 'g8', label: 'Handle large motion', content: 'real displacements exceed the linearization radius — scale down first', kind: 'subgoal', status: 'confirmed' },
      { id: 'g9', label: 'Coarse-to-fine pyramid + round trip', content: 'estimate at coarse levels first; verify with forward-backward consistency', kind: 'operator', status: 'confirmed' },
      { id: 'g10', label: 'Robust tracked set', content: 'points that track forward AND back yield the reliable motion field', kind: 'evidence', status: 'confirmed' },
    ],
    edges: [
      { from: 'g1', to: 'g2', relation: 'elaborates' },
      { from: 'g1', to: 'g5', relation: 'elaborates' },
      { from: 'g1', to: 'g8', relation: 'elaborates' },
      { from: 'g2', to: 'g3', relation: 'elaborates' },
      { from: 'g3', to: 'g4', relation: 'elaborates' },
      { from: 'g5', to: 'g6', relation: 'elaborates' },
      { from: 'g6', to: 'g7', relation: 'elaborates' },
      { from: 'g2', to: 'g5', relation: 'depends-on' },
      { from: 'g8', to: 'g9', relation: 'elaborates' },
      { from: 'g9', to: 'g10', relation: 'elaborates' },
    ],
  },
};
