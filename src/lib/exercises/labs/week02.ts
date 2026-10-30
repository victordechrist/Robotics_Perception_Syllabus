import type { LabExercise } from '../types';

// Week 2 — pinhole projection order: undistort-vs-project sequencing,
// principal-point handling, pixel conversion.
export const week02Exercise: LabExercise = {
  labSlug: 'week-2-pinhole-camera',
  title: 'Guided Exercise: From World Point to Pixel',
  intro:
    'Assemble the pinhole camera pipeline in order. One block per step is a decoy — it looks right but is not.',
  steps: [
    {
      id: 'w02-s1',
      order: 1,
      title: 'Project a 3D point',
      instruction:
        'Project a camera-frame point onto the normalized image plane: divide by depth first, never after pixel scaling.',
      expectedInput: 'P = (X, Y, Z) camera frame, Z > 0',
      expectedOutput: 'normalized (x, y) on the plane z=1',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'x_n = P[0] / P[2]\ny_n = P[1] / P[2]', caption: 'Perspective divide' },
        { id: 'b2', code: 'point_n = np.array([x_n, y_n])', caption: 'Normalized point' },
        { id: 'b3', code: 'return point_n', caption: 'Return' },
        { id: 'b4', code: 'x_n = P[0] * P[2]', caption: 'Depth multiply', isDistractor: true },
      ],
    },
    {
      id: 'w02-s2',
      order: 2,
      title: 'Apply intrinsic matrix K',
      instruction:
        'Map normalized coordinates to pixels with K — homogeneous multiply, then read off u, v.',
      expectedInput: 'K (3×3 intrinsics), point_n (2-vector)',
      expectedOutput: 'pixel (u, v)',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'p_h = np.append(point_n, 1.0)', caption: 'Homogenize' },
        { id: 'b2', code: 'uv = K @ p_h', caption: 'K multiply' },
        { id: 'b3', code: 'return uv[:2]', caption: 'Read u, v' },
        { id: 'b4', code: 'uv = p_h @ K', caption: 'Row-vector multiply', isDistractor: true },
      ],
    },
    {
      id: 'w02-s3',
      order: 3,
      title: 'Distortion pipeline order',
      instruction:
        'Chain the full step the lab uses: project, apply radial+tangential distortion in normalized space, THEN apply K. The decoy swaps distortion after K.',
      expectedInput: 'P, K, distortion coeffs (k1,k2,p1,p2,k3)',
      expectedOutput: 'distorted pixel (u, v)',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'xn, yn = P[0]/P[2], P[1]/P[2]', caption: 'Project first' },
        { id: 'b2', code: 'r2 = xn*xn + yn*yn\nxd = xn*(1 + k1*r2 + k2*r2**2) + 2*p1*xn*yn + p2*(r2 + 2*xn*xn)\nyd = yn*(1 + k1*r2 + k2*r2**2) + p1*(r2 + 2*yn*yn) + 2*p2*xn*yn', caption: 'Distort normalized' },
        { id: 'b3', code: 'uv = K @ np.array([xd, yd, 1.0])\nreturn uv[:2]', caption: 'K last' },
        { id: 'b4', code: 'ud, vd = distort_pixels(K @ p_h)', caption: 'Distort in pixels', isDistractor: true },
      ],
    },
  ],
};
