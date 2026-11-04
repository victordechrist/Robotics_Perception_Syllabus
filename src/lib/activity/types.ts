export type ActivityType =
  | 'lab.view'
  | 'lab.locked.blocked'
  | 'exercise.step.view'
  | 'exercise.block.place'
  | 'exercise.block.remove'
  | 'exercise.check.attempt'
  | 'exercise.check.result'
  | 'exercise.step.complete'
  | 'exercise.lab.complete'
  | 'exercise.reset'
  | 'tree.thought.commit'
  | 'tree.thought.error'
  | 'tree.thought.repair'
  | 'tree.reset'
  | 'tree.gold.unlock'
  | 'activity.export'
  | 'page.view'
  | 'page.dwell'
  | 'dom.click'
  | 'dom.throttle'
  | 'tab.switch'
  | 'scroll.depth'
  | 'window.focus'
  | 'window.blur'
  | 'modal.open'
  | 'modal.close'
  | 'raw.mouse'
  | 'raw.key'
  | 'raw.field'
  | 'raw.scroll'
  | 'raw.focus';

export interface ActivityEvent {
  id: string;
  /** ISO 8601 timestamp. */
  ts: string;
  type: ActivityType;
  labSlug?: string;
  /** Identifiers and counts only — never solution/answer content. */
  data?: Record<string, unknown>;
}
