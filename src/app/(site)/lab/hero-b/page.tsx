import type { Metadata } from "next";
import { HeroB } from "@/components/site/hero-b/HeroB";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Hero B: Signal (preview)", robots: { index: false } };

export default function Page() {
  return <HeroB />;
}
