import type { LabTask } from '../types';

export const week08Task: LabTask = {
  labSlug: 'week-8-midterm-review',
  title: 'Reasoning Through the Full Pipeline',
  brief:
    'Narrate the end-to-end audit: calibration gates every downstream stage, geometry gates depth, and a pipeline is only as strong as its weakest verification. Each scene asks you to commit a thought; the scoreboard tracks alignment.',
  scenes: [
    {
      id: 'w08-scene-1',
      order: 1,
      title: 'No Geometry Before Calibration',
      narration:
        'Every downstream quantity — disparity, pose, depth — is only as trustworthy as the intrinsics feeding it. Running stereo on un-undistorted frames bakes lens error into every meter. Commit the dependency argument: which stages fail silently if calibration is skipped?',
      goal: 'Commit a thought on calibration as the upstream dependency of all geometric stages.',
      goldNodeIds: ['g2', 'g3', 'g4'],
      elicitation: 'code-cell',
      hints: [
        'Undistorted frames are a precondition for rectification and projection.',
        'Stereo on raw frames produces a subtly wrong disparity map — no error thrown.',
      ],
    },
    {
      id: 'w08-scene-2',
      order: 2,
      title: 'Front-End Discipline',
      narration:
        'Describe → filter → verify → estimate. Skipping the RANSAC gate and estimating pose on all matches is the classic midterm failure: one outlier warps the essential matrix. Commit the stage ordering and what each stage removes.',
      goal: 'Commit a thought on the describe→match→RANSAC→estimate ordering.',
      goldNodeIds: ['g5', 'g6', 'g7'],
      elicitation: 'code-cell',
      hints: [
        'Ratio test removes ambiguous matches; RANSAC removes geometric outliers.',
        'findEssentialMat on unfiltered matches is contaminated from the start.',
      ],
    },
    {
      id: 'w08-scene-3',
      order: 3,
      title: 'Depth Coverage as Evidence',
      narration:
        'A depth map that is 90% holes tells you the scene or the calibration failed — the coverage fraction is itself a signal. Commit why the accept gate belongs before any downstream consumer and which failures each gate catches.',
      goal: 'Commit a thought on validity coverage as an end-of-pipeline health metric.',
      goldNodeIds: ['g8', 'g9', 'g10'],
      elicitation: 'code-cell',
      hints: [
        'Z = f·B/d then isfinite & range checks, then coverage fraction.',
        'Low coverage flags textureless input, bad rectification, or wrong intrinsics.',
      ],
    },
  ],
  goldTree: {
    labSlug: 'week-8-midterm-review',
    rootId: 'g1',
    version: 1,
    prunedNodeIds: [],
    activePath: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10'],
    nodes: [
      { id: 'g1', label: 'Audit the pipeline end to end', content: 'calibration upstream, disciplined front end, coverage-gated depth — each stage verified before the next consumes it', kind: 'goal', status: 'confirmed', parentId: null },
      { id: 'g2', label: 'Calibrate before geometry', content: 'undistort + rectify are preconditions; skipping them corrupts every downstream estimate', kind: 'subgoal', status: 'confirmed' },
      { id: 'g3', label: 'undistort → rectify → match', content: 'ordered acquisition stage producing rectified pair and disparity', kind: 'operator', status: 'confirmed' },
      { id: 'g4', label: 'Calibrated inputs propagate correctly', content: 'all stages share the same verified intrinsics — no mixed-frame bug', kind: 'evidence', status: 'confirmed' },
      { id: 'g5', label: 'Disciplined front end', content: 'filter and verify matches before pose estimation, never after', kind: 'subgoal', status: 'confirmed' },
      { id: 'g6', label: 'describe → ratio → RANSAC → essential', content: 'each stage narrows the candidate set the next stage sees', kind: 'operator', status: 'confirmed' },
      { id: 'g7', label: 'Pose rests on inliers only', content: 'the essential matrix fit excludes outliers — the failure the ordering prevents', kind: 'evidence', status: 'confirmed' },
      { id: 'g8', label: 'Gate depth coverage', content: 'accept a frame only if enough of it produces valid metric depth', kind: 'subgoal', status: 'confirmed' },
      { id: 'g9', label: 'f·B/d + validity + coverage', content: 'depth map, range mask, then fraction-of-valid-pixels accept gate', kind: 'operator', status: 'confirmed' },
      { id: 'g10', label: 'Coverage flags pipeline health', content: 'sudden coverage drops localize the broken stage upstream', kind: 'evidence', status: 'confirmed' },
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
