/** Shared shapes for content files. `icon` is a lucide-react icon name (string), so content stays pure data. */
export interface Link {
  label: string;
  href: string;
  /** true for off-site links the old UI opened in a new tab */
  external?: boolean;
}

export interface PageMeta {
  title: string;
  description: string;
}

export interface Heading {
  /** mono eyebrow, e.g. "// SYSTEM_CAPABILITIES [3_VECTORS]" */
  eyebrow: string;
  title: string;
  /** word(s) the old UI rendered bold / non-italic */
  accent?: string;
  description?: string;
}
