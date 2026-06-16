import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";
import { Icon } from "./Icon";

/**
 * Drawer — side sheet built on Radix `Dialog`.
 *
 * Slides in from a configurable `side` (right by default), with a header
 * (optional tinted icon pill + title/subtitle + close), a scrollable body, and
 * an optional footer. Radix handles focus-trap/scroll-lock/Escape; styling and
 * the enter/exit slide are token-driven. Use for edit forms / detail panels.
 */
export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Header icon (registry name). */
  icon?: string;
  /** Side to dock the panel. Defaults to "right". */
  side?: "right" | "left";
  /** Panel width (number → px, clamped to viewport). Defaults to 440. */
  width?: number | string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  icon,
  side = "right",
  width = 440,
  footer,
  children,
  className,
}: DrawerProps) {
  const isRight = side === "right";
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-foreground/30 backdrop-blur-[1px]",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          )}
        />
        <Dialog.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          style={{ width: typeof width === "number" ? `min(${width}px, 100vw)` : width }}
          className={cn(
            "fixed inset-y-0 z-50 flex flex-col bg-card text-card-foreground shadow-[var(--shadow-glow)] outline-none",
            isRight
              ? cn(
                  "right-0 border-l border-border",
                  "data-[state=open]:animate-in data-[state=open]:slide-in-from-right",
                  "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right"
                )
              : cn(
                  "left-0 border-r border-border",
                  "data-[state=open]:animate-in data-[state=open]:slide-in-from-left",
                  "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left"
                ),
            className
          )}
        >
          {/* Header */}
          <div className="flex flex-shrink-0 items-center gap-3 border-b border-border px-6 py-5">
            {icon && (
              <div className="flex h-9 w-9 items-center justify-center rounded-[calc(var(--radius)-0.2rem)] bg-primary/[0.12] text-primary">
                <Icon name={icon} size={16} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <Dialog.Title className="font-display text-[17px] font-extrabold tracking-[-0.01em]">
                {title}
              </Dialog.Title>
              {subtitle != null ? (
                <Dialog.Description className="text-[12px] text-muted-foreground">
                  {subtitle}
                </Dialog.Description>
              ) : (
                <Dialog.Description className="sr-only">{title}</Dialog.Description>
              )}
            </div>
            <Dialog.Close
              aria-label="Close"
              className={cn(
                "inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[calc(var(--radius)-0.2rem)]",
                "text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                "outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              <X size={16} />
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">{children}</div>

          {/* Footer */}
          {footer && <div className="flex-shrink-0 border-t border-border">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
