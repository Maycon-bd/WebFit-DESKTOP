// Reuse a request only for the current authenticated session (including StrictMode remounts).
// A new login must query again. Tokens remain in memory and are never persisted.
export function createLoginUpdateCheck<T>(
  query: (token: string) => Promise<T>,
) {
  let currentToken: string | null = null;
  let request: Promise<T> | null = null;
  return (token: string): Promise<T> => {
    if (!request || currentToken !== token) {
      currentToken = token;
      request = Promise.resolve().then(() => query(token));
    }
    return request;
  };
}
