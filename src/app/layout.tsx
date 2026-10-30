import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { AnalyticsListener } from "@/components/AnalyticsListener";
import { CopyToastHost } from "@/components/CopyToast";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PrintBrief } from "@/components/PrintBrief";
import { ThemeScript } from "@/components/ThemeScript";
import { site, siteUrl } from "@/content/site";
import "./globals.css";

// Self-hosted variable fonts (OFL): no network request to a font CDN, preloaded, with metric-matched fallbacks.
const inter = localFont({
  src: "./fonts/Inter-Variable.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});
const sourceSerif = localFont({
  src: "./fonts/SourceSerif4-Variable.woff2",
  variable: "--font-source-serif",
  weight: "200 900",
  display: "swap",
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
// Env override wins when set (non-empty); otherwise fall back to the hardcoded project ID
// so an empty NEXT_PUBLIC_CLARITY_ID can never silently disable tracking.
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "z5yy1disb2";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} | ${site.role}`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} | ${site.role}`,
    description: site.description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.role}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1115" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
        {GA_ID ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(GA_ID)},{send_page_view:false});`,
            }}
          />
        ) : null}
        {/* Plain script (not next/script) so the tag is in SSR HTML and runs without the Script loader. */}
        <script
          id="clarity"
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", ${JSON.stringify(CLARITY_ID)});`,
          }}
        />
      </head>
      <body className="min-h-dvh">
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <PrintBrief />
        <CopyToastHost />
        <AnalyticsListener gaEnabled={Boolean(GA_ID)} />
        {GA_ID ? <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" /> : null}
      </body>
    </html>
  );
}
