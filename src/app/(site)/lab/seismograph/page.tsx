import type { Metadata } from "next";
import { Seismograph } from "@/components/site/showcase/seismograph/Seismograph";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Projects: activity seismograph (preview)", robots: { index: false } };

export default function SeismographPreview() {
  return <Seismograph />;
}
