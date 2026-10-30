import type { LabTask } from '../types';

export const week03Task: LabTask = {
  labSlug: 'week-3-image-processing',
  title: 'Reasoning Through Edge & Corner Detection',
  brief:
    'Narrate the edge/corner pipeline: why smoothing must precede differentiation, why Canny is a three-stage filter not a threshold, and what the Harris score actually measures. Each scene asks you to commit a thought; the scoreboard tracks alignment.',
  scenes: [
    {
      id: 'w03-scene-1',
      order: 1,
      title: 'Differentiate Last, Smooth First',
      narration:
        'Derivatives amplify high-frequency noise by design. Apply Sobel to a raw image and you edge-detect noise, not structure. Commit why Gaussian smoothing must run before the derivative kernels, and what tradeoff the kernel size makes.',
      goal: 'Commit a thought on noise amplification and the smooth-then-derivative ordering.',
      goldNodeIds: ['g2', 'g3', 'g4'],
      elicitation: 'code-cell',
      hints: [
        'A noisy pixel patch turns into a large local gradient.',
        'Bigger σ kills more noise but blurs real edges too.',
      ],
    },
    {
      id: 'w03-scene-2',
      order: 2,
      title: 'Why Canny Has Three Stages',
      narration:
        'Canny is not "threshold the gradient." Magnitude+angle feeds non-max suppression to thin ridges, then hysteresis connects weak edges that belong to strong ones. Commit what each stage removes that a single threshold cannot.',
      goal: 'Commit a thought on the role of NMS and hysteresis in Canny.',
      goldNodeIds: ['g5', 'g6', 'g7'],
      elicitation: 'code-cell',
      hints: [
        'NMS keeps only local maxima along the gradient direction — edges get one pixel thin.',
        'Hysteresis rescues weak-but-connected edge segments the high threshold alone would drop.',
      ],
    },
    {
      id: 'w03-scene-3',
      order: 3,
      title: 'What a Corner Actually Is',
      narration:
        'Harris scores each window by the eigenvalues of its structure tensor M. A corner needs strong response in BOTH directions — edges fire on one. Commit why R = det(M) − k·trace(M)² discriminates corners without computing eigenvalues.',
      goal: 'Commit a thought on how det(M) and trace(M) encode both-eigenvalue conditions cheaply.',
      goldNodeIds: ['g8', 'g9', 'g10'],
      elicitation: 'code-cell',
      hints: [
        'det(M) = λ1·λ2; trace(M) = λ1+λ2 — both large only at a corner.',
        'k·trace² penalizes single-direction responses (edges).',
      ],
    },
  ],
  goldTree: {
    labSlug: 'week-3-image-processing',
    rootId: 'g1',
    version: 1,
    prunedNodeIds: [],
    activePath: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10'],
    nodes: [
      { id: 'g1', label: 'Extract edges and corners reliably', content: 'smooth-then-differentiate, multi-stage Canny, tensor-scored corners', kind: 'goal', status: 'confirmed', parentId: null },
      { id: 'g2', label: 'Smooth before differentiating', content: 'Gaussian blur suppresses noise amplification before Sobel kernels run', kind: 'subgoal', status: 'confirmed' },
      { id: 'g3', label: 'Gaussian then Sobel', content: 'cv2.GaussianBlur first, then x/y derivatives on the smoothed image', kind: 'operator', status: 'confirmed' },
      { id: 'g4', label: 'Clean gradient maps', content: 'Gx/Gy respond to real edges, not per-pixel noise — verified by edge-map stability', kind: 'evidence', status: 'confirmed' },
      { id: 'g5', label: 'Run Canny as stages', content: 'magnitude+angle → non-max suppression → hysteresis, each removing what thresholds cannot', kind: 'subgoal', status: 'confirmed' },
      { id: 'g6', label: 'NMS thins, hysteresis links', content: 'suppress non-local-maxima along the gradient, then connect weak edges tied to strong ones', kind: 'operator', status: 'confirmed' },
      { id: 'g7', label: 'Thin connected contours', content: 'one-pixel continuous edges where a raw threshold gives fat broken blobs', kind: 'evidence', status: 'confirmed' },
      { id: 'g8', label: 'Score corners by both eigenvalues', content: 'a corner needs strong gradient response in two directions, not one', kind: 'subgoal', status: 'confirmed' },
      { id: 'g9', label: 'R = det(M) − k·trace(M)²', content: 'det=λ1λ2 and trace=λ1+λ2 encode the both-large condition without eigendecomposition', kind: 'operator', status: 'confirmed' },
      { id: 'g10', label: 'Corners fire, edges suppressed', content: 'the score is high at junctions, low along straight edges and flat regions', kind: 'evidence', status: 'confirmed' },
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
