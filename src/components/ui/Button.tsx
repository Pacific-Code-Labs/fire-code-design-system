import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";
import { Icon } from "./Icon";

/**
 * Button — the primary action primitive.
 *
 * Token-driven (no app CSS): every colour is `hsl(var(--token))` via Tailwind's
 * semantic mapping, so it re-themes at runtime. The aesthetic is instrument-
 * grade: tight, confident weight, a precise fire-orange focus ring (`--ring`),
 * and a restrained primary glow on hover — never a generic SaaS gradient.
 *
 * Variants: primary | secondary | outline | ghost | destructive | success |
 * link. Sizes: xs | sm | md | lg | xl, plus icon-only sizing when there's an
 * `icon`/`iconRight` and no children.
 */
const buttonVariants = cva(
  // Base: layout, motion, focus, disabled — shared by every variant.
  cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none",
    "rounded-[calc(var(--radius)-0.15rem)] font-semibold tracking-[-0.01em]",
    "transition-[background-color,border-color,color,box-shadow,transform] duration-150",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "focus-visible:ring-offset-background active:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-50"
  ),
  {
    variants: {
      variant: {
        primary: cn(
          "bg-primary text-primary-foreground border border-primary",
          "shadow-[0_1px_0_0_hsl(var(--primary-glow)/0.4)_inset]",
          "hover:bg-primary/90 hover:shadow-[var(--shadow-glow)]"
        ),
        secondary: cn(
          "bg-secondary text-secondary-foreground border border-transparent",
          "hover:bg-secondary/70"
        ),
        outline: cn(
          "bg-transparent text-foreground border border-border",
          "hover:border-primary/60 hover:bg-primary/[0.06] hover:text-foreground"
        ),
        ghost: cn(
          "bg-transparent text-foreground border border-transparent",
          "hover:bg-muted"
        ),
        destructive: cn(
          "bg-destructive text-destructive-foreground border border-destructive",
          "hover:bg-destructive/90"
        ),
        success: cn(
          // Success has no dedicated token; map to the actuation/green domain hue.
          "border border-transparent text-[hsl(var(--primary-foreground))]",
          "bg-[hsl(var(--cat-actuation))] hover:bg-[hsl(var(--cat-actuation)/0.9)]"
        ),
        link: cn(
          "bg-transparent border-0 text-primary underline-offset-4",
          "hover:underline focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto"
        ),
      },
      size: {
        xs: "h-7 px-2.5 text-xs",
        sm: "h-8 px-3 text-[13px]",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-[15px]",
        xl: "h-12 px-6 text-base",
      },
      iconOnly: {
        true: "p-0 aspect-square",
        false: "",
      },
    },
    compoundVariants: [
      { iconOnly: true, size: "xs", className: "w-7" },
      { iconOnly: true, size: "sm", className: "w-8" },
      { iconOnly: true, size: "md", className: "w-10" },
      { iconOnly: true, size: "lg", className: "w-11" },
      { iconOnly: true, size: "xl", className: "w-12" },
    ],
    defaultVariants: { variant: "primary", size: "md", iconOnly: false },
  }
);

const ICON_PX: Record<NonNullable<ButtonProps["size"]>, number> = {
  xs: 14,
  sm: 15,
  md: 16,
  lg: 18,
  xl: 18,
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof buttonVariants>, "iconOnly"> {
  /** Leading icon (registry name; see `Icon`). */
  icon?: string;
  /** Trailing icon (registry name). */
  iconRight?: string;
  /** Show a spinner and disable interaction. */
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon,
      iconRight,
      loading = false,
      disabled,
      className,
      children,
      type = "button",
      ...rest
    },
    ref
  ) => {
    const safeSize = size ?? "md";
    const iconOnly = Boolean(icon) && !children && !iconRight;
    const iSize = ICON_PX[safeSize];

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, iconOnly }), className)}
        {...rest}
      >
        {loading ? (
          <Loader2 size={iSize} className="animate-spin" aria-hidden="true" />
        ) : (
          icon && <Icon name={icon} size={iSize} />
        )}
        {children}
        {iconRight && !loading && <Icon name={iconRight} size={iSize} />}
      </button>
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
