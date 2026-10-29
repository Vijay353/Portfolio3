import type { Lens } from "@/content/types";

/**
 * Lightweight role lens (?lens=product | ?lens=consulting).
 * It only changes the order of Selected Work (the first project becomes the large tile)
 * and the one supporting sentence in the hero. Same page, same content, same navigation.
 */
export const LENSES = ["product", "consulting"] as const satisfies readonly Lens[];

export function isLens(value: unknown): value is Exclude<Lens, "default"> {
  return typeof value === "string" && (LENSES as readonly string[]).includes(value);
}

/** One sentence. The trajectory story lives in About, not here. */
export const heroSupport: Record<Lens, string> = {
  default: "Most enterprise software breaks at the seams between business logic and technical execution. I design and deliver the systems that close that gap.",
  product: "Product discovery and prioritization, grounded in years of shipping enterprise systems.",
  consulting: "Enterprise delivery from discovery to go-live across Salesforce, SAP, and CPQ.",
};

export const featuredOrder: Record<Lens, string[]> = {
  default: ["configit-quote-to-order", "third-estate-property-data", "ub-product-discovery", "ai-contract-analyzer"],
  product: ["ub-product-discovery", "third-estate-property-data", "configit-quote-to-order", "ai-contract-analyzer"],
  consulting: ["configit-quote-to-order", "third-estate-property-data", "ub-product-discovery", "ai-contract-analyzer"],
};
