import type { Metadata } from "next";
import { Colonies } from "@/components/site/showcase/colonies/Colonies";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Projects as living colonies (preview)", robots: { index: false } };

export default function ColoniesPreview() {
  return <Colonies />;
}
