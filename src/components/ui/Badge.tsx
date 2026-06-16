import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

/**
 * Badge — compact status/category pill.
 *
 * Beyond the generic variants, FireCode ships brand-specific **domain** and
 * **risk** variants that map directly to the Blue Book `--cat-*` / `--risk-*`
 * tokens (fire-protection category color-coding is semantic — §6). Soft
 * variants use a low-alpha tint of the hue with a matching foreground, the
 * instrument-panel "lit indicator" look.
 */
const badgeVariants = cva(
  cn(
    "inline-flex items-center gap-1 rounded-full border font-semibold",
    "px-2.5 py-0.5 text-[11px] leading-tight tracking-[0.02em] whitespace-nowrap"
  ),
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/[0.12] text-primary",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border bg-transparent text-foreground",
        success:
          "border-transparent bg-[hsl(var(--cat-actuation)/0.14)] text-[hsl(var(--cat-actuation))]",
        warning:
          "border-transparent bg-[hsl(var(--risk-medium)/0.16)] text-[hsl(var(--risk-medium))]",
        destructive: "border-transparent bg-destructive/[0.14] text-destructive",
        info: "border-transparent bg-accent/[0.14] text-accent",
        "primary-soft": "border-transparent bg-primary/[0.12] text-primary",
        // ── Fire-protection domain categories (Blue Book --cat-*) ──────────
        initiation:
          "border-transparent bg-[hsl(var(--cat-initiation)/0.14)] text-[hsl(var(--cat-initiation))]",
        notification:
          "border-transparent bg-[hsl(var(--cat-notification)/0.16)] text-[hsl(var(--cat-notification))]",
        monitoring:
          "border-transparent bg-[hsl(var(--cat-monitoring)/0.14)] text-[hsl(var(--cat-monitoring))]",
        actuation:
          "border-transparent bg-[hsl(var(--cat-actuation)/0.14)] text-[hsl(var(--cat-actuation))]",
        // ── Risk levels (Blue Book --risk-*) ───────────────────────────────
        "risk-high":
          "border-transparent bg-[hsl(var(--risk-high)/0.14)] text-[hsl(var(--risk-high))]",
        "risk-medium":
          "border-transparent bg-[hsl(var(--risk-medium)/0.16)] text-[hsl(var(--risk-medium))]",
        "risk-low":
          "border-transparent bg-[hsl(var(--risk-low)/0.14)] text-[hsl(var(--risk-low))]",
      },
    },
    defaultVariants: { variant: "secondary" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant, className, ...rest }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...rest} />
  )
);
Badge.displayName = "Badge";

export { badgeVariants };
