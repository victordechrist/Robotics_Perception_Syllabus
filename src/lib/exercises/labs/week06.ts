import type { LabExercise } from '../types';

// Week 6 — optical flow: Lucas-Kanade solve order — gradients, least squares
// per window, then pyramidal tracking.
export const week06Exercise: LabExercise = {
  labSlug: 'week-6-optical-flow',
  title: 'Guided Exercise: Lucas-Kanade Tracking',
  intro:
    'Assemble the optical-flow pipeline in order. One block per step is a decoy — it looks right but is not.',
  steps: [
    {
      id: 'w06-s1',
      order: 1,
      title: 'Flow equation per window',
      instruction:
        'Assemble the LK system: spatial gradients Ix, Iy, temporal gradient It, then AᵀA·u = −Aᵀb per window. The decoy solves without the least-squares form.',
      expectedInput: 'two consecutive gray frames',
      expectedOutput: 'flow vectors per window',
      solution: ['b1', 'b2', 'b3', 'b4'],
      blocks: [
        { id: 'b1', code: 'Ix = cv2.Sobel(I_prev, cv2.CV_64F, 1, 0, 3)\nIy = cv2.Sobel(I_prev, cv2.CV_64F, 0, 1, 3)', caption: 'Spatial gradients' },
        { id: 'b2', code: 'It = I_curr.astype(np.float64) - I_prev.astype(np.float64)', caption: 'Temporal diff' },
        { id: 'b3', code: 'A = np.stack([Ix_w.ravel(), Iy_w.ravel()], axis=1)\nb = It_w.ravel()', caption: 'Linear system' },
        { id: 'b4', code: 'u = -np.linalg.inv(A.T @ A) @ A.T @ b', caption: 'Least squares' },
        { id: 'b5', code: 'u = np.linalg.solve(A, b)', caption: 'Direct square solve', isDistractor: true },
      ],
    },
    {
      id: 'w06-s2',
      order: 2,
      title: 'Aperture-safety check',
      instruction:
        'Before trusting each flow vector, verify the window has texture in both directions — eigenvalues of AᵀA above a threshold.',
      expectedInput: 'AᵀA per window',
      expectedOutput: 'accept/reject mask',
      solution: ['b1', 'b2'],
      blocks: [
        { id: 'b1', code: 'lam = np.linalg.eigvalsh(A.T @ A)', caption: 'Eigenvalues' },
        { id: 'b2', code: 'ok = lam.min() > tau', caption: 'Min-eigen test' },
        { id: 'b3', code: 'ok = lam.max() > tau', caption: 'Max-eigen test', isDistractor: true },
      ],
    },
    {
      id: 'w06-s3',
      order: 3,
      title: 'Pyramidal tracking',
      instruction:
        'Scale up to real video: pick corner points, run pyramidal LK forward, then keep tracks that survive the forward-backward consistency check.',
      expectedInput: 'frame stream, Shi-Tomasi corners',
      expectedOutput: 'tracked point set',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'p0 = cv2.goodFeaturesToTrack(gray0, 200, 0.01, 7)', caption: 'Seed corners' },
        { id: 'b2', code: 'p1, st, _ = cv2.calcOpticalFlowPyrLK(g0, g1, p0, None)', caption: 'Pyramidal LK' },
        { id: 'b3', code: 'good = forward_backward_check(p0, p1) & (st == 1)', caption: 'Consistency filter' },
        { id: 'b4', code: 'good = st == 1', caption: 'Status only', isDistractor: true },
      ],
    },
  ],
};
