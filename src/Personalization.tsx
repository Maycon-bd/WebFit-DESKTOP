import { useState } from "react";
import { applyTheme, saveTheme } from "./theme";
import type { Theme } from "./theme";

export function Personalization() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );
  const [saveFailed, setSaveFailed] = useState(false);
  const [message, setMessage] = useState("");

  function persist(next: Theme) {
    let saved = false;
    try {
      saved = saveTheme(window.localStorage, next);
    } catch {
      // Storage can be unavailable; keep the user's choice in this session.
    }
    setSaveFailed(!saved);
    setMessage(
      saved
        ? `Tema ${next === "dark" ? "escuro" : "claro"} aplicado e salvo neste computador.`
        : "O tema foi aplicado nesta sessão, mas não foi possível salvar a preferência. Ao reabrir, a escolha anterior poderá voltar.",
    );
  }

  function select(next: Theme) {
    applyTheme(next);
    setTheme(next);
    persist(next);
  }

  return (
    <section aria-labelledby="personalization-title">
      <header className="page-heading">
        <div>
          <h1 className="focus-anchor" id="personalization-title" tabIndex={-1}>
            Personalização
          </h1>
          <p>Escolha a aparência mais confortável para trabalhar.</p>
        </div>
      </header>
      <fieldset className="theme-options" aria-describedby="theme-description">
        <legend>Tema do aplicativo</legend>
        <p className="hint" id="theme-description">
          A mudança é imediata e vale para todos os acessos neste computador.
        </p>
        <div className="theme-choices">
          {(["light", "dark"] as const).map((option) => (
            <label className="theme-choice" key={option}>
              <span
                className={`theme-preview theme-preview-${option}`}
                aria-hidden="true"
              >
                <span className="theme-preview-sidebar" />
                <span className="theme-preview-content">
                  <span />
                  <span />
                  <span />
                </span>
              </span>
              <span className="theme-choice-label">
                <input
                  type="radio"
                  name="theme"
                  value={option}
                  aria-labelledby={`theme-${option}-label`}
                  aria-describedby={`theme-${option}-description`}
                  checked={theme === option}
                  onChange={() => select(option)}
                />
                <strong id={`theme-${option}-label`}>
                  {option === "light" ? "Claro" : "Escuro"}
                </strong>
              </span>
              <small id={`theme-${option}-description`}>
                {option === "light"
                  ? "Superfícies claras e verde do WebFit."
                  : "Superfícies escuras e contraste suave."}
              </small>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="theme-feedback" role="status" aria-live="polite">
        {message && <p className={saveFailed ? "error" : "hint"}>{message}</p>}
      </div>
      {saveFailed && (
        <button onClick={() => persist(theme)}>Tentar salvar novamente</button>
      )}
    </section>
  );
}
