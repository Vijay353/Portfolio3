import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page py-24 md:py-32">
      <p className="eyebrow mb-3">404</p>
      <h1 className="font-serif text-[2.25rem] font-semibold tracking-tight text-fg">This page doesn't exist</h1>
      <p className="mt-4 max-w-xl text-muted">It may have moved, or the case study isn't published yet.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">Home</Link>
        <Link href="/work" className="btn btn-secondary">All work</Link>
      </div>
    </section>
  );
}
