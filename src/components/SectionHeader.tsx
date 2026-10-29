import { cn } from "@/lib/cn";

/** Consistent section opening: small label, serif heading, optional one-line intro. */
export function SectionHeader({
  id,
  eyebrow,
  title,
  intro,
  className,
  action,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
        <h2 id={id} className="font-serif text-[1.875rem] leading-tight font-semibold tracking-tight text-fg md:text-[2.25rem]">
          {title}
        </h2>
        {intro ? <p className="mt-3 text-[1.0625rem] leading-relaxed text-muted">{intro}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
