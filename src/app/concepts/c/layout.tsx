import { Bricolage_Grotesque } from "next/font/google";
import "./c.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });

export default function ConceptCLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} ods-c`}>{children}</div>;
}
