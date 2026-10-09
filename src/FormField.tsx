import { cloneElement, isValidElement, useId, useState } from "react";
import type { ReactElement, ReactNode } from "react";

type ValidatableControl =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

function errorFor(control: ValidatableControl, label: string) {
  if (control.validity.valueMissing) return `${label} é obrigatório.`;
  if (control.validity.customError) return control.validationMessage;
  return "Verifique o valor informado.";
}

/** Wrap one form control so its visible label is also its accessible name. */
export function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const [error, setError] = useState("");
  const errorId = useId();
  const cleanLabel = label
    .replace(/\s+\((?:opcional|obrigatório)\)$/i, "")
    .replace(/\s+\*$/, "");
  const child = isValidElement(children)
    ? (children as ReactElement<Record<string, unknown>>)
    : null;
  const control =
    child &&
    ((typeof child.type === "string" &&
      ["input", "select", "textarea"].includes(child.type)) ||
      "required" in child.props)
      ? child
      : null;
  const controlProps = control?.props;
  const required = controlProps?.required === true;
  const description = [
    typeof controlProps?.["aria-describedby"] === "string"
      ? controlProps["aria-describedby"]
      : "",
    error ? errorId : "",
  ]
    .filter(Boolean)
    .join(" ");
  const content = control
    ? cloneElement(control, {
        "aria-invalid": error
          ? true
          : (controlProps?.["aria-invalid"] as boolean | undefined),
        "aria-describedby": description || undefined,
      })
    : children;
  return (
    <label
      className={`field${error ? " field-invalid" : ""}`}
      onInvalidCapture={(event) => {
        const input = event.target as ValidatableControl;
        if (!("validity" in input)) return;
        event.preventDefault();
        const message = errorFor(input, cleanLabel);
        queueMicrotask(() => setError(message));
      }}
      onChangeCapture={(event) => {
        const input = event.target as ValidatableControl;
        if (!("validity" in input)) return;
        queueMicrotask(() => {
          if (input.isConnected && input.validity.valid) setError("");
        });
      }}
    >
      <span className="field-label-line">
        <span>
          {cleanLabel}
          {required && <span aria-hidden="true"> *</span>}
        </span>
        {error && (
          <small id={errorId} className="field-validation-error">
            — {error}
          </small>
        )}
      </span>
      {content}
    </label>
  );
}
