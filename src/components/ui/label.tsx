import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";

/**
 * Label — RECONCILE shim (shadcn-compatible).
 *
 * The DS CANONICAL form-label primitive is `FormLabel` (uppercase, tracked
 * micro-label, `.t-label`). This `Label` is the generic shadcn Radix label
 * retained as a compatibility export so consumers that import `Label` keep
 * working. Prefer `FormLabel` for new brand UI.
 */
const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label, labelVariants };
