import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { profile } from "@/content/profile";
import "./globals.css";
import "./experience.css";
import "./showcase.css";
import "./interactive.css";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { Cursor } from "@/components/animations/Cursor";
import { CommandPalette } from "@/components/interactive/CommandPalette";

export const metadata: Metadata = {
  metadataBase: new URL(profile.url),
  title: {
    default: "Wajahat Naqvi | Shopify Full-Stack Developer",
    template: "%s — Wajahat Naqvi",
  },
  description:
    "Wajahat Naqvi is a Shopify full-stack developer in Lahore, Pakistan, specializing in Shopify apps, Liquid, React, Next.js, Laravel, GraphQL, APIs, ecommerce automation, and AI workflows.",
  keywords: [
    "Wajahat Naqvi",
    "Shopify Developer",
    "Shopify App Developer",
    "Full-Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Laravel Developer",
    "Shopify Liquid",
    "GraphQL",
    "Ecommerce Developer",
    "Lahore Pakistan",
  ],
  authors: [
    { name: "Wajahat Naqvi", url: "https://wajahatalinaqvi.github.io/" },
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Wajahat Naqvi | Shopify Full-Stack Developer",
    description:
      "Shopify app developer and full-stack engineer building with Liquid, React, Next.js, Laravel, GraphQL, APIs, ecommerce automation, and AI workflows.",
    url: "/",
    siteName: "Wajahat Naqvi",
    type: "profile",
    locale: "en_US",
    images: [
      {
        url: "/images/social-card.png",
        width: 1200,
        height: 630,
        alt: "Wajahat Naqvi | Shopify Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wajahat Naqvi | Shopify Full-Stack Developer",
    description:
      "Shopify app developer and full-stack engineer in Lahore, Pakistan.",
    images: ["/images/social-card.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { "max-image-preview": "large" },
  },
  icons: { icon: "/icon.svg" },
  verification: { google: "tEo1fM4wNdMSfOtfsmYj9SyXsNDRicm3eKm-3C_vpFg" },
};
export const viewport: Viewport = {
  themeColor: "#0b0f14",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: "Shopify Full-Stack Developer",
    url: profile.url,
    image: `${profile.url}/images/wajahat-naqvi.webp`,
    sameAs: [profile.github, profile.linkedin],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lahore",
      addressCountry: "PK",
    },
    knowsAbout: [
      "Shopify Development",
      "Shopify Apps",
      "Shopify Liquid",
      "React",
      "Next.js",
      "Laravel",
      "GraphQL",
      "Ecommerce Development",
      "AI Workflows",
    ],
  };
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body id="top">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
        <SmoothScroll />
        <Cursor />
        <CommandPalette />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(person).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
