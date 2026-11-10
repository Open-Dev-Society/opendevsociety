import { cn } from "./cn";

export function Container({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-(--container) px-(--gutter)", className)} {...rest} />;
}
