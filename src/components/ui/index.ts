/**
 * FireCode UI primitives (FCR-003, Stage 2).
 *
 * Token-driven, CVA-variant, tailwind-merge-friendly building blocks. Every
 * colour is `hsl(var(--token))` so the whole set re-themes at runtime via the
 * Stage-1 theme engine. Radix powers the overlays (Modal/Drawer); lucide powers
 * the Icon registry. No app CSS, no app contexts — copy/labels are injected.
 */

export { Icon, resolveIcon, type IconProps } from "./Icon";
export { Button, buttonVariants, type ButtonProps } from "./Button";
export { Input, Select, fieldVariants, type InputProps, type SelectProps } from "./Input";
export {
  FormField,
  FormLabel,
  type FormFieldProps,
  type FormLabelProps,
} from "./FormField";
export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardDescription,
  cardVariants,
  type CardProps,
} from "./Card";
export { Badge, badgeVariants, type BadgeProps } from "./Badge";
export { Spinner, type SpinnerProps } from "./Spinner";
export { OtpInput, type OtpInputProps } from "./OtpInput";
export { Modal, type ModalProps, type ModalVariant } from "./Modal";
export { Drawer, type DrawerProps } from "./Drawer";
export { Pagination, type PaginationProps, type PaginationLabels } from "./Pagination";
export {
  MediaPicker,
  MediaPickerCloseIcon,
  type MediaPickerProps,
  type MediaItem,
  type MediaPickerLabels,
} from "./MediaPicker";
