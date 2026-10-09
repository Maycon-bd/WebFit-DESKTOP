import { forwardRef, useEffect, useRef, useState } from "react";
import type { InputHTMLAttributes, ChangeEvent, FocusEvent } from "react";

export type ValueFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange"
> & {
  value?: number | null;
  onChange?: (value: number | undefined) => void;
  decimals?: number;
  showCurrencyPrefix?: boolean;
  emptyAsUndefined?: boolean;
  allowNegative?: boolean;
};

export function formatValue(value: number | null | undefined, decimals = 2) {
  if (value === undefined || value === null) return "";
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function parseValue(
  rawValue: string,
  decimals = 2,
  allowNegative = false,
  emptyAsUndefined = false,
) {
  const trimmed = rawValue.trim();
  const negative = allowNegative && trimmed.startsWith("-");
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return emptyAsUndefined ? undefined : 0;
  const value = Number(digits) / 10 ** decimals;
  if (!Number.isFinite(value)) return undefined;
  return negative ? -value : value;
}

function validateRange(
  input: HTMLInputElement,
  value: number | undefined,
  min: string | number | undefined,
  max: string | number | undefined,
  decimals: number,
) {
  const minimum = min === undefined ? undefined : Number(min);
  const maximum = max === undefined ? undefined : Number(max);

  if (value !== undefined && minimum !== undefined && value < minimum) {
    input.setCustomValidity(
      `O valor deve ser no mínimo ${formatValue(minimum, decimals)}.`,
    );
  } else if (value !== undefined && maximum !== undefined && value > maximum) {
    input.setCustomValidity(
      `O valor deve ser no máximo ${formatValue(maximum, decimals)}.`,
    );
  } else {
    input.setCustomValidity("");
  }
}

export const ValueField = forwardRef<HTMLInputElement, ValueFieldProps>(
  function ValueField(
    {
      value,
      onChange,
      decimals = 2,
      showCurrencyPrefix = true,
      emptyAsUndefined = false,
      allowNegative = false,
      onFocus,
      onBlur,
      className,
      ...props
    },
    ref,
  ) {
    const [negativeSign, setNegativeSign] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const input = inputRef.current;
      if (!input) return;
      validateRange(
        input,
        value ?? (emptyAsUndefined ? undefined : 0),
        props.min,
        props.max,
        decimals,
      );
    }, [decimals, emptyAsUndefined, props.max, props.min, value]);

    function setInputRef(input: HTMLInputElement | null) {
      inputRef.current = input;
      if (typeof ref === "function") ref(input);
      else if (ref) ref.current = input;
    }

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
      if (allowNegative && event.currentTarget.value.trim() === "-") {
        setNegativeSign(true);
        onChange?.(0);
        return;
      }

      const nextValue = parseValue(
        event.currentTarget.value,
        decimals,
        allowNegative,
        emptyAsUndefined,
      );
      const numericValue = nextValue ?? (emptyAsUndefined ? undefined : 0);
      const input = event.currentTarget;
      validateRange(input, numericValue, props.min, props.max, decimals);
      setNegativeSign(false);
      onChange?.(nextValue);
    }

    function handleFocus(event: FocusEvent<HTMLInputElement>) {
      event.currentTarget.select();
      onFocus?.(event);
    }

    function handleBlur(event: FocusEvent<HTMLInputElement>) {
      setNegativeSign(false);
      onBlur?.(event);
    }

    return (
      <div
        className={`value-field${showCurrencyPrefix ? " has-currency-prefix" : ""}`}
      >
        {showCurrencyPrefix && (
          <span className="value-field-prefix" aria-hidden="true">
            R$
          </span>
        )}
        <input
          {...props}
          ref={setInputRef}
          className={`formatted-number-field${className ? ` ${className}` : ""}`}
          type="text"
          inputMode="decimal"
          placeholder={props.placeholder ?? "0,00"}
          value={
            negativeSign && value === 0 ? "-" : formatValue(value, decimals)
          }
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    );
  },
);

ValueField.displayName = "ValueField";
