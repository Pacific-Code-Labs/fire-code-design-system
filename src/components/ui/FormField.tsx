import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * FormLabel — the uppercase, tracked micro-label used above fields. Uses the
 * `.t-label` typography utility (defined in tokens.css) for brand consistency.
 */
export interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ required, className, children, ...rest }, ref) => (
    <label ref={ref} className={cn("t-label block mb-1.5", className)} {...rest}>
      {children}
      {required && <span className="text-destructive"> *</span>}
    </label>
  )
);
FormLabel.displayName = "FormLabel";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Field label text. Rendered via `FormLabel` and wired to the control. */
  label?: React.ReactNode;
  /** Marks the label with a required asterisk. */
  required?: boolean;
  /** Helper/description text shown under the control. */
  hint?: React.ReactNode;
  /** Error message — when set, replaces the hint and is announced. */
  error?: React.ReactNode;
  /** `id` of the control inside; wires `htmlFor` + `aria-describedby`. */
  htmlFor?: string;
  children: React.ReactNode;
}

/**
 * FormField — label + control + hint/error scaffold.
 *
 * A thin, accessible wrapper that pairs a `FormLabel` with any control and
 * renders a hint or (taking precedence) an error message in `--destructive`.
 * Keep controls (`Input`, `Select`, `OtpInput`, …) as children so the field is
 * control-agnostic.
 */
export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, required, hint, error, htmlFor, className, children, ...rest }, ref) => {
    const describedById = htmlFor
      ? `${htmlFor}-${error ? "error" : "hint"}`
      : undefined;
    return (
      <div ref={ref} className={cn("flex flex-col", className)} {...rest}>
        {label != null && (
          <FormLabel htmlFor={htmlFor} required={required}>
            {label}
          </FormLabel>
        )}
        {children}
        {error ? (
          <p
            id={describedById}
            role="alert"
            className="mt-1.5 text-[12px] text-destructive"
          >
            {error}
          </p>
        ) : (
          hint != null && (
            <p id={describedById} className="mt-1.5 text-[12px] text-muted-foreground">
              {hint}
            </p>
          )
        )}
      </div>
    );
  }
);
FormField.displayName = "FormField";
