import { Footer, Nav } from "@/components/site";
import { Rails } from "@/components/site/lab/Rails";
import { compact } from "@/lib/format";
import { getOrgTotals } from "@/lib/github";
import { logo, siteName, social } from "@/content";

// The IA (brief §8). On Home the links scroll to their section; elsewhere they mark the route.
const links = [
  { label: "Projects", href: "/projects", section: "work" },
  { label: "Contributors", href: "/contributors", section: "people" },
  { label: "Manifesto", href: "/manifesto" },
  { label: "What people say", href: "/word-of-mouth", section: "signal" },
];
const socials = [social.github, social.discord, social.linkedin, { ...social.twitter, label: "X" }];

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const totals = await getOrgTotals();
  return (
    <div className="site">
      <Rails />
      <Nav
        brand={{ name: siteName, logo: logo.src }}
        links={links}
        stars={{ label: compact(totals.stars), href: social.github.href }}
        contribute={{ label: "Start contributing →", href: "/contribute" }}
        socials={socials}
      />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
