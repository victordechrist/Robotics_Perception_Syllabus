import type { LabExercise } from '../types';

// Week 15 — capstone benchmarking: metrics order — run pipeline → collect
// error metrics → compare to ground truth → report.
export const week15Exercise: LabExercise = {
  labSlug: 'week-15-capstone-final',
  title: 'Guided Exercise: Benchmark & Report',
  intro:
    'Assemble the capstone evaluation pipeline in order. One block per step is a decoy — it looks right but is not.',
  steps: [
    {
      id: 'w15-s1',
      order: 1,
      title: 'Run then measure',
      instruction:
        'Order the benchmark: replay the dataset through the full pipeline collecting poses, THEN compare against ground truth — never evaluate against the training trajectory.',
      expectedInput: 'dataset + pipeline',
      expectedOutput: 'estimated trajectory',
      solution: ['b1', 'b2'],
      blocks: [
        { id: 'b1', code: 'traj = [pipeline.step(f) for f in dataset]', caption: 'Full run' },
        { id: 'b2', code: 'est = np.array(traj)', caption: 'Collect poses' },
        { id: 'b3', code: 'est = pipeline.cached_trajectory', caption: 'Re-use cached', isDistractor: true },
      ],
    },
    {
      id: 'w15-s2',
      order: 2,
      title: 'ATE/RPE correctly',
      instruction:
        'Compute trajectory metrics properly: align the estimated trajectory to ground truth first (Umeyama/sim3), then absolute trajectory error and relative pose error.',
      expectedInput: 'est, gt trajectories',
      expectedOutput: 'ATE + RPE values',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'est_aligned = umeyama_align(est, gt)', caption: 'Sim3 align' },
        { id: 'b2', code: 'ate = rmse(est_aligned - gt)', caption: 'ATE' },
        { id: 'b3', code: 'rpe = relative_pose_error(est_aligned, gt, delta=1)', caption: 'RPE' },
        { id: 'b4', code: 'ate = rmse(est - gt)', caption: 'Unaligned error', isDistractor: true },
      ],
    },
    {
      id: 'w15-s3',
      order: 3,
      title: 'Latency as a first-class metric',
      instruction:
        'Close the report: measure per-frame latency under the real budget, report p50/p95 — a pipeline accurate but 200ms late does not ship.',
      expectedInput: 'pipeline timings per frame',
      expectedOutput: 'latency percentiles',
      solution: ['b1', 'b2'],
      blocks: [
        { id: 'b1', code: 'p50, p95 = np.percentile(lat, [50, 95])', caption: 'Percentiles' },
        { id: 'b2', code: 'report(f"p50={p50:.1f}ms p95={p95:.1f}ms")', caption: 'Report' },
        { id: 'b3', code: 'report(lat.mean())', caption: 'Mean only', isDistractor: true },
      ],
    },
  ],
};
