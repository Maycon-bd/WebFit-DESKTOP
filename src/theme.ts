export type Theme = "light" | "dark";
export const themeStorageKey = "webfit:appearance:v1";

// Only presentation belongs here. Domain data stays behind the Tauri backend.
export function readTheme(storage: Pick<Storage, "getItem">): Theme {
  try {
    return storage.getItem(themeStorageKey) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function saveTheme(
  storage: Pick<Storage, "setItem">,
  theme: Theme,
): boolean {
  try {
    storage.setItem(themeStorageKey, theme);
    return true;
  } catch {
    return false;
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}

export function initializeTheme(): void {
  // Accessing localStorage itself can throw when browser storage is disabled.
  try {
    applyTheme(readTheme(window.localStorage));
  } catch {
    applyTheme("light");
  }
}
