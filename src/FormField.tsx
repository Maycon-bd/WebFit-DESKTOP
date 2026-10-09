import type { ReactNode } from "react";

/** Wrap one form control so its visible label is also its accessible name. */
export function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
