import type { LabTask } from '../types';

export const week02Task: LabTask = {
  labSlug: 'week-2-pinhole-camera',
  title: 'Reasoning Through the Pinhole Pipeline',
  brief:
    'Narrate how a 3D point becomes a pixel: why the divide must precede the intrinsics, why distortion lives in normalized space, and what breaks when the two are swapped. Each scene asks you to commit a thought; the scoreboard tracks alignment with the canonical path.',
  scenes: [
    {
      id: 'w02-scene-1',
      order: 1,
      title: 'Perspective Is a Division',
      narration:
        'The pinhole model says the image coordinate is the world point scaled by 1/Z. Before any matrix K touches the point, it must sit on the plane z=1. Commit the ordering argument — what goes wrong if a depth-2 object gets K applied before dividing?',
      goal: 'Commit a thought on why the perspective divide precedes the intrinsic multiply.',
      goldNodeIds: ['g2', 'g3', 'g4'],
      elicitation: 'code-cell',
      hints: [
        'x_n = X/Z, y_n = Y/Z maps onto the normalized plane first.',
        'K encodes focal length + principal point — it operates on normalized inputs by construction.',
      ],
    },
    {
      id: 'w02-scene-2',
      order: 2,
      title: 'Where Distortion Belongs',
      narration:
        'Real lenses bend rays before the ideal projection finishes — so distortion acts in normalized coordinates, and undistortion must invert it there too. Argue why applying distortion coefficients to pixel coordinates double-applies the intrinsics.',
      goal: 'Commit a thought on distortion living in normalized space, ordered between projection and K.',
      goldNodeIds: ['g5', 'g6', 'g7'],
      elicitation: 'code-cell',
      hints: [
        'k1, k2, p1, p2 coefficients are defined against normalized (x, y).',
        'Pipeline: divide → distort normalized → K → pixel.',
      ],
    },
    {
      id: 'w02-scene-3',
      order: 3,
      title: 'The Principal-Point Offset',
      narration:
        'u0, v0 in K shift the optical center off the image corner. Forgetting them moves every projection by hundreds of pixels. Commit the check you would run to prove a K matrix is being applied correctly.',
      goal: 'Commit a thought on verifying a projection with the principal point and a known reference point.',
      goldNodeIds: ['g8', 'g9', 'g10'],
      elicitation: 'code-cell',
      hints: [
        'A point on the optical axis (X=Y=0) should land at (u0, v0).',
        'Reproject a known 3D target and compare against its detected pixel.',
      ],
    },
  ],
  goldTree: {
    labSlug: 'week-2-pinhole-camera',
    rootId: 'g1',
    version: 1,
    prunedNodeIds: [],
    activePath: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10'],
    nodes: [
      { id: 'g1', label: 'Project world points to pixels correctly', content: 'pinhole projection with distortion in the right place and a verified intrinsic matrix', kind: 'goal', status: 'confirmed', parentId: null },
      { id: 'g2', label: 'Divide before intrinsics', content: 'perspective divide onto the z=1 plane happens before K is applied — order defines the model', kind: 'subgoal', status: 'confirmed' },
      { id: 'g3', label: 'x_n = X/Z, y_n = Y/Z', content: 'normalize camera-frame coordinates into the projective plane', kind: 'operator', status: 'confirmed' },
      { id: 'g4', label: 'K @ [x_n y_n 1]', content: 'the intrinsic multiply then yields pixel coordinates — correct order verified', kind: 'evidence', status: 'confirmed' },
      { id: 'g5', label: 'Distort in normalized space', content: 'radial/tangential coefficients act between projection and the intrinsic multiply, not on pixels', kind: 'subgoal', status: 'confirmed' },
      { id: 'g6', label: 'r²-based distortion', content: 'xd = xn(1 + k1 r² + k2 r⁴) + tangential terms applied to normalized coordinates', kind: 'operator', status: 'confirmed' },
      { id: 'g7', label: 'Full order: project→distort→K', content: 'the three-stage chain reproduces real lens geometry; swapping stages misplaces every pixel', kind: 'evidence', status: 'confirmed' },
      { id: 'g8', label: 'Verify the intrinsics', content: 'principal-point and focal consistency proven before trusting any projection downstream', kind: 'subgoal', status: 'confirmed' },
      { id: 'g9', label: 'Optical-axis sanity check', content: 'X=Y=0 must land on (u0, v0) — the cheapest possible verification of K', kind: 'operator', status: 'confirmed' },
      { id: 'g10', label: 'Reference-point reprojection', content: 'a known 3D target reprojects to its measured pixel within a couple of pixels', kind: 'evidence', status: 'confirmed' },
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
