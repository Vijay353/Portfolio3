import { NextResponse, type NextRequest } from "next/server";
import { isLens } from "@/lib/lens";

/**
 * ?lens=product | ?lens=consulting on the homepage → serve the matching static lens page.
 * Anything else falls through to the normal homepage. No redirects, no visible route change.
 */
export function proxy(request: NextRequest) {
  const lens = request.nextUrl.searchParams.get("lens");
  if (!isLens(lens)) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = `/lens/${lens}`;
  url.searchParams.delete("lens");
  return NextResponse.rewrite(url);
}

export const config = { matcher: "/" };
