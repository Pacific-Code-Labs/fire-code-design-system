import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Diameter in px. */
  size?: number;
  /** Optional label shown beside (inline) or under (centered) the spinner. */
  label?: React.ReactNode;
  /** Fill at least 60vh and center — for full-page/route loading states. */
  fullHeight?: boolean;
}

/**
 * Spinner — the loading indicator. Spins a lucide `Loader2` tinted with the
 * fire-orange `--primary` token. Inline by default; `fullHeight` centers it in
 * a tall flex column for route/page loaders.
 */
export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = 28, label, fullHeight = false, className, ...rest }, ref) => {
    const inner = (
      <>
        <Loader2 size={size} className="animate-spin text-primary shrink-0" aria-hidden="true" />
        {label != null && <span className="text-[13px] text-muted-foreground">{label}</span>}
      </>
    );
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(
          fullHeight
            ? "flex flex-col items-center justify-center gap-3 h-full min-h-[60vh]"
            : "flex items-center gap-2",
          className
        )}
        {...rest}
      >
        {inner}
      </div>
    );
  }
);
Spinner.displayName = "Spinner";
