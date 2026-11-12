export interface Project {
  slug: string;
  name: string;
  category: "Applications" | "Storefronts";
  type: string;
  summary: string;
  contribution: string;
  stack: string[];
  image: string;
  alt: string;
  url: string;
  tone: string;
  problem: string;
}

// Evidence: the original public index.html and its existing project assets.
// Detailed architecture and outcomes remain unverified; do not infer them here.
export const projects: Project[] = [
  {
    slug: "rocket-label-lock",
    name: "Rocket Label Lock",
    category: "Applications",
    type: "Embedded commerce application",
    summary:
      "A focused interface for controlling access to Shopify storefront content.",
    contribution:
      "React interface development for a Shopify embedded content-locking application.",
    stack: ["React", "TypeScript", "Polaris", "Redux"],
    image: "/projects/rocket-label-lock.webp",
    alt: "Rocket Label Lock project preview from the original portfolio",
    url: "https://apps.shopify.com/app-lock-smith",
    tone: "sage",
    problem:
      "Help merchants manage storefront content access from an embedded application.",
  },
  {
    slug: "djordan-media",
    name: "Djordan Media",
    category: "Storefronts",
    type: "Custom storefront development",
    summary:
      "A tailored Shopify experience, translating a visual direction into a responsive storefront.",
    contribution:
      "Custom Shopify development using Liquid and CSS, with a Figma-led design workflow.",
    stack: ["Shopify", "Liquid", "CSS", "Figma"],
    image: "/projects/djordan-media.webp",
    alt: "Djordan Media website screenshot preserved from the original portfolio",
    url: "https://djordanmedia.com/",
    tone: "lilac",
    problem:
      "Translate a custom visual design into a usable Shopify storefront.",
  },
  {
    slug: "bundle-builder",
    name: "Bundle Builder",
    category: "Applications",
    type: "Embedded commerce application",
    summary:
      "A Shopify application bringing bundle-building workflows into the merchant experience.",
    contribution:
      "Frontend development for an embedded application with React, Polaris, and Redux.",
    stack: ["React", "Polaris", "Redux"],
    image: "/projects/bundle-builder.webp",
    alt: "Bundle Builder application preview from the original portfolio",
    url: "https://swishtag.com/project/Bundle-builder/",
    tone: "sand",
    problem:
      "Make product-bundle management available inside an embedded Shopify application.",
  },
  {
    slug: "formatica",
    name: "Formatica",
    category: "Applications",
    type: "Non-embedded commerce application",
    summary:
      "A standalone application experience connected to the Shopify ecosystem.",
    contribution: "React interface work on a non-embedded Shopify application.",
    stack: ["React", "Shopify", "Node.js"],
    image: "/projects/formatica.webp",
    alt: "Formatica project screenshot from the existing portfolio",
    url: "https://swishtag.com/project/formeteca/",
    tone: "blue",
    problem:
      "Provide a dedicated application interface outside the Shopify admin.",
  },
  {
    slug: "efendina",
    name: "Efendina",
    category: "Storefronts",
    type: "Shopify theme customization",
    summary: "Custom theme work for an online store, using Liquid and CSS.",
    contribution: "Shopify storefront customization with Liquid and CSS.",
    stack: ["Shopify", "Liquid", "CSS"],
    image: "/projects/efendina.webp",
    alt: "Efendina storefront screenshot from the existing portfolio",
    url: "https://efendina.com/en-gl",
    tone: "sand",
    problem:
      "Adapt a Shopify theme to the storefront’s specific presentation needs.",
  },
  {
    slug: "legacy-gallery",
    name: "Legacy Gallery",
    category: "Storefronts",
    type: "Application and custom theme",
    summary:
      "Connected application and storefront work for a custom commerce experience.",
    contribution:
      "React, Polaris, and Liquid development across an application and custom theme.",
    stack: ["React", "Liquid", "Polaris"],
    image: "/projects/legacy-gallery.webp",
    alt: "Legacy Gallery project preview from the existing portfolio",
    url: "https://swishtag.com/project/legacy-gallry/",
    tone: "sage",
    problem:
      "Connect a custom theme experience with Shopify application functionality.",
  },
  {
    slug: "afterparty",
    name: "AfterParty",
    category: "Applications",
    type: "Embedded app and checkout extension",
    summary:
      "Application interface work extending into the Shopify checkout experience.",
    contribution:
      "React and Polaris interface development with checkout UI extension work.",
    stack: ["React", "Polaris", "Checkout UI"],
    image: "/projects/afterparty.webp",
    alt: "AfterParty application screenshot from the existing portfolio",
    url: "https://swishtag.com/project/after-party/",
    tone: "lilac",
    problem:
      "Support a commerce workflow across an embedded app and checkout extension.",
  },
  {
    slug: "shopvoice",
    name: "ShopVoice",
    category: "Applications",
    type: "Embedded commerce application",
    summary:
      "An embedded Shopify application with a consistent merchant-facing interface.",
    contribution: "React, TypeScript, and Polaris frontend development.",
    stack: ["React", "Polaris", "TypeScript"],
    image: "/projects/shopvoice.webp",
    alt: "ShopVoice application screenshot from the existing portfolio",
    url: "https://swishtag.com/project/shop-voice/",
    tone: "blue",
    problem:
      "Build a coherent application interface within Shopify’s admin environment.",
  },
];
