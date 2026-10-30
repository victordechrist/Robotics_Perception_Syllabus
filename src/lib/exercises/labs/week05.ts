import type { LabExercise } from '../types';

// Week 5 — stereo: disparity → depth via f·B/d; decoys forget the
// focal·baseline product or invert the fraction.
export const week05Exercise: LabExercise = {
  labSlug: 'week-5-stereo-vision',
  title: 'Guided Exercise: Disparity to Depth',
  intro:
    'Assemble the stereo depth pipeline in order. One block per step is a decoy — it looks right but is not.',
  steps: [
    {
      id: 'w05-s1',
      order: 1,
      title: 'Rectified disparity',
      instruction:
        'Build the matching stage: rectified left/right grays, StereoBM config, then compute the disparity map (scaled by 16 in OpenCV).',
      expectedInput: 'rectL, rectR grayscale',
      expectedOutput: 'disparity map in pixels',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: "stereo = cv2.StereoBM_create(numDisparities=64, blockSize=15)", caption: 'Matcher config' },
        { id: 'b2', code: 'disp16 = stereo.compute(rectL, rectR)', caption: 'Compute' },
        { id: 'b3', code: 'disp = disp16.astype(np.float32) / 16.0', caption: 'Fixed-point divide' },
        { id: 'b4', code: 'disp = stereo.compute(rectR, rectL) / 16.0', caption: 'Swapped views', isDistractor: true },
      ],
    },
    {
      id: 'w05-s2',
      order: 2,
      title: 'Depth from disparity',
      instruction:
        'Convert disparity to metric depth using the focal·baseline product — Z = f·B/d, guarding zero disparity first.',
      expectedInput: 'disp map, f (px), B (meters)',
      expectedOutput: 'depth map Z in meters',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'mask = disp > 0.5', caption: 'Valid disparity' },
        { id: 'b2', code: 'Z = np.full_like(disp, np.inf)\nZ[mask] = (f * B) / disp[mask]', caption: 'f·B / d' },
        { id: 'b3', code: 'return Z', caption: 'Return' },
        { id: 'b4', code: 'Z[mask] = disp[mask] / (f * B)', caption: 'Inverted ratio', isDistractor: true },
      ],
    },
    {
      id: 'w05-s3',
      order: 3,
      title: 'Back-project to 3D',
      instruction:
        'Reconstruct the point cloud: pixel + depth through the inverse intrinsics into camera-frame XYZ.',
      expectedInput: 'Z map, K, image size',
      expectedOutput: '(H,W,3) point cloud',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'u, v = np.meshgrid(np.arange(W), np.arange(H))', caption: 'Pixel grid' },
        { id: 'b2', code: 'X = (u - cx) * Z / fx\nY = (v - cy) * Z / fy', caption: 'Back-project' },
        { id: 'b3', code: 'cloud = np.dstack([X, Y, Z])', caption: 'Stack XYZ' },
        { id: 'b4', code: 'X = (u - cx) / Z * fx', caption: 'Divide by depth', isDistractor: true },
      ],
    },
  ],
};
