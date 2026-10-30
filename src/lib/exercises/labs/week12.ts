import type { LabExercise } from '../types';

// Week 12 — visual SLAM: frontend tracks → keyframe → pose-graph optimize →
// map update. Decoy optimizes every frame or skips loop closure.
export const week12Exercise: LabExercise = {
  labSlug: 'week-12-visual-slam',
  title: 'Guided Exercise: Pose-Graph SLAM Loop',
  intro:
    'Assemble the visual-SLAM iteration in order. One block per step is a decoy — it looks right but is not.',
  steps: [
    {
      id: 'w12-s1',
      order: 1,
      title: 'Front end: tracks → keyframe',
      instruction:
        'Order the front end: track features between consecutive frames, estimate relative pose, then promote a new keyframe only when parallax demands it.',
      expectedInput: 'frame stream, tracked features',
      expectedOutput: 'keyframe + edge constraint',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'p1 = track(prev_frame, frame, p0)', caption: 'Track' },
        { id: 'b2', code: 'rel_pose = estimate_relative(p0, p1)', caption: 'Relative pose' },
        { id: 'b3', code: 'if parallax_ok(rel_pose): add_keyframe()', caption: 'Keyframe gate' },
        { id: 'b4', code: 'add_keyframe(every_frame)', caption: 'Keyframe everything', isDistractor: true },
      ],
    },
    {
      id: 'w12-s2',
      order: 2,
      title: 'Close the loop',
      instruction:
        'Detect a revisit: run place recognition against past keyframes, verify geometrically, then add the loop-closure edge to the graph.',
      expectedInput: 'new keyframe, keyframe DB',
      expectedOutput: 'loop edge (or none)',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'cand = dbow_query(keyframe)', caption: 'Place lookup' },
        { id: 'b2', code: 'inl = geometric_verify(keyframe, cand)', caption: 'Verify' },
        { id: 'b3', code: 'if inl > tau: add_loop_edge(cand)', caption: 'Loop edge' },
        { id: 'b4', code: 'add_loop_edge(cand)', caption: 'Unverified edge', isDistractor: true },
      ],
    },
    {
      id: 'w12-s3',
      order: 3,
      title: 'Optimize the graph',
      instruction:
        'Back end: run pose-graph optimization over all constraints, then re-project the map points with corrected poses.',
      expectedInput: 'pose graph, loop constraints',
      expectedOutput: 'corrected poses + map',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'poses = gtsam_optimize(graph)', caption: 'Graph optimize' },
        { id: 'b2', code: 'map_pts = triangulate(kf_pairs, poses)', caption: 'Re-triangulate' },
        { id: 'b3', code: 'return poses, map_pts', caption: 'Return' },
        { id: 'b4', code: 'poses = gtsam_optimize(each_frame)', caption: 'Optimize per frame', isDistractor: true },
      ],
    },
  ],
};
