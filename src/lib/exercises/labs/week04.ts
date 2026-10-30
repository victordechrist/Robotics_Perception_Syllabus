import type { LabExercise } from '../types';

// Week 4 — feature matching: describe→match→RANSAC homography; the decoy
// trusts raw nearest matches without geometric verification.
export const week04Exercise: LabExercise = {
  labSlug: 'week-4-feature-matching',
  title: 'Guided Exercise: Match → Verify → Register',
  intro:
    'Assemble the feature-matching pipeline in order. One block per step is a decoy — it looks right but is not.',
  steps: [
    {
      id: 'w04-s1',
      order: 1,
      title: 'Detect and describe',
      instruction:
        'Build the descriptor stage: detect keypoints in both images, compute ORB descriptors, keep the two sets aligned.',
      expectedInput: 'imgA, imgB grayscale',
      expectedOutput: 'kpA/desA, kpB/desB',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'orb = cv2.ORB_create(nfeatures=2000)', caption: 'Detector init' },
        { id: 'b2', code: 'kpA, desA = orb.detectAndCompute(imgA, None)', caption: 'Describe A' },
        { id: 'b3', code: 'kpB, desB = orb.detectAndCompute(imgB, None)', caption: 'Describe B' },
        { id: 'b4', code: 'desA = orb.detect(imgA)', caption: 'Detect without describe', isDistractor: true },
      ],
    },
    {
      id: 'w04-s2',
      order: 2,
      title: 'Ratio-test matches',
      instruction:
        'Filter matches with Lowe\'s ratio test: keep a match only when the nearest neighbor is meaningfully closer than the second-nearest.',
      expectedInput: 'desA, desB; BFMatcher Hamming',
      expectedOutput: 'filtered match list',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'pairs = bf.knnMatch(desA, desB, k=2)', caption: 'kNN match' },
        { id: 'b2', code: 'good = [m for m, n in pairs if m.distance < 0.75 * n.distance]', caption: 'Ratio test' },
        { id: 'b3', code: 'return good', caption: 'Keep good' },
        { id: 'b4', code: 'good = [m for m, n in pairs if m.distance < n.distance]', caption: 'Weaker-than-second test', isDistractor: true },
      ],
    },
    {
      id: 'w04-s3',
      order: 3,
      title: 'RANSAC homography',
      instruction:
        'Close the loop: gather matched point pairs, estimate the homography with RANSAC, keep only the inlier set.',
      expectedInput: 'good matches, kpA/kpB',
      expectedOutput: 'H matrix + inlier mask',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'src = np.float32([kpA[m.queryIdx].pt for m in good])\ndst = np.float32([kpB[m.trainIdx].pt for m in good])', caption: 'Point pairs' },
        { id: 'b2', code: 'H, mask = cv2.findHomography(src, dst, cv2.RANSAC, 4.0)', caption: 'RANSAC fit' },
        { id: 'b3', code: 'inliers = good[mask.ravel() == 1]', caption: 'Inlier set' },
        { id: 'b4', code: 'H, mask = cv2.findHomography(src, dst)', caption: 'Least-squares all', isDistractor: true },
      ],
    },
  ],
};
