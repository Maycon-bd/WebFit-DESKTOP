import type { InputHTMLAttributes } from "react";

export type DateInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  type?: "date" | "datetime-local";
};

/** Native calendar: preserve civil/local strings; conversion belongs to the caller. */
export function DateInput({ type = "date", ...props }: DateInputProps) {
  return <input {...props} type={type} />;
}
