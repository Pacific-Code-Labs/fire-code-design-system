import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

/**
 * Input / Select — the text-entry primitives.
 *
 * Token-driven: surface uses `--background`, hairline uses `--input`, focus
 * lifts to a fire-orange `--ring`. Invalid state recolours the border to
 * `--destructive`. Sizes map to the button density scale (sm | md | lg).
 */
const fieldVariants = cva(
  cn(
    "w-full rounded-[calc(var(--radius)-0.15rem)] bg-background text-foreground",
    "border border-input placeholder:text-muted-foreground/70",
    "transition-[border-color,box-shadow] duration-150 outline-none",
    "focus-visible:border-primary/70 focus-visible:ring-2 focus-visible:ring-ring/35",
    "disabled:cursor-not-allowed disabled:opacity-55",
    "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/30"
  ),
  {
    variants: {
      inputSize: {
        sm: "h-8 px-2.5 text-[13px]",
        md: "h-10 px-3 text-sm",
        lg: "h-11 px-3.5 text-[15px]",
      },
    },
    defaultVariants: { inputSize: "md" },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof fieldVariants> {
  /** Mark the field invalid (recolours border + ring). */
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ inputSize, invalid, className, "aria-invalid": ariaInvalid, ...rest }, ref) => (
    <input
      ref={ref}
      aria-invalid={invalid ?? ariaInvalid}
      className={cn(fieldVariants({ inputSize }), className)}
      {...rest}
    />
  )
);
Input.displayName = "Input";

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof fieldVariants> {
  invalid?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ inputSize, invalid, className, children, "aria-invalid": ariaInvalid, ...rest }, ref) => (
    <select
      ref={ref}
      aria-invalid={invalid ?? ariaInvalid}
      className={cn(fieldVariants({ inputSize }), "cursor-pointer pr-8", className)}
      {...rest}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

export { fieldVariants };
