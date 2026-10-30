import type { LabExercise } from '../types';

// Week 3 — image processing order: smooth-then-derivative, gradient→NMS→
// hysteresis for Canny, Harris corner score.
export const week03Exercise: LabExercise = {
  labSlug: 'week-3-image-processing',
  title: 'Guided Exercise: Edge & Corner Pipeline',
  intro:
    'Assemble each step of the edge/corner extraction pipeline in the right order. One block per step is a decoy — it looks right but is not.',
  steps: [
    {
      id: 'w03-s1',
      order: 1,
      title: 'Smooth before you differentiate',
      instruction:
        'Build the Sobel edge stage: Gaussian-smooth the image first, then apply x/y derivative kernels. The decoy differentiates first — noise wins.',
      expectedInput: 'gray image I',
      expectedOutput: 'Gx, Gy gradient maps',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'Is = cv2.GaussianBlur(I, (5, 5), 1.4)', caption: 'Gaussian smooth' },
        { id: 'b2', code: 'Gx = cv2.Sobel(Is, cv2.CV_64F, 1, 0, ksize=3)', caption: 'x-derivative' },
        { id: 'b3', code: 'Gy = cv2.Sobel(Is, cv2.CV_64F, 0, 1, ksize=3)', caption: 'y-derivative' },
        { id: 'b4', code: 'Gx = cv2.Sobel(I, cv2.CV_64F, 1, 0, ksize=3)\nIs = cv2.GaussianBlur(Gx, (5,5), 1.4)', caption: 'Derivative first', isDistractor: true },
      ],
    },
    {
      id: 'w03-s2',
      order: 2,
      title: 'Canny sequencing',
      instruction:
        'Order the Canny stages: gradient magnitude+angle, non-max suppression along the gradient, then double-threshold hysteresis.',
      expectedInput: 'Gx, Gy from step 1',
      expectedOutput: 'binary edge map',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'mag = np.hypot(Gx, Gy)\nang = np.arctan2(Gy, Gx)', caption: 'Magnitude+angle' },
        { id: 'b2', code: 'thin = non_max_suppress(mag, ang)', caption: 'NMS thinning' },
        { id: 'b3', code: 'edges = hysteresis(thin, low=50, high=150)', caption: 'Hysteresis' },
        { id: 'b4', code: 'thin = hysteresis(mag, low=50, high=150)', caption: 'Threshold before NMS', isDistractor: true },
      ],
    },
    {
      id: 'w03-s3',
      order: 3,
      title: 'Harris corner score',
      instruction:
        'Assemble the Harris detector math: structure tensor from gradients, then R = det(M) − k·trace(M)², threshold and NMS.',
      expectedInput: 'Ix, Iy gradients; k ≈ 0.04',
      expectedOutput: 'corner response map',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'M = np.array([[Ix2_blur, Ixy_blur], [Ixy_blur, Iy2_blur]])', caption: 'Structure tensor' },
        { id: 'b2', code: 'R = np.linalg.det(M) - k * np.trace(M)**2', caption: 'Harris score' },
        { id: 'b3', code: 'corners = nms(R > threshold)', caption: 'Threshold + NMS' },
        { id: 'b4', code: 'R = np.trace(M)**2 - k * np.linalg.det(M)', caption: 'Flipped score', isDistractor: true },
      ],
    },
  ],
};
