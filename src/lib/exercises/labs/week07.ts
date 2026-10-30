import type { LabExercise } from '../types';

// Week 7 — calibration: detect board → object points → calibrateCamera →
// undistort/solvePnP verify.
export const week07Exercise: LabExercise = {
  labSlug: 'week-7-camera-calibration',
  title: 'Guided Exercise: Calibration Pipeline',
  intro:
    'Assemble the camera-calibration pipeline in order. One block per step is a decoy — it looks right but is not.',
  steps: [
    {
      id: 'w07-s1',
      order: 1,
      title: 'Correspondence sets',
      instruction:
        'Build the input for solve: object points on the calibration grid (z=0 plane) paired with detected image corners.',
      expectedInput: 'chessboard/ArUco detections across views',
      expectedOutput: 'objPoints[] and imgPoints[]',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'objp = np.zeros((rows*cols, 3), np.float32)\nobjp[:, :2] = np.mgrid[0:rows, 0:cols].T.reshape(-1, 2) * square_size', caption: 'Grid coords' },
        { id: 'b2', code: 'objpoints.append(objp)\nimgpoints.append(corners_subpix)', caption: 'Pair them' },
        { id: 'b3', code: 'return objpoints, imgpoints', caption: 'Return lists' },
        { id: 'b4', code: 'objp[:, :2] = np.mgrid[0:cols, 0:rows].T.reshape(-1, 2)', caption: 'Swapped grid', isDistractor: true },
      ],
    },
    {
      id: 'w07-s2',
      order: 2,
      title: 'Solve intrinsics',
      instruction:
        'Run the calibration: cv2.calibrateCamera over all views, read K and distortion coefficients, record RMS reprojection error.',
      expectedInput: 'objpoints, imgpoints, image size',
      expectedOutput: 'K, dist, RMS error',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'rms, K, dist, rvecs, tvecs = cv2.calibrateCamera(objpoints, imgpoints, size, None, None)', caption: 'Calibrate' },
        { id: 'b2', code: 'print(f"RMS reprojection: {rms:.3f} px")', caption: 'Report error' },
        { id: 'b3', code: 'return K, dist', caption: 'Return' },
        { id: 'b4', code: 'K, dist, *_ = cv2.calibrateCamera(objpoints, imgpoints, size, None, None)', caption: 'Swapped returns', isDistractor: true },
      ],
    },
    {
      id: 'w07-s3',
      order: 3,
      title: 'Verify with reprojection',
      instruction:
        'Sanity-check the result: reproject the object points through the solved K/dist and compare against the detected corners per view.',
      expectedInput: 'K, dist, rvecs/tvecs, one view',
      expectedOutput: 'per-view reprojection error',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'proj, _ = cv2.projectPoints(objpoints[i], rvecs[i], tvecs[i], K, dist)', caption: 'Reproject' },
        { id: 'b2', code: 'err = np.linalg.norm(proj - imgpoints[i]) / len(objpoints[i])', caption: 'Mean pixel err' },
        { id: 'b3', code: 'return err', caption: 'Return' },
        { id: 'b4', code: 'proj, _ = cv2.projectPoints(imgpoints[i], rvecs[i], tvecs[i], K, dist)', caption: 'Project detections', isDistractor: true },
      ],
    },
  ],
};
