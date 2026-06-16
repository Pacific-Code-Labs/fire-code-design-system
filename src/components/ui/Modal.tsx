import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { Icon } from "./Icon";
import { Button, type ButtonProps } from "./Button";

/**
 * Modal — accessible centered dialog built on Radix `Dialog`.
 *
 * Radix gives focus-trapping, scroll-lock, Escape/overlay-close, and ARIA
 * wiring; FireCode supplies the instrument styling (token surfaces, a tinted
 * variant icon "pill", a fire-orange focus ring) entirely from tokens. The
 * variant tints the header icon and drives a sensible default icon. Provide
 * `confirm`/`cancel` for the standard two-button footer, or compose freely via
 * `children`.
 */
export type ModalVariant = "default" | "destructive" | "success" | "warning";

const pillVariants = cva(
  "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full",
  {
    variants: {
      variant: {
        default: "bg-primary/[0.12] text-primary",
        destructive: "bg-destructive/[0.12] text-destructive",
        success: "bg-[hsl(var(--cat-actuation)/0.14)] text-[hsl(var(--cat-actuation))]",
        warning: "bg-[hsl(var(--risk-medium)/0.16)] text-[hsl(var(--risk-medium))]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

const DEFAULT_ICON: Record<ModalVariant, string> = {
  default: "info",
  destructive: "alertTri",
  success: "checkCircle",
  warning: "lock",
};

interface ModalAction {
  label: React.ReactNode;
  onClick: () => void;
  variant?: ButtonProps["variant"];
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: React.ReactNode;
}

export interface ModalProps extends VariantProps<typeof pillVariants> {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Header icon (registry name). Defaults per `variant`. `null` hides it. */
  icon?: string | null;
  confirm?: ModalAction;
  cancel?: ModalAction;
  /** Footer cancel label when `cancel` is omitted. */
  cancelLabel?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  icon,
  variant = "default",
  confirm,
  cancel,
  cancelLabel = "Cancel",
  children,
  className,
}: ModalProps) {
  const v = (variant ?? "default") as ModalVariant;
  const iconName = icon === null ? null : icon ?? DEFAULT_ICON[v];

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-foreground/45 backdrop-blur-[2px]",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          )}
        />
        <Dialog.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-[420px] -translate-x-1/2 -translate-y-1/2",
            "rounded-[var(--radius)] border border-border bg-card p-6 text-card-foreground shadow-[var(--shadow-glow)]",
            "outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            className
          )}
        >
          {iconName && (
            <div className={pillVariants({ variant })}>
              <Icon name={iconName} size={24} />
            </div>
          )}

          <Dialog.Title className={cn("t-h4 text-center", description ? "mb-2" : "")}>
            {title}
          </Dialog.Title>

          {description != null ? (
            <Dialog.Description
              className={cn("t-sm text-center text-muted-foreground", children ? "mb-4" : "")}
            >
              {description}
            </Dialog.Description>
          ) : (
            // Radix wants a Description for a11y; render a hidden one when absent.
            <Dialog.Description className="sr-only">{title}</Dialog.Description>
          )}

          {children && <div className="mb-1 mt-1">{children}</div>}

          {(confirm || cancel) && (
            <div className="mt-5 grid grid-cols-2 gap-2">
              {cancel ? (
                <Button
                  variant={cancel.variant ?? "outline"}
                  onClick={cancel.onClick}
                  disabled={cancel.disabled}
                >
                  {cancel.label}
                </Button>
              ) : (
                <Button variant="outline" onClick={onClose}>
                  {cancelLabel}
                </Button>
              )}
              {confirm && (
                <Button
                  variant={confirm.variant ?? (v === "destructive" ? "destructive" : "primary")}
                  onClick={confirm.onClick}
                  disabled={confirm.disabled}
                  loading={confirm.loading}
                >
                  {confirm.loading ? confirm.loadingLabel ?? confirm.label : confirm.label}
                </Button>
              )}
            </div>
          )}

          <Dialog.Close
            aria-label="Close"
            className={cn(
              "absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-[calc(var(--radius)-0.2rem)]",
              "text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <X size={16} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
