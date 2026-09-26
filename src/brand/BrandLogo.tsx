import type { ComponentType } from "react";
import { cn } from "../lib/cn";

export interface BrandLogoProps {
  /** Product name (also the image alt text). */
  name: string;
  /** Optional suffix rendered in the primary color (e.g. "CR"). */
  suffix?: string;
  /** Wordmark for light backgrounds (L1). Empty → text fallback. */
  logoUrl?: string;
  /** Wordmark for dark backgrounds (L2), same dimensions as logoUrl. Falls back to logoUrl. */
  logoUrlDark?: string;
  /** Standalone symbol (L3) for `variant="mark"`. Empty → icon fallback. */
  markUrl?: string;
  /** Icon shown while no logo/mark has been uploaded. */
  Icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  variant?: "full" | "mark";
  /** Height of the wordmark image / size of the mark, as Tailwind classes. */
  imgClassName?: string;
  className?: string;
}

/**
 * The brand, as uploaded in the admin console (branding document): the light/dark wordmark swaps
 * with the `.dark` class (both rendered, so no layout shift), the mark is used for compact spots,
 * and until an asset exists it falls back to the icon + name text.
 */
export function BrandLogo({
  name,
  suffix,
  logoUrl,
  logoUrlDark,
  markUrl,
  Icon,
  variant = "full",
  imgClassName,
  className,
}: BrandLogoProps) {
  if (variant === "mark") {
    if (markUrl) return <img src={markUrl} alt={name} className={cn("h-8 w-8 object-contain", imgClassName, className)} />;
    return (
      <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-md border border-primary/30 bg-primary/10", className)}>
        {Icon ? <Icon className="h-4 w-4 text-primary" aria-hidden /> : <span className="text-sm font-bold text-primary">{name.charAt(0)}</span>}
      </span>
    );
  }
  if (logoUrl) {
    return (
      <span className={cn("inline-flex items-center", className)}>
        <img src={logoUrl} alt={name} className={cn("h-8 w-auto object-contain", logoUrlDark && "dark:hidden", imgClassName)} />
        {logoUrlDark && <img src={logoUrlDark} alt={name} className={cn("hidden h-8 w-auto object-contain dark:block", imgClassName)} />}
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {(Icon || markUrl) && <BrandLogo name={name} markUrl={markUrl} Icon={Icon} variant="mark" />}
      <span className="text-lg font-bold tracking-tight">
        {name}
        {suffix && <span className="text-primary"> {suffix}</span>}
      </span>
    </span>
  );
}
