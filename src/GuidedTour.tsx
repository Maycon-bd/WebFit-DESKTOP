import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { api } from "./api";
import { positionTour, shouldShowTour, tours } from "./onboarding";
import type { TourId } from "./onboarding";

export function GuidedTour({
  token,
  screen,
}: {
  token: string;
  screen: TourId;
}) {
  const [seen, setSeen] = useState<string[] | null>(null);
  const [failure, setFailure] = useState("");
  useEffect(() => {
    let current = true;
    setSeen(null);
    setFailure("");
    api<string[]>(token, { op: "tour_state" }).then(
      (value) => {
        if (current) setSeen(value);
      },
      () => {
        if (current) {
          setSeen([]);
          setFailure(
            "Não foi possível consultar seus tutoriais anteriores. Você pode pular e continuar trabalhando.",
          );
        }
      },
    );
    return () => {
      current = false;
    };
  }, [token]);
  if (seen === null) return null;
  return (
    <Tour
      key={screen}
      screen={screen}
      automatic={shouldShowTour(screen, seen)}
      initialFailure={failure}
      finish={async () => {
        await api(token, { op: "complete_tour", id: screen });
        setSeen((previous) => [
          ...(previous ?? []).filter((id) => id !== screen),
          screen,
        ]);
      }}
    />
  );
}

function Tour({
  screen,
  automatic,
  initialFailure,
  finish,
}: {
  screen: TourId;
  automatic: boolean;
  initialFailure: string;
  finish: () => Promise<void>;
}) {
  const [active, setActive] = useState(automatic);
  const [step, setStep] = useState(0);
  const [failure, setFailure] = useState(initialFailure);
  const [saving, setSaving] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [position, setPosition] = useState({ left: 16, top: 16 });
  const card = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const steps = tours[screen];
  const current = steps[step];
  useLayoutEffect(() => {
    if (!active) return;
    previousFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    return () => {
      if (previousFocus.current?.isConnected)
        previousFocus.current.focus({ preventScroll: true });
    };
  }, [active]);
  useLayoutEffect(() => {
    if (!active) return;
    const candidates = [
      document.querySelector<HTMLElement>(current.target),
      current.fallbackTarget
        ? document.querySelector<HTMLElement>(current.fallbackTarget)
        : null,
    ];
    const visibleTarget = () =>
      candidates.find(
        (element) => element && element.getClientRects().length > 0,
      );
    const target = visibleTarget();
    target?.scrollIntoView({
      block: "center",
      inline: "nearest",
      behavior: "instant",
    });
    const update = () => {
      const bounds = visibleTarget()?.getBoundingClientRect() ?? null;
      setRect(bounds);
      setPosition(
        positionTour(
          bounds,
          { width: window.innerWidth, height: window.innerHeight },
          {
            width: card.current?.offsetWidth ?? 360,
            height: card.current?.offsetHeight ?? 260,
          },
        ),
      );
    };
    update();
    heading.current?.focus({ preventScroll: true });
    const observer = new ResizeObserver(update);
    for (const candidate of candidates) {
      if (candidate) observer.observe(candidate);
    }
    if (card.current) observer.observe(card.current);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [active, current]);
  async function dismiss() {
    if (saving) return;
    setActive(false);
    setSaving(true);
    try {
      await finish();
      setFailure("");
    } catch {
      setFailure(
        "O tutorial foi fechado, mas não foi possível lembrar isso. Você pode continuar trabalhando; ele poderá aparecer novamente ao entrar nesta tela.",
      );
    } finally {
      setSaving(false);
    }
  }
  useEffect(() => {
    if (!active) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        void dismiss();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  });
  return (
    <>
      {failure && !active && <p role="status">{failure}</p>}
      {active && (
        <>
          <div className="tour-shade" aria-hidden="true" />
          {rect && (
            <div
              className="tour-spotlight"
              aria-hidden="true"
              style={{
                left: rect.left - 4,
                top: rect.top - 4,
                width: rect.width + 8,
                height: rect.height + 8,
              }}
            />
          )}
          <section
            ref={card}
            className="tour-card"
            role="dialog"
            aria-modal="false"
            aria-labelledby="tour-title"
            aria-describedby="tour-text"
            style={position}
          >
            <div className="tour-progress">
              <span aria-live="polite">
                Passo {step + 1} de {steps.length}
              </span>
              <button type="button" onClick={() => void dismiss()}>
                Pular
              </button>
            </div>
            <h2
              className="focus-anchor"
              ref={heading}
              tabIndex={-1}
              id="tour-title"
            >
              {current.title}
            </h2>
            <p id="tour-text">{current.text}</p>
            {failure && (
              <p role="status" className="tour-warning">
                {failure}
              </p>
            )}
            <div className="tour-actions">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => setStep(step - 1)}
              >
                Voltar
              </button>
              <button
                type="button"
                className="primary"
                onClick={() =>
                  step + 1 === steps.length ? void dismiss() : setStep(step + 1)
                }
              >
                {step + 1 === steps.length ? "Concluir" : "Próximo"}
              </button>
            </div>
          </section>
        </>
      )}
    </>
  );
}
