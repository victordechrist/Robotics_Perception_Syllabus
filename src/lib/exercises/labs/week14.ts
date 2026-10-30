import type { LabExercise } from '../types';

// Week 14 — learned methods: NeRF render loop order; learned-descriptor
// fallback chain. Decoys sample after rendering / skip normalization.
export const week14Exercise: LabExercise = {
  labSlug: 'week-14-advanced-topics',
  title: 'Guided Exercise: Learned Perception Stack',
  intro:
    'Assemble the advanced pipeline steps in order. One block per step is a decoy — it looks right but is not.',
  steps: [
    {
      id: 'w14-s1',
      order: 1,
      title: 'NeRF render order',
      instruction:
        'Order the volume-render math: sample points along the ray FIRST, query the network for density+color per sample, then composite via alpha blending. The decoy queries after compositing.',
      expectedInput: 'ray (o,d), NeRF field',
      expectedOutput: 'pixel color',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 't = np.linspace(tn, tf, n_samples)\npts = o + t[:, None] * d', caption: 'Sample along ray' },
        { id: 'b2', code: 'sigma, rgb = nerf(pts)', caption: 'Query field' },
        { id: 'b3', code: 'C = alpha_composite(rgb, sigma, t)', caption: 'Composite' },
        { id: 'b4', code: 'sigma, rgb = nerf(alpha_composite(pts))', caption: 'Query post-composite', isDistractor: true },
      ],
    },
    {
      id: 'w14-s2',
      order: 2,
      title: 'Descriptor + normalize',
      instruction:
        'Build the learned-feature stage: run the descriptor net on image crops, L2-normalize the output vectors before cosine matching.',
      expectedInput: 'image patches, descriptor net',
      expectedOutput: 'normalized descriptors',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'desc = net(patches)', caption: 'Forward pass' },
        { id: 'b2', code: 'desc = desc / np.linalg.norm(desc, axis=-1, keepdims=True)', caption: 'L2 normalize' },
        { id: 'b3', code: 'return desc', caption: 'Return' },
        { id: 'b4', code: 'desc = net(patches).argmax(-1)', caption: 'Class index as desc', isDistractor: true },
      ],
    },
    {
      id: 'w14-s3',
      order: 3,
      title: 'Fallback chain',
      instruction:
        'Finish the integration policy: prefer learned descriptors when available, but fall back to ORB+RANSAC when the learned matcher has too few inliers — never trust a matcher blindly.',
      expectedInput: 'learned matches, ORB fallback',
      expectedOutput: 'best transform',
      solution: ['b1', 'b2'],
      blocks: [
        { id: 'b1', code: 'if inliers(learned) > tau: H = learned_H', caption: 'Prefer learned' },
        { id: 'b2', code: 'else: H = ransac_orb(imgA, imgB)', caption: 'ORB fallback' },
        { id: 'b3', code: 'H = learned_H  # always', caption: 'Blind trust', isDistractor: true },
      ],
    },
  ],
};
