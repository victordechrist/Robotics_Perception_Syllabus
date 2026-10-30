import type { LabExercise } from '../types';

// Week 8 — midterm review: end-to-end pipeline ordering exercise.
export const week08Exercise: LabExercise = {
  labSlug: 'week-8-midterm-review',
  title: 'Guided Exercise: Perception Pipeline Audit',
  intro:
    'Order the full perception pipeline end to end. One block per step is a decoy — it looks right but is not.',
  steps: [
    {
      id: 'w08-s1',
      order: 1,
      title: 'Calibration before geometry',
      instruction:
        'Order the acquisition stage correctly: undistort with K/dist before any projective or stereo math uses the frames.',
      expectedInput: 'raw frames, calibrated K/dist',
      expectedOutput: 'undistorted frame pair',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'frames = load_stereo_pair()', caption: 'Load' },
        { id: 'b2', code: 'L = cv2.undistort(L_raw, K, dist)\nR = cv2.undistort(R_raw, K, dist)', caption: 'Undistort' },
        { id: 'b3', code: 'rectL, rectR = stereo_rectify_maps(L, R)', caption: 'Rectify' },
        { id: 'b4', code: 'disp = stereo.compute(L_raw, R_raw)', caption: 'Match on raw', isDistractor: true },
      ],
    },
    {
      id: 'w08-s2',
      order: 2,
      title: 'Front-end ordering',
      instruction:
        'Order the visual front end: detect/describe → ratio-test matches → RANSAC inlier set → relative pose.',
      expectedInput: 'undistorted pair',
      expectedOutput: 'relative pose estimate',
      solution: ['b1', 'b2', 'b3', 'b4'],
      blocks: [
        { id: 'b1', code: 'kp1, des1 = orb.detectAndCompute(L, None)\nkp2, des2 = orb.detectAndCompute(R, None)', caption: 'Describe' },
        { id: 'b2', code: 'good = ratio_test(bf.knnMatch(des1, des2, k=2))', caption: 'Match' },
        { id: 'b3', code: 'H, mask = cv2.findHomography(src, dst, cv2.RANSAC, 3.0)', caption: 'RANSAC' },
        { id: 'b4', code: 'E, inl = cv2.findEssentialMat(src_in, dst_in, K)', caption: 'Pose' },
        { id: 'b5', code: 'E, inl = cv2.findEssentialMat(src_all, dst_all, K)', caption: 'Pose on all matches', isDistractor: true },
      ],
    },
    {
      id: 'w08-s3',
      order: 3,
      title: 'Depth sanity gate',
      instruction:
        'Finish the audit: convert disparity to depth and gate on the fraction of valid (positive, finite) depths before accepting the frame.',
      expectedInput: 'disp map, f, B',
      expectedOutput: 'accept/reject flag',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'Z = (f * B) / np.maximum(disp, 1e-6)', caption: 'Depth' },
        { id: 'b2', code: 'valid = np.isfinite(Z) & (Z > 0) & (Z < 80)', caption: 'Range filter' },
        { id: 'b3', code: 'accept = valid.mean() > 0.3', caption: 'Coverage gate' },
        { id: 'b4', code: 'Z = disp / (f * B)', caption: 'Inverted depth', isDistractor: true },
      ],
    },
  ],
};
