import type { Metadata } from "next";
import { Blueprint } from "@/components/site/showcase/blueprint/Blueprint";
import { getWorkshop } from "@/lib/workshop";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Projects as blueprint sheets (preview)", robots: { index: false } };

export default async function BlueprintPreview() {
  const { now, tools, builders } = await getWorkshop();
  return <Blueprint tools={tools} builders={builders} now={now} />;
}
