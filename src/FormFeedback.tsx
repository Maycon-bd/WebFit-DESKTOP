import { useEffect, useRef } from "react";

export interface FormFeedbackState {
  busy: boolean;
  error: string;
  notice: string;
}

export function FormFeedback({ busy, error, notice }: FormFeedbackState) {
  const failure = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (error) {
      failure.current?.focus();
      failure.current?.scrollIntoView({ block: "nearest" });
    }
  }, [error]);
  return (
    <div className="form-feedback">
      {error && (
        <div ref={failure} tabIndex={-1} role="alert" className="message error">
          {error}
        </div>
      )}
      <div role="status" aria-live="polite" aria-atomic="true">
        {busy ? "Concluindo operação…" : notice}
      </div>
    </div>
  );
}
