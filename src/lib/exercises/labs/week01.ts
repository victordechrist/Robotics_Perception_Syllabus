import type { LabExercise } from '../types';

/**
 * Guided exercise for Week 1 — mirrors the lab guide's pipeline:
 * build a 2D rotation matrix → chain SE(2) poses → compose SE(3) transforms.
 * Each step's `solution` block codes concatenate into runnable Python.
 * Exactly one plausible-but-wrong distractor per step.
 */
export const week01Exercise: LabExercise = {
  labSlug: 'week-1-math-foundations',
  title: 'Guided Exercise: Pose Composition Pipeline',
  intro:
    'Assemble each step of the rigid-transformation pipeline in the right order. One block per step is a decoy — it looks right but is not.',
  steps: [
    {
      id: 'w01-s1',
      order: 1,
      title: '2D rotation matrix',
      instruction:
        'Build the SO(2) rotation helper from the lab: take the angle, fill the 2×2 matrix with cos/sin in the right positions, return it.',
      expectedInput: 'import numpy as np; theta in radians',
      expectedOutput: '2×2 matrix R with det(R)==1',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'def rot2d(theta):\n    c, s = np.cos(theta), np.sin(theta)', caption: 'Trig pair' },
        { id: 'b2', code: 'R = np.array([[c, -s], [s, c]])', caption: 'Rotation layout' },
        { id: 'b3', code: 'return R', caption: 'Return R' },
        { id: 'b4', code: 'R = np.array([[c, s], [-s, c]])', caption: 'Sign-flipped layout', isDistractor: true },
      ],
    },
    {
      id: 'w01-s2',
      order: 2,
      title: 'SE(2) pose chain',
      instruction:
        'Chain two planar poses like the lab does: homogeneous-transform each pose, then compose by matrix multiplication in world→body order.',
      expectedInput: 'pose_ab, pose_bc as (x, y, theta) tuples',
      expectedOutput: 'T_ac — the composed 3×3 SE(2) matrix',
      solution: ['b1', 'b2', 'b3', 'b4'],
      blocks: [
        { id: 'b1', code: 'def se2(x, y, theta):\n    R = rot2d(theta)', caption: 'Rotation part' },
        { id: 'b2', code: 'T = np.eye(3)\n    T[:2, :2] = R\n    T[:2, 2] = [x, y]', caption: 'Homogeneous layout' },
        { id: 'b3', code: 'return T', caption: 'Return T' },
        { id: 'b4', code: 'T_ac = se2(*pose_ab) @ se2(*pose_bc)', caption: 'Compose' },
        { id: 'b5', code: 'T_ac = se2(*pose_bc) @ se2(*pose_ab)', caption: 'Reversed compose', isDistractor: true },
      ],
    },
    {
      id: 'w01-s3',
      order: 3,
      title: 'SE(3) transform application',
      instruction:
        'Apply a 4×4 SE(3) transform to a 3D point: promote to homogeneous coordinates, multiply, then drop the w row.',
        expectedInput: 'T (4×4), p (3-vector)',
        expectedOutput: 'transformed point (3-vector)',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'p_h = np.append(p, 1.0)', caption: 'Homogenize' },
        { id: 'b2', code: 'q_h = T @ p_h', caption: 'Transform' },
        { id: 'b3', code: 'return q_h[:3]', caption: 'Dehomogenize' },
        { id: 'b4', code: 'q_h = p_h @ T', caption: 'Row-vector multiply', isDistractor: true },
      ],
    },
    {
      id: 'w01-s4',
      order: 4,
      title: 'Rotation-first sanity check',
      instruction:
        'Finish with the lab\'s invariant check: verify the rotation block stays orthonormal after composition before trusting downstream poses.',
      expectedInput: 'T (4×4 SE(3))',
      expectedOutput: 'boolean pass flag',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'R = T[:3, :3]', caption: 'Extract R' },
        { id: 'b2', code: 'ok = np.allclose(R.T @ R, np.eye(3), atol=1e-9)', caption: 'Orthonormality' },
        { id: 'b3', code: 'return ok and np.isclose(np.linalg.det(R), 1.0)', caption: 'Det == 1' },
        { id: 'b4', code: 'ok = np.allclose(T.T @ T, np.eye(4))', caption: 'Whole-matrix check', isDistractor: true },
      ],
    },
  ],
};
