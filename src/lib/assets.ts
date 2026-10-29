import fs from "node:fs";
import path from "node:path";

/**
 * Server-side check that a file exists under /public.
 * Pages are statically generated, so this runs at build time: a missing asset
 * produces a clean fallback instead of a broken image or a dead download link.
 */
export function publicAssetExists(publicPath: string | null | undefined): boolean {
  if (!publicPath || /^https?:\/\//.test(publicPath)) return Boolean(publicPath);
  try {
    return fs.statSync(path.join(process.cwd(), "public", publicPath.replace(/^\//, ""))).isFile();
  } catch {
    return false;
  }
}

/** Resolve an image path using common extensions when the configured one is missing. */
export function resolvePublicImage(publicPath: string | null | undefined): string | null {
  if (!publicPath) return null;
  if (/^https?:\/\//.test(publicPath)) return publicPath;
  if (publicAssetExists(publicPath)) return publicPath;

  const extension = path.extname(publicPath).toLowerCase();
  const basePath = extension ? publicPath.slice(0, -extension.length) : publicPath;
  for (const candidateExtension of [".jpg", ".jpeg", ".png", ".webp"]) {
    if (candidateExtension === extension) continue;
    const candidate = `${basePath}${candidateExtension}`;
    if (publicAssetExists(candidate)) return candidate;
  }
  return null;
}
