import type { Metadata } from "next";
import { Plate } from "@/components/site/atlas/Plate";
import { getWorkshop } from "@/lib/workshop";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Atlas of Open Software, Plate I (preview)", robots: { index: false } };

export default async function AtlasPreview() {
  const { now, tools, people, lastPush } = await getWorkshop();
  return <Plate now={now} tools={tools} people={people} lastPush={lastPush} />;
}
