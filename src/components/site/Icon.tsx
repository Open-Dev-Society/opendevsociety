// The site's icons: Iconsax (iconsax-reactjs, MIT), Linear variant, 1.5 stroke on a 24 grid, currentColor.
// No hooks inside, so these render on the server. Brand marks Iconsax lacks (GitHub, Discord, X, LinkedIn) are drawn below.
import {
  Activity as IxActivity,
  Add as IxAdd,
  ArrowDown as IxArrowDown,
  ArrowRight as IxArrowRight,
  ArrowUp as IxArrowUp,
  Award as IxAward,
  Book1 as IxBook,
  Box as IxBox,
  Calendar as IxCalendar,
  Clock as IxClock,
  Code as IxCode,
  Copy as IxCopy,
  CopySuccess as IxCopySuccess,
  DocumentText as IxDocument,
  Filter as IxFilter,
  Global as IxGlobal,
  HamburgerMenu as IxMenu,
  Heart as IxHeart,
  Import as IxImport,
  InfoCircle as IxInfoCircle,
  Link as IxLink,
  Message as IxMessage,
  Profile2User as IxPeople,
  Refresh as IxRefresh,
  SearchNormal1 as IxSearch,
  Star1 as IxStar,
  TickCircle as IxTickCircle,
  type Icon as IconsaxIcon,
} from "iconsax-reactjs";
import { cn } from "./cn";

type Props = {
  /** Pixels, or "1em" to follow the surrounding text. */
  size?: number | string;
  /** Set it when the icon carries meaning on its own: role="img" + aria-label. Otherwise it's hidden from AT. */
  label?: string;
  className?: string;
};

// inline-block + a small negative baseline shift sits the glyph on the text's x-height, in running text or in a flex row.
const base = "inline-block shrink-0 align-[-0.125em]";
const a11y = (label?: string) => (label ? { role: "img", "aria-label": label } : { "aria-hidden": true as const });

const iconsax = (Glyph: IconsaxIcon, rotate?: number) => {
  const C = ({ size = 16, label, className }: Props) => (
    <Glyph
      variant="Linear"
      size={size}
      color="currentColor"
      focusable="false"
      className={cn(base, className)}
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
      {...a11y(label)}
    />
  );
  C.displayName = Glyph.displayName;
  return C;
};

export const ArrowRight = iconsax(IxArrowRight);
/** Leaves the site (↗). Iconsax has no diagonal arrow, so it's ArrowRight turned 45°. */
export const External = iconsax(IxArrowRight, -45);
export const ArrowUp = iconsax(IxArrowUp);
export const ArrowDown = iconsax(IxArrowDown);
export const Star = iconsax(IxStar);
export const Copy = iconsax(IxCopy);
export const Copied = iconsax(IxCopySuccess);
export const Check = iconsax(IxTickCircle);
export const Alert = iconsax(IxInfoCircle);
export const Code = iconsax(IxCode);
export const Docs = iconsax(IxBook);
export const Document = iconsax(IxDocument);
export const People = iconsax(IxPeople);
export const Projects = iconsax(IxBox);
export const Activity = iconsax(IxActivity);
export const Calendar = iconsax(IxCalendar);
export const Clock = iconsax(IxClock);
export const Menu = iconsax(IxMenu);
/** Iconsax draws close as its plus turned 45°. */
export const Close = iconsax(IxAdd, 45);
export const Plus = iconsax(IxAdd);
export const Search = iconsax(IxSearch);
export const Filter = iconsax(IxFilter);
export const LinkIcon = iconsax(IxLink);
export const Heart = iconsax(IxHeart);
export const Message = iconsax(IxMessage);
export const Website = iconsax(IxGlobal);
export const Certificate = iconsax(IxAward);
export const Download = iconsax(IxImport);
export const Refresh = iconsax(IxRefresh);

// Brand marks: filled logos on the same 24 grid, so they sit at the same size as the Linear icons.
const brand = (d: string, name: string) => {
  const C = ({ size = 16, label, className }: Props) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" focusable="false" className={cn(base, className)} {...a11y(label)}>
      <path d={d} />
    </svg>
  );
  C.displayName = name;
  return C;
};

export const GitHub = brand(
  "M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49l-.01-1.7c-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.85.09-.66.35-1.12.64-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.4 9.4 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9l-.01 2.81c0 .27.18.6.69.49A10.22 10.22 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z",
  "GitHub",
);
export const Discord = brand(
  "M19.27 5.33A16.6 16.6 0 0 0 15.1 4l-.2.4a15.3 15.3 0 0 1 3.7 1.86 12.6 12.6 0 0 0-11.2 0A15.3 15.3 0 0 1 9.1 4.4L8.9 4a16.6 16.6 0 0 0-4.17 1.33C2.1 9.27 1.38 13.1 1.74 16.88a16.8 16.8 0 0 0 5.1 2.6l1.1-1.5a10.9 10.9 0 0 1-1.73-.84l.42-.33a11.9 11.9 0 0 0 10.74 0l.42.33c-.55.33-1.13.61-1.73.84l1.1 1.5a16.8 16.8 0 0 0 5.1-2.6c.43-4.38-.72-8.18-3-11.55ZM8.68 14.6c-1 0-1.82-.93-1.82-2.07s.8-2.07 1.82-2.07 1.84.93 1.82 2.07c0 1.14-.8 2.07-1.82 2.07Zm6.64 0c-1 0-1.82-.93-1.82-2.07s.8-2.07 1.82-2.07 1.84.93 1.82 2.07c0 1.14-.8 2.07-1.82 2.07Z",
  "Discord",
);
export const XMark = brand(
  "M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.17h1.7L7.4 4.73H5.58l11.09 14.44Z",
  "X",
);
export const LinkedIn = brand(
  "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z",
  "LinkedIn",
);

/** Project status as a small CSS dot: filled (running), half (paused), ring (archived). Reads better than an icon at label size. */
export function StatusDot({ status, className }: { status: "running" | "paused" | "archived"; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-[0.6em] shrink-0 rounded-full border border-current align-[0.05em]",
        status === "running" && "bg-current",
        status === "paused" && "bg-[linear-gradient(90deg,currentColor_50%,transparent_50%)]",
        className,
      )}
    />
  );
}
