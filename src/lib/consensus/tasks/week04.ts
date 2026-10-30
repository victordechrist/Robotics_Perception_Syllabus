import type { LabTask } from '../types';

export const week04Task: LabTask = {
  labSlug: 'week-4-feature-matching',
  title: 'Reasoning Through Feature Registration',
  brief:
    'Narrate the matching pipeline: why descriptors beat pixel patches, why the ratio test discards ambiguous matches, and why RANSAC must gate the homography. Each scene asks you to commit a thought; the scoreboard tracks alignment.',
  scenes: [
    {
      id: 'w04-scene-1',
      order: 1,
      title: 'Repeatable Points, Distinctive Descriptions',
      narration:
        'Matching raw pixels fails under rotation and lighting change. The detector must find the SAME points in both images and the descriptor must describe them in a way that survives the transformation. Commit what invariance each stage must provide.',
      goal: 'Commit a thought on keypoint repeatability + descriptor invariance.',
      goldNodeIds: ['g2', 'g3', 'g4'],
      elicitation: 'code-cell',
      hints: [
        'The detector wants corners/structure that re-detects across viewpoint.',
        'ORB-style binary descriptors are rotation-normalized and cheap to match.',
      ],
    },
    {
      id: 'w04-scene-2',
      order: 2,
      title: 'Ambiguity Is the Enemy',
      narration:
        'A nearest-neighbor match that almost loses to its second choice tells you nothing — repetitive texture makes thousands of descriptors look alike. Commit why the ratio test m.d < 0.75·n.d removes exactly these dangerous matches.',
      goal: 'Commit a thought on how the ratio test filters ambiguous matches.',
      goldNodeIds: ['g5', 'g6', 'g7'],
      elicitation: 'code-cell',
      hints: [
        'A correct match has a decisive margin over the second candidate.',
        'Ratio ≈ 1 means ambiguity — the match is a coin flip, discard it.',
      ],
    },
    {
      id: 'w04-scene-3',
      order: 3,
      title: 'Geometry Decides, Not Votes',
      narration:
        'Even filtered matches hold outliers — a repeated brick pattern still slips through. Least-squares over all matches lets one bad pair poison the homography. Commit why RANSAC-style robust fitting must gate the transform, and what the inlier set tells you.',
      goal: 'Commit a thought on robust estimation and reading the inlier mask as evidence.',
      goldNodeIds: ['g8', 'g9', 'g10'],
      elicitation: 'code-cell',
      hints: [
        'RANSAC fits on minimal subsets and scores consensus — outliers cannot poison the winning model.',
        'Inlier count/ratio is itself evidence about whether the scene geometry is rigid.',
      ],
    },
  ],
  goldTree: {
    labSlug: 'week-4-feature-matching',
    rootId: 'g1',
    version: 1,
    prunedNodeIds: [],
    activePath: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10'],
    nodes: [
      { id: 'g1', label: 'Register two views correctly', content: 'describe distinctive points, filter ambiguous matches, verify geometrically before estimating the transform', kind: 'goal', status: 'confirmed', parentId: null },
      { id: 'g2', label: 'Invariant keypoints + descriptors', content: 'repeatable detection plus rotation/lighting-invariant description is what makes cross-image matching possible', kind: 'subgoal', status: 'confirmed' },
      { id: 'g3', label: 'detectAndCompute both views', content: 'ORB-style keypoints + binary descriptors on both images, kept aligned per index', kind: 'operator', status: 'confirmed' },
      { id: 'g4', label: 'Matches are candidate correspondences', content: 'each query descriptor pairs with its best train candidates — evidence set for filtering', kind: 'evidence', status: 'confirmed' },
      { id: 'g5', label: 'Filter by decisiveness', content: 'ambiguous matches (nearest ≈ second-nearest) get discarded before geometry is attempted', kind: 'subgoal', status: 'confirmed' },
      { id: 'g6', label: 'Lowe ratio test', content: 'm.distance < 0.75 · n.distance keeps only matches with a decisive margin', kind: 'operator', status: 'confirmed' },
      { id: 'g7', label: 'Repetitive texture removed', content: 'windows, bricks, grids lose their near-tied matches — precision jumps', kind: 'evidence', status: 'confirmed' },
      { id: 'g8', label: 'Gate the transform robustly', content: 'a single outlier pair cannot be allowed to poison the estimated homography', kind: 'subgoal', status: 'confirmed' },
      { id: 'g9', label: 'RANSAC minimal-subset fitting', content: 'fit homography on small consensus samples; keep the model with the most inliers', kind: 'operator', status: 'confirmed' },
      { id: 'g10', label: 'Inlier mask validates the model', content: 'high inlier count confirms scene rigidity + correct matches; low count flags a bad pair', kind: 'evidence', status: 'confirmed' },
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
