import { forwardRef } from "react";
import type { InputHTMLAttributes, ChangeEvent, FocusEvent } from "react";

export type PercentFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange"
> & {
  value?: number | null;
  onChange?: (value: number | undefined) => void;
  decimals?: number;
};

export function formatPercentValue(
  value: number | null | undefined,
  decimals = 2,
) {
  if (value === undefined || value === null) return "";
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function parsePercentValue(rawValue: string, decimals = 2) {
  const digits = rawValue.replace(/\D/g, "");
  if (!digits) return undefined;
  const value = Number(digits) / 10 ** decimals;
  return Number.isFinite(value) ? value : undefined;
}

export const PercentField = forwardRef<HTMLInputElement, PercentFieldProps>(
  function PercentField(
    { value, onChange, decimals = 2, onFocus, className, ...props },
    ref,
  ) {
    function handleChange(event: ChangeEvent<HTMLInputElement>) {
      onChange?.(parsePercentValue(event.currentTarget.value, decimals));
    }

    function handleFocus(event: FocusEvent<HTMLInputElement>) {
      event.currentTarget.select();
      onFocus?.(event);
    }

    return (
      <input
        {...props}
        ref={ref}
        className={`formatted-number-field${className ? ` ${className}` : ""}`}
        type="text"
        inputMode="decimal"
        value={formatPercentValue(value, decimals)}
        onChange={handleChange}
        onFocus={handleFocus}
      />
    );
  },
);

PercentField.displayName = "PercentField";
