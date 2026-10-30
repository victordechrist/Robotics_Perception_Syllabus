import type { LabExercise } from '../types';

// Week 10 — EKF: predict (nonlinear f, linearized F) then update with
// linearized H; decoys swap predict/update or drop the Jacobian.
export const week10Exercise: LabExercise = {
  labSlug: 'week-10-kalman-filter',
  title: 'Guided Exercise: EKF Predict–Update',
  intro:
    'Assemble the extended Kalman filter step in order. One block per step is a decoy — it looks right but is not.',
  steps: [
    {
      id: 'w10-s1',
      order: 1,
      title: 'Predict through the model',
      instruction:
        'Build the predict half: propagate the state through the NONLINEAR motion model, but propagate covariance through the LINEARIZED Jacobian.',
      expectedInput: 'x, Σ, control u, motion model f, Jacobian F',
      expectedOutput: 'x̂⁻, Σ⁻',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'x_pred = f(x, u)', caption: 'Nonlinear predict' },
        { id: 'b2', code: 'F = jacobian_f(x, u)', caption: 'Linearize' },
        { id: 'b3', code: 'Sigma_pred = F @ Sigma @ F.T + Q', caption: 'Covariance' },
        { id: 'b4', code: 'x_pred = F @ x', caption: 'Linear state predict', isDistractor: true },
      ],
    },
    {
      id: 'w10-s2',
      order: 2,
      title: 'Kalman gain via H',
      instruction:
        'Build the update half: linearize the measurement model H, form innovation covariance S = HΣ⁻Hᵀ + R, then the gain K = Σ⁻HᵀS⁻¹.',
      expectedInput: 'x̂⁻, Σ⁻, measurement model h, Jacobian H, noise R',
      expectedOutput: 'K gain matrix',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'H = jacobian_h(x_pred)', caption: 'Linearize h' },
        { id: 'b2', code: 'S = H @ Sigma_pred @ H.T + R', caption: 'Innovation cov' },
        { id: 'b3', code: 'K = Sigma_pred @ H.T @ np.linalg.inv(S)', caption: 'Kalman gain' },
        { id: 'b4', code: 'K = np.linalg.inv(S) @ H @ Sigma_pred', caption: 'Misordered gain', isDistractor: true },
      ],
    },
    {
      id: 'w10-s3',
      order: 3,
      title: 'Correct and re-covariance',
      instruction:
        'Close the loop: innovation z − h(x̂⁻) drives the state correction; covariance collapses as (I − KH)Σ⁻.',
      expectedInput: 'measurement z, K, H',
      expectedOutput: 'x⁺, Σ⁺',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'y = z - h(x_pred)', caption: 'Innovation' },
        { id: 'b2', code: 'x_new = x_pred + K @ y', caption: 'Correct state' },
        { id: 'b3', code: 'Sigma_new = (np.eye(n) - K @ H) @ Sigma_pred', caption: 'Covariance collapse' },
        { id: 'b4', code: 'Sigma_new = Sigma_pred - K @ S', caption: 'Naive subtract', isDistractor: true },
      ],
    },
  ],
};
