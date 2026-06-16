import * as React from "react";
import { Upload, X } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "./Button";
import { Input } from "./Input";
import { Spinner } from "./Spinner";
import { Modal } from "./Modal";

/** A selectable image already in the library. */
export interface MediaItem {
  id: string;
  url: string;
  filename?: string;
}

export interface MediaPickerLabels {
  select?: React.ReactNode;
  change?: React.ReactNode;
  clear?: React.ReactNode;
  title?: React.ReactNode;
  uploadHint?: React.ReactNode;
  uploading?: React.ReactNode;
  uploadError?: React.ReactNode;
  urlField?: React.ReactNode;
  urlPlaceholder?: string;
  add?: React.ReactNode;
  gallery?: React.ReactNode;
  empty?: React.ReactNode;
  loadError?: React.ReactNode;
}

const DEFAULT_LABELS: Required<MediaPickerLabels> = {
  select: "Select image",
  change: "Change",
  clear: "Clear",
  title: "Media library",
  uploadHint: "Drag an image here, or click to upload",
  uploading: "Uploading…",
  uploadError: "Upload failed. Try again.",
  urlField: "Image URL",
  urlPlaceholder: "https://…",
  add: "Add",
  gallery: "Library",
  empty: "No images yet.",
  loadError: "Could not load the library.",
};

export interface MediaPickerProps {
  /** Stored image ref (absolute URL). */
  value: string | null | undefined;
  /** Persist the new ref. Empty string clears. */
  onChange: (ref: string) => void;
  /** Library items to show in the gallery. */
  gallery?: MediaItem[];
  /** Upload a picked/dropped file; resolve to the stored URL. */
  onUpload?: (file: File) => Promise<string>;
  /** Register an external URL; resolve to the stored URL (defaults to the URL). */
  onAddUrl?: (url: string) => Promise<string>;
  /** Map a stored ref to a displayable src (e.g. prefix a CDN). Identity default. */
  resolveUrl?: (ref: string | null | undefined) => string;
  galleryLoading?: boolean;
  galleryError?: boolean;
  disabled?: boolean;
  labels?: MediaPickerLabels;
  className?: string;
}

const isImageSrc = (src: string) => /^(https?:|data:image\/|blob:|\/)/i.test(src);

/**
 * MediaPicker — image field with preview + Select/Change/Clear and a library
 * modal (upload dropzone, URL paste, selectable gallery).
 *
 * Fully decoupled from any app: the host injects the `gallery`, `onUpload`,
 * `onAddUrl`, and `resolveUrl` so this primitive carries no data-fetching,
 * org-context, or i18n dependency. Stores a plain absolute URL string via
 * `onChange`. Styling is token-driven and reuses `Button`/`Input`/`Modal`.
 */
export function MediaPicker({
  value,
  onChange,
  gallery = [],
  onUpload,
  onAddUrl,
  resolveUrl = (r) => r ?? "",
  galleryLoading = false,
  galleryError = false,
  disabled = false,
  labels,
  className,
}: MediaPickerProps) {
  const t = { ...DEFAULT_LABELS, ...labels };
  const [open, setOpen] = React.useState(false);
  const [urlDraft, setUrlDraft] = React.useState("");
  const [dragging, setDragging] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const previewSrc = resolveUrl(value);

  const choose = (ref: string) => {
    onChange(ref);
    setOpen(false);
  };

  const doUpload = async (file: File) => {
    if (!onUpload) return;
    setError(null);
    setBusy(true);
    try {
      choose(await onUpload(file));
    } catch {
      setError(String(t.uploadError));
    } finally {
      setBusy(false);
    }
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void doUpload(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) void doUpload(file);
  };

  const addUrl = async () => {
    const url = urlDraft.trim();
    if (!url) return;
    setUrlDraft("");
    setError(null);
    if (onAddUrl) {
      try {
        choose(await onAddUrl(url));
        return;
      } catch {
        /* fall through to storing the raw ref */
      }
    }
    choose(url);
  };

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {/* Field row */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          aria-label={value ? String(t.change) : String(t.select)}
          className={cn(
            "flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden",
            "rounded-[calc(var(--radius)-0.1rem)] border border-border bg-muted/35 text-muted-foreground",
            "transition-colors hover:border-primary disabled:opacity-55"
          )}
        >
          {value && isImageSrc(previewSrc) ? (
            <img src={previewSrc} alt="" className="h-full w-full object-cover" />
          ) : (
            <Upload size={22} />
          )}
        </button>

        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" icon="upload" disabled={disabled} onClick={() => setOpen(true)}>
              {value ? t.change : t.select}
            </Button>
            {value && (
              <Button variant="ghost" size="sm" icon="close" disabled={disabled} onClick={() => onChange("")}>
                {t.clear}
              </Button>
            )}
          </div>
          {value && (
            <p className="max-w-full truncate font-mono text-[12px] text-muted-foreground" title={value}>
              {value}
            </p>
          )}
        </div>
      </div>

      {/* Library modal */}
      <Modal open={open} onClose={() => setOpen(false)} title={t.title} icon={null}>
        <div className="text-left">
          {/* Dropzone */}
          {onUpload && (
            <>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => !busy && inputRef.current?.click()}
                className={cn(
                  "flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-[calc(var(--radius)-0.1rem)]",
                  "border-2 border-dashed transition-colors",
                  dragging ? "border-primary bg-primary/[0.06]" : "border-border bg-muted/35"
                )}
              >
                {busy ? (
                  <>
                    <Spinner />
                    <span className="text-[12px] text-muted-foreground">{t.uploading}</span>
                  </>
                ) : (
                  <>
                    <Upload size={26} className="text-muted-foreground" />
                    <span className="px-3 text-center text-[12px] text-muted-foreground">{t.uploadHint}</span>
                  </>
                )}
              </div>
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />
            </>
          )}

          {error && <p className="mt-2 text-[12px] text-destructive">{error}</p>}

          {/* URL paste */}
          <div className="mt-3 flex items-end gap-2">
            <div className="flex-1">
              <span className="t-label mb-1 block">{t.urlField}</span>
              <Input
                inputSize="sm"
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                placeholder={t.urlPlaceholder}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void addUrl();
                  }
                }}
              />
            </div>
            <Button variant="outline" size="sm" icon="plus" onClick={() => void addUrl()} disabled={!urlDraft.trim()}>
              {t.add}
            </Button>
          </div>

          {/* Gallery */}
          <div className="mt-4">
            <span className="t-label mb-1 block">{t.gallery}</span>
            {galleryLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : galleryError ? (
              <p className="py-6 text-center text-[13px] text-muted-foreground">{t.loadError}</p>
            ) : gallery.length === 0 ? (
              <p className="py-6 text-center text-[13px] text-muted-foreground">{t.empty}</p>
            ) : (
              <div className="mt-1 grid grid-cols-4 gap-2">
                {gallery.map((item) => {
                  const selected = item.url === value;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => choose(item.url)}
                      title={item.filename}
                      className={cn(
                        "aspect-square overflow-hidden rounded-[calc(var(--radius)-0.15rem)] border bg-muted/35 transition-all",
                        selected ? "border-primary ring-2 ring-primary" : "border-border hover:border-primary"
                      )}
                    >
                      <img
                        src={resolveUrl(item.url)}
                        alt={item.filename ?? ""}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Re-export X so consumers that build their own close affordance can reuse it
// without a second lucide import. (Tree-shaken if unused.)
export { X as MediaPickerCloseIcon };
