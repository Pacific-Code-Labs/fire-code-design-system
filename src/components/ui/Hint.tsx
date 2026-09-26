import type { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export interface HintProps {
  label: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  /** Render the child alone (no tooltip), e.g. when the label is already visible. */
  disabled?: boolean;
  children: ReactNode;
}

/** Styled tooltip for icon-only controls. Needs a `TooltipProvider` higher up. */
export function Hint({ label, side = "top", disabled, children }: HintProps) {
  if (disabled) return <>{children}</>;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{label}</TooltipContent>
    </Tooltip>
  );
}
