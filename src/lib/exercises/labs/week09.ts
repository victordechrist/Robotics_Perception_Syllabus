import type { LabExercise } from '../types';

// Week 9 — noise models: draw samples, propagate covariance through the
// Jacobian, read the resulting ellipse.
export const week09Exercise: LabExercise = {
  labSlug: 'week-9-sensor-noise-models',
  title: 'Guided Exercise: Covariance Propagation',
  intro:
    'Assemble the noise-modeling pipeline in order. One block per step is a decoy — it looks right but is not.',
  steps: [
    {
      id: 'w09-s1',
      order: 1,
      title: 'Sample the noise honestly',
      instruction:
        'Build the measurement noise: zero-mean Gaussian samples shaped by the sensor covariance — Cholesky the covariance, never scale each axis by its stddev.',
      expectedInput: 'covariance Σ (2×2), N samples',
      expectedOutput: 'correlated noise samples',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'L = np.linalg.cholesky(Sigma)', caption: 'Cholesky factor' },
        { id: 'b2', code: 'z = np.random.randn(2, N)', caption: 'White samples' },
        { id: 'b3', code: 'noise = L @ z', caption: 'Correlate' },
        { id: 'b4', code: 'noise = np.diag(np.sqrt(np.diag(Sigma))) @ z', caption: 'Independent axes only', isDistractor: true },
      ],
    },
    {
      id: 'w09-s2',
      order: 2,
      title: 'Propagate through the Jacobian',
      instruction:
        'Linearize and propagate: compute the motion-model Jacobian F at the current state, then Σ′ = FΣFᵀ + Q.',
      expectedInput: 'state x, covariance Σ, process noise Q',
      expectedOutput: 'propagated covariance Σ′',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'F = jacobian_f(x)', caption: 'Linearize at x' },
        { id: 'b2', code: 'Sigma_p = F @ Sigma @ F.T', caption: 'Sandwich form' },
        { id: 'b3', code: 'return Sigma_p + Q', caption: 'Add process noise' },
        { id: 'b4', code: 'Sigma_p = F * Sigma * F', caption: 'Elementwise multiply', isDistractor: true },
      ],
    },
    {
      id: 'w09-s3',
      order: 3,
      title: 'Read the ellipse',
      instruction:
        'Finish by interpreting uncertainty: eigendecompose Σ′, scale axes by the 95% chi-square factor, render the ellipse around the state.',
      expectedInput: 'Σ′ 2×2 position block',
      expectedOutput: '95% confidence ellipse params',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'vals, vecs = np.linalg.eigh(Sigma_p)', caption: 'Eigendecompose' },
        { id: 'b2', code: 'radii = np.sqrt(vals * 5.991)', caption: '95% chi² scale' },
        { id: 'b3', code: 'return vecs, radii', caption: 'Return axes' },
        { id: 'b4', code: 'radii = vals * 5.991', caption: 'Variance not sqrt', isDistractor: true },
      ],
    },
  ],
};
