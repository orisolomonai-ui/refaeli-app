export const LOW_SESSIONS_THRESHOLD = 2;

export function isLowSessions(trainee) {
  return trainee.sessionsRemaining < LOW_SESSIONS_THRESHOLD;
}

export function daysSince(dateStr) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}
