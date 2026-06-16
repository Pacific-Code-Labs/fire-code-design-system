import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/cn";
import { Select } from "./Input";

export interface PaginationLabels {
  /** `(start, end, total) => "Showing 1-12 of 240"`. */
  range?: (start: number, end: number, total: number) => React.ReactNode;
  pageSize?: React.ReactNode;
  previous?: React.ReactNode;
  next?: React.ReactNode;
}

export interface PaginationProps {
  /** 1-based current page. */
  page: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  /** Override copy (defaults are English; host can localize). */
  labels?: PaginationLabels;
  className?: string;
}

/**
 * Pagination — range summary + optional page-size selector + prev/next.
 *
 * App-agnostic: all copy is supplied via `labels` (English defaults), so it has
 * no i18n-context dependency. Controls are token-driven (hairline `--border`,
 * `--muted` hover, disabled at low opacity). Hides itself when there's a single
 * page and no size selector.
 */
export function Pagination({
  page,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [12, 24, 48, 96],
  labels,
  className,
}: PaginationProps) {
  if (totalPages <= 1 && !onPageSizeChange) return null;

  const startItem = totalElements > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = Math.min(startItem + pageSize - 1, totalElements);

  const rangeText =
    labels?.range?.(startItem, endItem, totalElements) ??
    `Showing ${startItem}-${endItem} of ${totalElements}`;

  const navBtn = cn(
    "inline-flex items-center gap-1 rounded-[calc(var(--radius)-0.15rem)] border border-border",
    "bg-transparent px-3 py-1.5 text-[13px] text-foreground transition-colors",
    "hover:bg-muted disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent"
  );

  return (
    <div className={cn("mt-6 flex flex-wrap items-center justify-between gap-2.5", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[13px] text-muted-foreground">{rangeText}</span>
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5">
            {labels?.pageSize != null && (
              <span className="text-xs text-muted-foreground">{labels.pageSize}</span>
            )}
            <Select
              inputSize="sm"
              value={pageSize}
              onChange={(e) => {
                onPageChange(1);
                onPageSizeChange(Number(e.target.value));
              }}
              className="h-8 w-auto"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className={navBtn}
          >
            <ChevronLeft size={15} />
            {labels?.previous ?? "Previous"}
          </button>
          <span className="px-2 text-[13px] font-semibold text-foreground tabular-nums">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className={navBtn}
          >
            {labels?.next ?? "Next"}
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
