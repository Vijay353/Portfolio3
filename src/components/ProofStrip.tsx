/**
 * Three verified outcomes, one from each chapter of the career. Numbers first, context second.
 * Each figure appears only here on the homepage; the work tiles below use different evidence.
 */
const PROOF = [
  { value: "86% → 98%", label: "quote-to-order success", source: "Configit" },
  { value: "35K → 49K", label: "usable property parcels", source: "Third Estate Ventures" },
  { value: "40%", label: "less client onboarding time", source: "FactSet" },
];

export function ProofStrip() {
  return (
    <section aria-label="Results" className="mt-6 md:mt-8">
      <dl className="grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {PROOF.map((p, i) => (
          <div key={p.source} className={"flex flex-col-reverse justify-end gap-1 py-2 sm:py-4 " + (i > 0 ? "sm:pl-6 lg:pl-8" : "")}>
            <dt className="text-[0.875rem] leading-snug text-muted">
              {p.label} <span className="text-subtle">· {p.source}</span>
            </dt>
            <dd className="text-[1.625rem] leading-none font-semibold tracking-tight text-fg tabular-nums md:text-[1.875rem]">{p.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
