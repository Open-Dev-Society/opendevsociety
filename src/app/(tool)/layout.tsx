// Tool and document pages (brief §11): no marketing Nav, a --bg ground. Each tool brings its own header and footer.
export default function ToolLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="site flex flex-col">{children}</div>;
}
