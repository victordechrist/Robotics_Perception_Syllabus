import type { LabTask } from '../types';

export const week07Task: LabTask = {
  labSlug: 'week-7-camera-calibration',
  title: 'Reasoning Through Camera Calibration',
  brief:
    'Narrate the calibration pipeline: why object/image point pairing must be exact, what the solver actually minimizes, and why reprojection error is the only honest verification. Each scene asks you to commit a thought; the scoreboard tracks alignment.',
  scenes: [
    {
      id: 'w07-scene-1',
      order: 1,
      title: 'The Grid Is the Ruler',
      narration:
        'Calibration works because the board gives you points whose 3D positions are known exactly — the solver learns where the camera is by matching them to pixels. Commit why object points must live on the z=0 plane in board coordinates and pair index-for-index with detected corners.',
      goal: 'Commit a thought on the object/image point correspondence contract.',
      goldNodeIds: ['g2', 'g3', 'g4'],
      elicitation: 'code-cell',
      hints: [
        'objp[:, :2] enumerates the grid in board units; z stays 0.',
        'A swapped row/column grid silently corrupts every correspondence.',
      ],
    },
    {
      id: 'w07-scene-2',
      order: 2,
      title: 'What the Solver Minimizes',
      narration:
        'calibrateCamera finds K, distortion, and per-view poses that best reproject the known grid onto the detected pixels — a single nonlinear least-squares objective. Commit why the return order (rms, K, dist, rvecs, tvecs) matters and why more varied views give better-conditioned parameters.',
      goal: 'Commit a thought on the reprojection objective and view diversity.',
      goldNodeIds: ['g5', 'g6', 'g7'],
      elicitation: 'code-cell',
      hints: [
        'The first return value is the RMS reprojection error, not K.',
        'Coplanar + edge-of-frame views constrain distortion; fronto-parallel alone cannot.',
      ],
    },
    {
      id: 'w07-scene-3',
      order: 3,
      title: 'Trust Only Reprojection',
      narration:
        'A calibration is good exactly to the extent it predicts pixels — reproject the known grid through the solved model and measure the mean pixel error per view. Commit why this check, not the RMS the solver reports alone, closes the loop.',
      goal: 'Commit a thought on per-view reprojection verification.',
      goldNodeIds: ['g8', 'g9', 'g10'],
      elicitation: 'code-cell',
      hints: [
        'cv2.projectPoints through the solved K/dist back onto each view.',
        'Mean error < ~0.5px is healthy; an outlier view flags a bad detection.',
      ],
    },
  ],
  goldTree: {
    labSlug: 'week-7-camera-calibration',
    rootId: 'g1',
    version: 1,
    prunedNodeIds: [],
    activePath: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10'],
    nodes: [
      { id: 'g1', label: 'Solve camera intrinsics honestly', content: 'exact correspondences, reprojection-objective solve, per-view verification', kind: 'goal', status: 'confirmed', parentId: null },
      { id: 'g2', label: 'Pair points exactly', content: 'board-space 3D points on z=0 matched index-for-index with detected corners', kind: 'subgoal', status: 'confirmed' },
      { id: 'g3', label: 'Grid enumeration + corner append', content: 'objp filled by mgrid rows×cols; objpoints/imgpoints appended per view', kind: 'operator', status: 'confirmed' },
      { id: 'g4', label: 'Correspondence lists complete', content: 'every accepted view contributes an aligned (3D, 2D) pair set', kind: 'evidence', status: 'confirmed' },
      { id: 'g5', label: 'Minimize reprojection error', content: 'the solver fits K, distortion, and per-view poses to predict pixels', kind: 'subgoal', status: 'confirmed' },
      { id: 'g6', label: 'calibrateCamera call + return order', content: 'rms first, then K, dist, rvecs, tvecs — read them in the documented order', kind: 'operator', status: 'confirmed' },
      { id: 'g7', label: 'Diverse views constrain better', content: 'varied angles/distances yield well-conditioned intrinsics; single-pose data does not', kind: 'evidence', status: 'confirmed' },
      { id: 'g8', label: 'Verify by reprojection', content: 'the solved model must reproduce detected pixels to be trusted', kind: 'subgoal', status: 'confirmed' },
      { id: 'g9', label: 'projectPoints + per-view mean err', content: 'reproject each view\'s grid, compare to detections, report mean pixel error', kind: 'operator', status: 'confirmed' },
      { id: 'g10', label: 'Sub-pixel residual = calibrated', content: 'per-view errors under the threshold confirm the intrinsics are usable', kind: 'evidence', status: 'confirmed' },
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
      { from: 'g5', to: 'g8', relation: 'depends-on' },
      { from: 'g8', to: 'g9', relation: 'elaborates' },
      { from: 'g9', to: 'g10', relation: 'elaborates' },
    ],
  },
};
