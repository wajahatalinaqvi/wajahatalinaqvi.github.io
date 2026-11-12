# Audit and implementation decisions

## Original implementation

The original repository consisted of root HTML, nine linked CSS files, additional unused stylesheets, a local Three.js library plus a CDN Three.js dependency, and separate background, hero, section, cursor, navigation, scroll, and UX scripts. The audit inspected the HTML sections, project data, form handler, filtering, cursor logic, Three.js hero setup, scroll handling, animation styles, mobile overrides, and asset inventory.

The sidebar, internal article scrolling, and button-based section switching made the page harder to link and navigate. Existing semantic labels were useful, but article heading references were inconsistent and project pages did not exist. Full-stack text conflicted with the front-end page title and meta description. Swishtag still showed a current frontend role and no TPH role.

The site included a fullscreen loading overlay, multiple animation layers, cursor code in more than one script, per-pointer layout changes, hover tilts, and repeated page-entry observers. Some reduced-motion handling existed, but multiple implementations competed for the same elements. The new implementation removes these layers from the active application while keeping the legacy files intact.

## Reused evidence

- The approved portrait, PDF résumé, email, GitHub, and LinkedIn URLs.
- All eight existing projects: Rocket Label Lock, Djordan Media, Efendina, Formatica, Legacy Gallery, AfterParty, Bundle Builder, and ShopVoice.
- Original project screenshots, stack labels, descriptions of work, and external references.
- Existing Formspree action and native POST semantics.
- Australian Portal role and education records.

No new JOUBIJOUX or TPH project links/assets were added, per the owner’s follow-up instruction.

## Owner-confirmed changes

- Primary identity: **Full-Stack Developer**, with Shopify as a specialization.
- TPH: **Full-Stack & Shopify Developer**, **September 2026–present**.
- Swishtag: **Shopify App Developer**, **June 2023–August 2026**. The June 2023 start is preserved from the original; the owner confirmed the changed title/end month.
- Month-level dates are sufficient; no exact calendar dates are needed.

## Architecture

Next.js 16.4.6, React 19, TypeScript, Tailwind 4, GSAP, and Lucide. Node 22 is installed and compatible. The App Router exports HTML and route payloads to `out/`; all project paths are generated at build time. No server is required. Fonts and assets are self-hosted. Build-time image compression keeps the existing screenshots lightweight, but the low resolution of some source images cannot be restored without better originals.

The hero uses CSS perspective and SVG. This provides architectural depth and subtle pointer response without a continuous frame loop, WebGL context, Three.js/R3F/Drei dependencies, model downloads, or a separate mobile fallback. Reduced-motion visitors get a static visual. Animation uses GSAP’s React lifecycle and matchMedia with cleanup, and never takes control of scrolling.

Windows export verification revealed the upstream route-payload filename mismatch. A post-build step adds the flat filenames the browser requests. Linux exports already using the correct filenames are left alone. Browser tests exercise client navigation as well as direct HTML routes.

## Design system

Semantic colors built from the requested charcoal, slate, off-white, muted gray, and mint palette; locally bundled Geist Sans and Geist Mono; shared 4/8px spacing primitives; responsive section rhythm; editorial headings; subtle borders; restrained radius; reusable action, heading, and project patterns. The first project pair is followed by wider editorial project rows. Images carry the color, with no stock imagery, technology logo cloud, or persistent glowing backgrounds.

The installed skills consulted were ui-ux-pro-max, design-system, gpt-taste, design, ui-styling, apple-design-foundations, apple-design-interaction, apple-design-motion, vercel-react-best-practices, gsap-core, gsap-react, gsap-scrolltrigger, gsap-timeline, gsap-performance, and gsap-utils. All requested skills were available. Accessibility-testing and playwright-automation additionally informed QA. Recommendations were applied selectively under the brief; stock images, forced pinning, marquees, and unnecessary effects were not adopted. The UI skill’s first broad search returned an off-topic documentation pattern; a narrower portfolio search produced applicable scroll-storytelling guidance. Unsupported recommendations were not persisted.

## Remaining content verification

Individual case studies expose the available evidence and mark missing business briefs, exact responsibilities, implementation decisions, technical challenges/solutions, release details, outcomes, and further publication permissions. No measured improvements, client secrets, private code, project ownership, or fabricated results were added. Some existing screenshots use marketing-preview artwork rather than full-resolution application captures. Formatica’s existing asset spells the product “Formeteca”; the existing public portfolio name was retained pending owner review.

The résumé PDF remains unchanged and should be reviewed for consistency with the newly confirmed roles. Existing external URLs may change independently; a historical reference does not prove current site behavior or release ownership. TPH responsibilities beyond the confirmed title are not invented.

## Production boundary

The original root `index.html` and `assets/` remain unchanged. Production `main` was not edited, merged, or pushed. Pages settings and environment protections were not modified. The new workflow deploys only from approved `main` after merge (or manual dispatch on `main`), with optional required environment review configured by the owner before release.
