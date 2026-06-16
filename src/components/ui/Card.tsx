import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

/**
 * Card — the surface primitive.
 *
 * Token-driven: `--card` surface, `--border` hairline, `--shadow-panel`
 * elevation, `--radius` corners. `hoverable` adds a precise lift + a fire-orange
 * border-glow on hover (the instrument "interactive panel" feel). Compose with
 * `CardHeader`/`CardBody`/`CardFooter`/`CardTitle`/`CardDescription`.
 */
const cardVariants = cva(
  "bg-card text-card-foreground border border-border rounded-[var(--radius)] shadow-[var(--shadow-panel)]",
  {
    variants: {
      hoverable: {
        true: cn(
          "cursor-pointer transition-[transform,border-color,box-shadow] duration-200",
          "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-glow)]"
        ),
        false: "",
      },
    },
    defaultVariants: { hoverable: false },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Render as a different element (e.g. `"a"`, `"article"`). */
  as?: React.ElementType;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable, as, className, children, ...rest }, ref) => {
    const Tag = (as ?? "div") as React.ElementType;
    return (
      <Tag ref={ref} className={cn(cardVariants({ hoverable }), className)} {...rest}>
        {children}
      </Tag>
    );
  }
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={cn("px-6 pt-5", className)} {...rest} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={cn("p-6", className)} {...rest} />
  )
);
CardBody.displayName = "CardBody";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={cn("px-6 py-4 border-t border-border", className)} {...rest} />
  )
);
CardFooter.displayName = "CardFooter";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...rest }, ref) => (
    <h3 ref={ref} className={cn("t-h4 mb-1", className)} {...rest} />
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...rest }, ref) => (
    <p ref={ref} className={cn("t-sm text-muted-foreground", className)} {...rest} />
  )
);
CardDescription.displayName = "CardDescription";

export { cardVariants };
