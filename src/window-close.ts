// UI preference only: never store session, draft or clinical data here.
export const closePreferenceKey = "webfit:skip-close-confirmation";
export function skipsCloseConfirmation(storage: Pick<Storage, "getItem">) {
  try {
    return storage.getItem(closePreferenceKey) === "true";
  } catch {
    return false;
  }
}

export function createCloseFlow(dependencies: {
  busy: () => boolean;
  skip: () => boolean;
  save: () => Promise<void>;
  remember: () => void;
  destroy: () => Promise<void>;
  prompt: () => void;
  wait: () => void;
  pending: (value: boolean) => void;
  error: (error: unknown) => void;
}) {
  let active = false;
  let showing = false;
  let waiting = false;
  async function confirm(remember: boolean) {
    if (active || dependencies.busy()) return;
    active = true;
    dependencies.pending(true);
    try {
      await dependencies.save();
      if (remember) dependencies.remember();
      await dependencies.destroy();
    } catch (error) {
      showing = true;
      dependencies.prompt();
      dependencies.error(error);
    } finally {
      active = false;
      dependencies.pending(false);
    }
  }
  function request() {
    if (active || showing) return;
    if (dependencies.skip()) {
      if (dependencies.busy()) {
        waiting = true;
        dependencies.wait();
      } else void confirm(false);
    } else {
      showing = true;
      dependencies.prompt();
    }
  }
  return {
    request,
    resume() {
      if (waiting && !dependencies.busy()) {
        waiting = false;
        request();
      }
    },
    confirm,
    cancel() {
      if (active) return false;
      showing = false;
      return true;
    },
  };
}
