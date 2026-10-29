import { site } from "@/content/site";
import { selectedSystems } from "@/content/selected-systems";
import { experience } from "@/content/experience";

/**
 * Print-only executive brief. Hidden on screen (see .print-brief in globals.css) and shown
 * by Cmd/Ctrl+P or the palette's "Download … (PDF)" action. Built from the same content
 * as the site, so it can't drift from it.
 */
export function PrintBrief() {
  return (
    <div className="print-brief" aria-hidden="true">
      <h1>{site.name}</h1>
      <p className="meta">
        {site.role} · {site.email} · {site.linkedin?.replace(/^https?:\/\//, "")} · {site.github?.replace(/^https?:\/\//, "")}
      </p>
      <p>{site.positioning}</p>

      <h2>Career history</h2>
      {experience.map((e) => (
        <div key={e.organization} className="case">
          <h3>
            {e.organization} <span className="meta">· {e.location} · {e.span}</span>
          </h3>
          <ul>
            {e.roles.map((r) => (
              <li key={r.title}>
                {r.title} <span className="meta">({r.dates})</span>
              </li>
            ))}
          </ul>
          <p>{e.summary}</p>
        </div>
      ))}

      <h2 className="page-break">Case studies: executive summaries</h2>
      {selectedSystems.map((s) => (
        <div key={s.slug} className="case">
          <h3>{s.name}</h3>
          <p className="meta">{s.eyebrow}</p>
          <p>{s.positioning}</p>
          <p>
            <strong>Problem:</strong> {s.problem}
          </p>
          <div className="metrics">
            {s.metrics.map((m) => (
              <span key={m.label}>
                <strong>{m.value}</strong> {m.label}
              </span>
            ))}
          </div>
          <p>
            <strong>Outcome:</strong> {s.before} → {s.after}. <span className="meta">Stack: {s.stack.join(", ") || "n/a"}.</span>
          </p>
        </div>
      ))}

      <div className="print-footer">Compiled from banoth.dev — Generated for offline review.</div>
    </div>
  );
}
