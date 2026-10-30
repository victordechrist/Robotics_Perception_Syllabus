import type { LabExercise } from '../types';

// Week 11 — particle filter: propagate particles, weight by likelihood,
// resample. Decoy skips resampling (degeneracy).
export const week11Exercise: LabExercise = {
  labSlug: 'week-11-particle-filter',
  title: 'Guided Exercise: Monte Carlo Localization',
  intro:
    'Assemble the particle-filter step in order. One block per step is a decoy — it looks right but is not.',
  steps: [
    {
      id: 'w11-s1',
      order: 1,
      title: 'Propagate the swarm',
      instruction:
        'Build the prediction: push every particle through the motion model and add per-particle process noise — each particle is its own hypothesis.',
      expectedInput: 'N particles, control u, process noise',
      expectedOutput: 'propagated particles',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'for i in range(N):\n    X[i] = motion_model(X[i], u)', caption: 'Per-particle model' },
        { id: 'b2', code: 'X += np.random.normal(0, sigma_proc, X.shape)', caption: 'Process noise' },
        { id: 'b3', code: 'return X', caption: 'Return swarm' },
        { id: 'b4', code: 'X = motion_model(X, u)', caption: 'Single mean push', isDistractor: true },
      ],
    },
    {
      id: 'w11-s2',
      order: 2,
      title: 'Weight by likelihood',
      instruction:
        'Score each particle: measurement likelihood p(z|x_i) per particle, then NORMALIZE so weights sum to 1.',
      expectedInput: 'particles, measurement z, sensor model',
      expectedOutput: 'normalized weights w',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'w = np.array([likelihood(z, x) for x in X])', caption: 'Score each' },
        { id: 'b2', code: 'w = w / w.sum()', caption: 'Normalize' },
        { id: 'b3', code: 'return w', caption: 'Return' },
        { id: 'b4', code: 'w = likelihood(z, X).argmax()', caption: 'Winner-take-all', isDistractor: true },
      ],
    },
    {
      id: 'w11-s3',
      order: 3,
      title: 'Resample the survivors',
      instruction:
        'Close the loop: weight-proportional resampling duplicates high-weight particles and kills low-weight ones — then keep weights uniform again. The decoy skips resampling (degeneracy).',
      expectedInput: 'particles, weights',
      expectedOutput: 'resampled particle set',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'idx = np.random.choice(N, N, p=w)', caption: 'Resample by weight' },
        { id: 'b2', code: 'X = X[idx]', caption: 'Survivors' },
        { id: 'b3', code: 'w = np.full(N, 1.0 / N)', caption: 'Reset uniform' },
        { id: 'b4', code: 'w = w * w', caption: 'Squash weights', isDistractor: true },
      ],
    },
  ],
};
