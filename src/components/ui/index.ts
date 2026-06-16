/**
 * FireCode UI primitives (FCR-003).
 *
 * Token-driven, CVA-variant, tailwind-merge-friendly building blocks. Every
 * colour is `hsl(var(--token))` so the whole set re-themes at runtime via the
 * Stage-1 theme engine. Radix powers the overlays (Modal/Drawer); lucide powers
 * the Icon registry. No app CSS, no app contexts — copy/labels are injected.
 *
 * Two tiers ship here:
 *  1. The hand-built, branded FireCode primitives (PascalCase: Button, Card,
 *     Input/Select, FormField/FormLabel, Modal, Drawer, OtpInput, Pagination,
 *     MediaPicker, Badge, Spinner, Icon) — the CANONICAL set.
 *  2. The brand-neutral shadcn/Radix primitives absorbed from the app
 *     (kebab-case files) so every screen can build from one package. Where a
 *     shadcn primitive overlaps a canonical one, the canonical export is
 *     authoritative and the shadcn export is a compatibility alias:
 *       - FormLabel (canonical) ⟷ Label (shadcn compat, from ./label)
 *       - OtpInput  (canonical) ⟷ InputOTP* (shadcn compat, from ./input-otp)
 */

// ── Canonical FireCode primitives ─────────────────────────────────────────
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

// ── Absorbed shadcn / Radix primitives (brand-neutral, token-driven) ───────
export { Alert, AlertTitle, AlertDescription, alertVariants } from "./alert";
export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./alert-dialog";
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion";
export { AspectRatio } from "./aspect-ratio";
export { Avatar, AvatarImage, AvatarFallback } from "./avatar";
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "./breadcrumb";
export { Calendar, type CalendarProps } from "./calendar";
export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./carousel";
export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  type ChartConfig,
} from "./chart";
export { Checkbox } from "./checkbox";
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./collapsible";
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "./command";
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
} from "./context-menu";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./dropdown-menu";
export { HoverCard, HoverCardTrigger, HoverCardContent } from "./hover-card";
// RECONCILE: InputOTP* is the shadcn-compat alias for the canonical OtpInput.
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "./input-otp";
// RECONCILE: Label is the shadcn-compat alias for the canonical FormLabel.
export { Label, labelVariants } from "./label";
export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
} from "./menubar";
export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
} from "./navigation-menu";
export { Popover, PopoverTrigger, PopoverContent } from "./popover";
export { Progress } from "./progress";
export { RadioGroup, RadioGroupItem } from "./radio-group";
export { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./resizable";
export { ScrollArea, ScrollBar } from "./scroll-area";
export { Separator } from "./separator";
export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
export { Skeleton } from "./skeleton";
export { Slider } from "./slider";
export { Toaster, toast } from "./sonner";
export { Switch } from "./switch";
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./table";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
export { Textarea, type TextareaProps } from "./textarea";
export { Toggle, toggleVariants } from "./toggle";
export { ToggleGroup, ToggleGroupItem } from "./toggle-group";
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip";
