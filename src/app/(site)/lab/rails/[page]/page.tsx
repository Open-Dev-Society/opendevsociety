import { Rails } from "@/components/site/lab/Rails";
import Home from "../../../page";
import Projects from "../../../projects/page";
import Contributors from "../../../contributors/page";
import Manifesto from "../../../manifesto/page";
import Contribute from "../../../contribute/page";
import WordOfMouth from "../../../word-of-mouth/page";

// Temporary: a real page with Rails mounted, until the layout is free (deleted with /lab/rails).
const pages = { home: Home, projects: Projects, contributors: Contributors, manifesto: Manifesto, contribute: Contribute, "word-of-mouth": WordOfMouth };

export default async function RailsOn({ params }: { params: Promise<{ page: keyof typeof pages }> }) {
  const Page = pages[(await params).page];
  return (
    <>
      <Rails />
      <Page />
    </>
  );
}
