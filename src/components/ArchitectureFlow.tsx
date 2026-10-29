import type { SystemNode } from "@/content/types";

/**
 * Architecture micro-diagram: five pill nodes joined by hairlines, labels in mono.
 * Static by default; hovering or focusing a node shows its one-line note.
 */
export function ArchitectureFlow({ nodes }: { nodes: SystemNode[] }) {
  return (
    <ol className="flex flex-col" aria-label="Architecture">
      {nodes.map((node, i) => (
        <li key={node.label} className="flex flex-col">
          <span
            tabIndex={0}
            className="group relative inline-flex w-fit items-center gap-2 rounded-full border border-line-strong bg-surface px-3 py-1.5 text-fg outline-none focus-visible:outline-2 focus-visible:outline-accent"
          >
            <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent" />
            <span className="mono text-[0.75rem] leading-tight">{node.label}</span>
            <span
              role="tooltip"
              className="pointer-events-none invisible absolute top-full left-0 z-10 mt-2 w-max max-w-[16rem] rounded-md border border-line bg-surface px-2.5 py-1.5 text-[0.8125rem] leading-snug text-muted shadow-[0_8px_24px_-18px_rgb(0_0_0/0.35)] group-hover:visible group-focus:visible"
            >
              {node.note}
            </span>
          </span>
          {i < nodes.length - 1 ? <span aria-hidden className="ml-[0.9375rem] h-4 w-px bg-line-strong" /> : null}
        </li>
      ))}
    </ol>
  );
}
