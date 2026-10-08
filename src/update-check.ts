export const UPDATE_INTERVAL_MS = 30 * 60 * 1000;
export const UPDATE_RESUME_COOLDOWN_MS = 60 * 1000;
type Reason = "scheduled" | "interval" | "resume";

// Share pending/recent attempts across StrictMode remounts, but never cache a
// session forever. Tokens and results remain in memory only.
export function createSessionUpdateCheck<T>(
  query: (token: string) => Promise<T>,
  now: () => number = Date.now,
) {
  let current: {
    token: string;
    started: number;
    pending: boolean;
    request: Promise<T>;
  } | null = null;
  return (token: string, reason: Reason = "scheduled"): Promise<T> => {
    const interval =
      reason === "scheduled" ? UPDATE_INTERVAL_MS : UPDATE_RESUME_COOLDOWN_MS;
    if (
      current?.token === token &&
      (current.pending || now() - current.started < interval)
    ) {
      return current.request;
    }
    const attempt = {
      token,
      started: now(),
      pending: true,
      request: Promise.resolve().then(() => query(token)),
    };
    attempt.request = attempt.request.finally(() => {
      attempt.pending = false;
    });
    current = attempt;
    return attempt.request;
  };
}

export function startSessionUpdateChecks<T>({
  token,
  check,
  onResult,
  isPaused,
  environment,
}: {
  token: string;
  check: (token: string, reason: Reason) => Promise<T>;
  onResult: (result: T) => void;
  isPaused: () => boolean;
  environment: {
    every: (callback: () => void, interval: number) => () => void;
    onResume: (callback: () => void) => () => void;
  };
}) {
  let active = true;
  const query = (reason: Reason) => {
    if (!active || isPaused()) return;
    void check(token, reason)
      .then((result) => {
        if (active && !isPaused()) onResult(result);
      })
      .catch(() => {
        /* Offline checks must never interrupt work. */
      });
  };
  query("scheduled");
  const clearTimer = environment.every(
    () => query("interval"),
    UPDATE_INTERVAL_MS,
  );
  const removeResume = environment.onResume(() => query("resume"));
  return () => {
    active = false;
    clearTimer();
    removeResume();
  };
}
