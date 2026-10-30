// Versioned localStorage namespace shared by all client-side persistence.
// Bump the version segment when a persisted shape changes incompatibly.
export const RP_STORAGE_PREFIX = "rp:v1" as const;

/** localStorage key for one exercise step's progress record. */
export function exerciseProgressKey(labSlug: string, stepId: string): string {
  return `${RP_STORAGE_PREFIX}:exercise:${labSlug}:${stepId}`;
}

/** localStorage key for a lab's consensus tree. */
export function consensusTreeKey(labSlug: string): string {
  return `${RP_STORAGE_PREFIX}:tree:${labSlug}`;
}

/** localStorage key for the append-only activity log (JSON array). */
export function activityLogKey(): string {
  return `${RP_STORAGE_PREFIX}:activity`;
}
