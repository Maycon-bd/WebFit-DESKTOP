import { useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent, InputHTMLAttributes, KeyboardEvent } from "react";

export type DateFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange" | "min" | "max"
> & {
  /** Date civil ISO ou string local yyyy-MM-ddThh:mm para datetime-local. */
  value?: string | null;
  /** Recebe ISO válido; datas incompletas/inválidas emitem vazio. */
  onValueChange?: (value: string) => void;
  type?: "date" | "datetime-local";
  min?: string;
  max?: string;
};

export function dateIsoToDigits(value: string | null | undefined): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  const [year, month, day] = value.split("-").map(Number);
  return isValidDateParts(day, month, year)
    ? `${pad(day)}${pad(month)}${year}`
    : "";
}

export function dateDigitsToIso(digits: string): string | undefined {
  if (!/^\d{8}$/.test(digits)) return undefined;
  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  if (!isValidDateParts(day, month, year)) return undefined;
  return `${digits.slice(4, 8)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`;
}

export function formatDateDigits(digits: string): string {
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  if (digits.length <= 2) return day;
  if (digits.length <= 4) return `${day}/${month}`;
  return `${day}/${month}/${year}`;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function isValidDateParts(day: number, month: number, year: number) {
  if (year < 1000 || year > 9999 || month < 1 || month > 12) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    day >= 1 &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function isoToLocalDate(value: string | undefined) {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function localDateToIso(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function isoDateLabel(value: string) {
  const date = isoToLocalDate(value);
  return date?.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function dateWithinRange(value: string, min?: string, max?: string) {
  return (!min || value >= min) && (!max || value <= max);
}

function cursorAfterDigits(value: string, digitCount: number) {
  let count = 0;
  let position = 0;
  while (position < value.length && count < digitCount) {
    if (/\d/.test(value[position])) count += 1;
    position += 1;
  }
  if (digitCount >= 2 && position === 2 && value.length > position)
    position += 1;
  if (digitCount >= 4 && position === 5 && value.length > position)
    position += 1;
  return position;
}

export function DateField({
  type = "date",
  value,
  onValueChange,
  min,
  max,
  disabled,
  readOnly,
  onFocus,
  onBlur,
  onKeyDown,
  onInvalid,
  ...inputProps
}: DateFieldProps) {
  const [digits, setDigits] = useState(() => dateIsoToDigits(value));
  const [focused, setFocused] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const selected = isoToLocalDate(value ?? undefined);
    const base = selected ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const calendarId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedIso = dateDigitsToIso(digits);

  useEffect(() => {
    if (type !== "date") return;
    const nextDigits = dateIsoToDigits(value);
    const currentIso = dateDigitsToIso(digits) ?? "";
    if (currentIso !== (value ?? "")) setDigits(nextDigits);
  }, [type, value, digits]);

  useEffect(() => {
    if (!calendarOpen) return;
    const closeOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOutside);
    return () => document.removeEventListener("mousedown", closeOutside);
  }, [calendarOpen]);

  function updateDigits(nextDigits: string) {
    const limitedDigits = nextDigits.replace(/\D/g, "").slice(0, 8);
    const iso = dateDigitsToIso(limitedDigits);
    const inRange = iso ? dateWithinRange(iso, min, max) : false;
    const valid = !!iso && inRange;
    setDigits(limitedDigits);
    if (inputRef.current) {
      inputRef.current.setCustomValidity(
        limitedDigits.length === 0 || valid
          ? ""
          : iso
            ? "A data está fora do período permitido."
            : "Informe uma data válida no formato DD/MM/AAAA.",
      );
    }
    onValueChange?.(valid ? iso : "");
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const digitsBeforeCursor = input.value
      .slice(0, input.selectionStart ?? input.value.length)
      .replace(/\D/g, "").length;
    const nextDigits = input.value.replace(/\D/g, "").slice(0, 8);
    updateDigits(nextDigits);
    requestAnimationFrame(() => {
      if (inputRef.current) {
        const position = cursorAfterDigits(
          formatDateDigits(nextDigits),
          Math.min(digitsBeforeCursor, nextDigits.length),
        );
        inputRef.current.setSelectionRange(position, position);
      }
    });
  }

  function deleteDigit(event: KeyboardEvent<HTMLInputElement>) {
    if (disabled || readOnly || !["Backspace", "Delete"].includes(event.key)) {
      onKeyDown?.(event);
      return;
    }
    const input = event.currentTarget;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? start;
    const valueBeforeStart = input.value.slice(0, start);
    const valueBeforeEnd = input.value.slice(0, end);
    const startDigit = valueBeforeStart.replace(/\D/g, "").length;
    const endDigit = valueBeforeEnd.replace(/\D/g, "").length;
    let from = startDigit;
    let to = endDigit;
    if (start === end) {
      if (event.key === "Backspace") from = Math.max(0, startDigit - 1);
      else to = Math.min(digits.length, startDigit + 1);
      if (
        (event.key === "Backspace" && startDigit === 0) ||
        (event.key === "Delete" && startDigit >= digits.length)
      ) {
        onKeyDown?.(event);
        return;
      }
    }
    event.preventDefault();
    const nextDigits = digits.slice(0, from) + digits.slice(to);
    updateDigits(nextDigits);
    requestAnimationFrame(() => {
      if (inputRef.current) {
        const position = cursorAfterDigits(formatDateDigits(nextDigits), from);
        inputRef.current.setSelectionRange(position, position);
      }
    });
    onKeyDown?.(event);
  }

  function selectDate(date: Date) {
    const iso = localDateToIso(date);
    const nextDigits = dateIsoToDigits(iso);
    updateDigits(nextDigits);
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setCalendarOpen(false);
    inputRef.current?.focus();
  }

  function toggleCalendar() {
    if (disabled || readOnly) return;
    if (!calendarOpen) {
      const selected = isoToLocalDate(selectedIso);
      const base = selected ?? new Date();
      setVisibleMonth(new Date(base.getFullYear(), base.getMonth(), 1));
    }
    setCalendarOpen((open) => !open);
  }

  function renderCalendar() {
    if (!calendarOpen) return null;
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekday = new Date(year, month, 1).getDay();
    const monthLabel = visibleMonth.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
    const headers = [
      ["D", "domingo"],
      ["S", "segunda-feira"],
      ["T", "terça-feira"],
      ["Q", "quarta-feira"],
      ["Q", "quinta-feira"],
      ["S", "sexta-feira"],
      ["S", "sábado"],
    ];
    const weekCount = Math.ceil((firstWeekday + daysInMonth) / 7);
    const weeks = Array.from({ length: weekCount }, (_, week) =>
      Array.from({ length: 7 }, (_, weekday) => {
        const day = week * 7 + weekday - firstWeekday + 1;
        return day >= 1 && day <= daysInMonth ? day : undefined;
      }),
    );
    return (
      <div
        className="date-field-calendar"
        id={calendarId}
        role="dialog"
        aria-label="Calendário"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setCalendarOpen(false);
            triggerRef.current?.focus();
          }
        }}
      >
        <div className="date-field-calendar-heading">
          <button
            type="button"
            aria-label="Mês anterior"
            onClick={() => setVisibleMonth(new Date(year, month - 1, 1))}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="m12 4-6 6 6 6" />
            </svg>
          </button>
          <strong aria-live="polite">{monthLabel}</strong>
          <button
            type="button"
            aria-label="Próximo mês"
            onClick={() => setVisibleMonth(new Date(year, month + 1, 1))}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="m8 4 6 6-6 6" />
            </svg>
          </button>
        </div>
        <table className="date-field-calendar-grid">
          <caption className="visually-hidden">Dias de {monthLabel}</caption>
          <thead>
            <tr>
              {headers.map(([short, full]) => (
                <th key={full} scope="col" aria-label={full}>
                  {short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, index) => (
              <tr key={index}>
                {week.map((day, weekday) => {
                  if (day === undefined) return <td key={weekday} />;
                  const date = new Date(year, month, day);
                  const iso = localDateToIso(date);
                  return (
                    <td key={weekday}>
                      <button
                        type="button"
                        className="date-field-day"
                        data-date={iso}
                        aria-label={isoDateLabel(iso)}
                        aria-pressed={iso === selectedIso}
                        disabled={!dateWithinRange(iso, min, max)}
                        onClick={() => selectDate(date)}
                        onKeyDown={(event) => {
                          const movement: Record<string, number> = {
                            ArrowLeft: -1,
                            ArrowRight: 1,
                            ArrowUp: -7,
                            ArrowDown: 7,
                          };
                          const delta = movement[event.key];
                          if (!delta) return;
                          event.preventDefault();
                          const nextDate = new Date(date);
                          nextDate.setDate(nextDate.getDate() + delta);
                          const nextIso = localDateToIso(nextDate);
                          if (!dateWithinRange(nextIso, min, max)) return;
                          setVisibleMonth(
                            new Date(
                              nextDate.getFullYear(),
                              nextDate.getMonth(),
                              1,
                            ),
                          );
                          requestAnimationFrame(() => {
                            containerRef.current
                              ?.querySelector<HTMLButtonElement>(
                                `[data-date="${nextIso}"]`,
                              )
                              ?.focus();
                          });
                        }}
                      >
                        {day}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (type === "datetime-local") {
    return (
      <input
        {...inputProps}
        ref={inputRef}
        type="datetime-local"
        value={value ?? ""}
        min={min}
        max={max}
        disabled={disabled}
        readOnly={readOnly}
        onChange={(event) => onValueChange?.(event.currentTarget.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onInvalid={onInvalid}
      />
    );
  }

  const inputValue = formatDateDigits(digits);
  return (
    <div className="date-field" ref={containerRef}>
      <input
        {...inputProps}
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder={focused ? "DD/MM/AAAA" : undefined}
        value={inputValue}
        aria-haspopup="dialog"
        aria-controls={calendarOpen ? calendarId : undefined}
        onChange={handleChange}
        onKeyDown={deleteDigit}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        onInvalid={(event) => onInvalid?.(event)}
        aria-invalid={
          inputRef.current?.validity.valid === false
            ? true
            : inputProps["aria-invalid"]
        }
      />
      <button
        ref={triggerRef}
        className="date-field-trigger"
        type="button"
        aria-label="Abrir calendário"
        aria-expanded={calendarOpen}
        aria-controls={calendarOpen ? calendarId : undefined}
        disabled={disabled || readOnly}
        onClick={toggleCalendar}
        onKeyDown={(event) => {
          if (event.key === "Escape" && calendarOpen) {
            setCalendarOpen(false);
            triggerRef.current?.focus();
          }
        }}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <rect x="3" y="5" width="14" height="12" rx="2" />
          <path d="M6 3v4M14 3v4M3 9h14M6.5 12h2M11.5 12h2M6.5 15h2" />
        </svg>
      </button>
      {renderCalendar()}
    </div>
  );
}
