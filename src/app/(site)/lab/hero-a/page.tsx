import type { Metadata } from "next";
import { HeroA } from "@/components/site/hero-a/HeroA";
import { getWorkshop } from "@/lib/workshop";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Hero A: Living society (preview)", robots: { index: false } };

export default async function HeroAPreview() {
  const { now, tools, people, lastPush } = await getWorkshop();
  return <HeroA now={now} tools={tools} people={people} lastPush={lastPush} />;
}
