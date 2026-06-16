import * as React from "react";
import { cn } from "../../lib/cn";

export interface OtpInputProps {
  /** Controlled value (the digits entered so far). */
  value: string;
  /** Called with the sanitized digit string (capped at `length`). */
  onChange: (value: string) => void;
  /** Fired once the code reaches full `length`. */
  onComplete?: (value: string) => void;
  /** Number of digit cells. Defaults to 6. */
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  invalid?: boolean;
  className?: string;
  "aria-label"?: string;
}

/**
 * OtpInput — segmented numeric one-time-code field (6 digits by default).
 *
 * Renders one cell per digit, each a token-driven box (`--input` border lifting
 * to the fire-orange `--ring`/`--primary` on focus). Handles type-to-advance,
 * Backspace-to-retreat, arrow nav, and full-code paste. Strips non-digits and
 * caps at `length`. Controlled: parent owns `value`. No app CSS, no contexts.
 */
export const OtpInput = React.forwardRef<HTMLInputElement, OtpInputProps>(
  (
    {
      value,
      onChange,
      onComplete,
      length = 6,
      disabled,
      autoFocus,
      invalid,
      className,
      "aria-label": ariaLabel = "One-time code",
    },
    forwardedRef
  ) => {
    const refs = React.useRef<Array<HTMLInputElement | null>>([]);
    const digits = React.useMemo(() => {
      const arr = value.replace(/\D/g, "").slice(0, length).split("");
      return Array.from({ length }, (_, i) => arr[i] ?? "");
    }, [value, length]);

    const commit = (next: string) => {
      const clean = next.replace(/\D/g, "").slice(0, length);
      onChange(clean);
      if (clean.length === length) onComplete?.(clean);
    };

    const focusCell = (i: number) => {
      const clamped = Math.max(0, Math.min(length - 1, i));
      refs.current[clamped]?.focus();
      refs.current[clamped]?.select();
    };

    const handleChange = (i: number, raw: string) => {
      const typed = raw.replace(/\D/g, "");
      if (!typed) return;
      const arr = digits.slice();
      // Support fast typing / multi-char (paste into one cell): spill forward.
      let cursor = i;
      for (const ch of typed) {
        if (cursor >= length) break;
        arr[cursor] = ch;
        cursor += 1;
      }
      commit(arr.join(""));
      focusCell(cursor);
    };

    const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const arr = digits.slice();
        if (arr[i]) {
          arr[i] = "";
          commit(arr.join(""));
        } else if (i > 0) {
          arr[i - 1] = "";
          commit(arr.join(""));
          focusCell(i - 1);
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        focusCell(i - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        focusCell(i + 1);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
      if (!text) return;
      commit(text);
      focusCell(text.length);
    };

    return (
      <div
        className={cn("flex items-center gap-2", className)}
        role="group"
        aria-label={ariaLabel}
      >
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
              if (i !== 0) return;
              if (typeof forwardedRef === "function") forwardedRef(el);
              else if (forwardedRef) forwardedRef.current = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            pattern="[0-9]*"
            maxLength={1}
            value={d}
            disabled={disabled}
            autoFocus={autoFocus && i === 0}
            aria-invalid={invalid}
            aria-label={`${ariaLabel} digit ${i + 1}`}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={cn(
              "h-12 w-11 rounded-[calc(var(--radius)-0.15rem)] bg-background text-foreground",
              "border border-input text-center text-lg font-semibold tabular-nums",
              "transition-[border-color,box-shadow] duration-150 outline-none",
              "focus:border-primary focus:ring-2 focus:ring-ring/35",
              "disabled:cursor-not-allowed disabled:opacity-55",
              invalid && "border-destructive focus:ring-destructive/30"
            )}
          />
        ))}
      </div>
    );
  }
);
OtpInput.displayName = "OtpInput";
