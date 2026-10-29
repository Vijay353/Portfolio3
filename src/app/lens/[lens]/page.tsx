import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePage } from "@/components/HomePage";
import { isLens, LENSES } from "@/lib/lens";

/**
 * Lens variants of the homepage. Visitors reach them as /?lens=product or /?lens=consulting
 * (rewritten by src/proxy.ts), so the URL they share stays on the homepage.
 * Statically generated; canonical points at / so search engines see one homepage.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return LENSES.map((lens) => ({ lens }));
}

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

export default async function LensPage({ params }: { params: Promise<{ lens: string }> }) {
  const { lens } = await params;
  if (!isLens(lens)) notFound();
  return <HomePage lens={lens} />;
}
