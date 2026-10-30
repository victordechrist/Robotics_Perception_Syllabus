import type { LabTask } from '../types';

export const week05Task: LabTask = {
  labSlug: 'week-5-stereo-vision',
  title: 'Reasoning Through Stereo Depth',
  brief:
    'Narrate the stereo pipeline: why rectification must precede matching, why depth is the focal·baseline product over disparity, and what validity checks keep bad geometry out of the cloud. Each scene asks you to commit a thought; the scoreboard tracks alignment.',
  scenes: [
    {
      id: 'w05-scene-1',
      order: 1,
      title: 'One Row of Search Space',
      narration:
        'Stereo matching is only cheap because epipolar geometry confines the correspondence to one scanline — but only if the pair is rectified. Commit why rectification precedes block matching and what breaks without it.',
      goal: 'Commit a thought on rectification collapsing matching to a 1D search.',
      goldNodeIds: ['g2', 'g3', 'g4'],
      elicitation: 'code-cell',
      hints: [
        'Epipolar lines become horizontal scanlines after rectification.',
        'Without it, the matcher searches a 2D region and drowns in false positives.',
      ],
    },
    {
      id: 'w05-scene-2',
      order: 2,
      title: 'The Triangulation Fraction',
      narration:
        'Depth is not linear in disparity — it is f·B divided by it. A one-pixel disparity error at 50m depth moves the answer by meters, at 5m by millimeters. Commit why the product lives in the numerator and what asymmetric error tolerance this gives near vs far points.',
      goal: 'Commit a thought on Z = f·B/d and the asymmetric error behavior.',
      goldNodeIds: ['g5', 'g6', 'g7'],
      elicitation: 'code-cell',
      hints: [
        'Similar triangles over the baseline give Z = f·B/d.',
        'Far objects have small disparity → small errors blow up.',
      ],
    },
    {
      id: 'w05-scene-3',
      order: 3,
      title: 'A Cloud Full of Holes Is a Signal',
      narration:
        'Textureless walls and occlusions yield no confident disparity — masking them out is correct, not a bug. Commit which validity gates belong between disparity and the point cloud, and what each rejects.',
      goal: 'Commit a thought on disparity-validity masking before back-projection.',
      goldNodeIds: ['g8', 'g9', 'g10'],
      elicitation: 'code-cell',
      hints: [
        'disp ≤ 0 and non-finite depths get masked before back-projection.',
        'A speckle/consistency filter rejects noisy blocks in flat regions.',
      ],
    },
  ],
  goldTree: {
    labSlug: 'week-5-stereo-vision',
    rootId: 'g1',
    version: 1,
    prunedNodeIds: [],
    activePath: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10'],
    nodes: [
      { id: 'g1', label: 'Recover metric depth from a stereo pair', content: 'rectify, match in 1D, triangulate with f·B/d, gate invalid geometry', kind: 'goal', status: 'confirmed', parentId: null },
      { id: 'g2', label: 'Rectify before matching', content: 'epipolar alignment collapses correspondence search to a single scanline', kind: 'subgoal', status: 'confirmed' },
      { id: 'g3', label: 'Row-aligned block matching', content: 'StereoBM on rectified pairs searches disparities along a row', kind: 'operator', status: 'confirmed' },
      { id: 'g4', label: 'Disparity map per pixel', content: 'left-right horizontal shift — the raw material of depth', kind: 'evidence', status: 'confirmed' },
      { id: 'g5', label: 'Depth = f·B / disparity', content: 'similar triangles over the baseline, not a linear scale', kind: 'subgoal', status: 'confirmed' },
      { id: 'g6', label: 'Compute Z = f·B/d elementwise', content: 'guard zero/small disparity, apply the product over disparity', kind: 'operator', status: 'confirmed' },
      { id: 'g7', label: 'Far points tolerate less error', content: '1px disparity error is millimeters near and meters far — depth precision falls with 1/Z', kind: 'evidence', status: 'confirmed' },
      { id: 'g8', label: 'Mask invalid geometry', content: 'textureless/occluded regions must not emit fake points into the cloud', kind: 'subgoal', status: 'confirmed' },
      { id: 'g9', label: 'Validity + range gates', content: 'disp>0, finite Z, plausible depth range before back-projection', kind: 'operator', status: 'confirmed' },
      { id: 'g10', label: 'Clean back-projected cloud', content: 'K⁻¹ applied to valid pixels yields a metric (H,W,3) scene', kind: 'evidence', status: 'confirmed' },
    ],
    edges: [
      { from: 'g1', to: 'g2', relation: 'elaborates' },
      { from: 'g1', to: 'g5', relation: 'elaborates' },
      { from: 'g1', to: 'g8', relation: 'elaborates' },
      { from: 'g2', to: 'g3', relation: 'elaborates' },
      { from: 'g3', to: 'g4', relation: 'elaborates' },
      { from: 'g5', to: 'g6', relation: 'elaborates' },
      { from: 'g6', to: 'g7', relation: 'elaborates' },
      { from: 'g4', to: 'g5', relation: 'depends-on' },
      { from: 'g8', to: 'g9', relation: 'elaborates' },
      { from: 'g9', to: 'g10', relation: 'elaborates' },
    ],
  },
};
