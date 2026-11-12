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
    default: "Wajahat Naqvi — Full-Stack Developer",
    template: "%s — Wajahat Naqvi",
  },
  description:
    "Wajahat Naqvi is a Full-Stack Developer in Lahore building thoughtful web applications with React, Laravel, APIs, and a specialization in Shopify commerce.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Wajahat Naqvi — Full-Stack Developer",
    description:
      "Building thoughtful digital products from interface to infrastructure.",
    url: "/",
    siteName: "Wajahat Naqvi",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/social-card.png",
        width: 1200,
        height: 630,
        alt: "Wajahat Naqvi — Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wajahat Naqvi — Full-Stack Developer",
    description:
      "Building thoughtful digital products from interface to infrastructure.",
    images: ["/images/social-card.png"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
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
    jobTitle: profile.role,
    url: profile.url,
    image: `${profile.url}/images/wajahat-naqvi.webp`,
    sameAs: [profile.github, profile.linkedin],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lahore",
      addressCountry: "PK",
    },
    knowsAbout: [
      "React",
      "JavaScript",
      "Laravel",
      "APIs",
      "Shopify",
      "Web development",
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
