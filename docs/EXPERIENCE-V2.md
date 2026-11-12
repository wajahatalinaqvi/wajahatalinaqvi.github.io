# Portfolio experience V2

An incremental interaction upgrade of the existing dark editorial portfolio, implemented on `redesign/premium-portfolio`. The original project content, approved photograph, employment history, dates, social links, case-study routes, static export settings, and mint palette are preserved. Production has not been deployed or modified.

## Audit

The starting application used Next.js 16.4.6, React 19.3.1, Tailwind 4.3.5, TypeScript 5.9.3, GSAP 3.15.1, and `@gsap/react` 2.1.2. The branch was clean before V2 work. No additional packages were needed.

GSAP was initialized in a client component with scoped cleanup. There was no evidence of a hydration fault or globally disabled ScrollTriggers. The experience felt static because most entrances used only 22px of movement without an opacity or mask transition. The same entrance was applied across sections. Project image scaling was slight, CSS hover transforms shared targets with animation transforms, and project filtering remounted cards without initializing their own animations. The skills section had a small text-chip list and a decorative diagram rather than individual capabilities or project evidence.

The V2 implementation gives components their own animation lifecycle, removes 535 lines of obsolete scene/accordion styles, and separates reveal, scroll, and pointer transforms into nested wrappers. Shared helpers use scoped contexts, `useGSAP`, responsive matchMedia conditions, and event cleanup.

## Implemented interactions

### Hero and navigation

- Navigation enters subtly. A thin reading-progress indicator follows native scroll.
- Section observation and progress measurements reattach on route changes; category changes refresh downstream scroll measurements once after layout settles.
- Hero eyebrow, masked headline lines, accent punctuation, description, actions, social links, and architecture scene enter in a deliberate sequence lasting approximately 1.3 seconds.
- The architectural scene contains four real buttons: Frontend, APIs, Backend, and Commerce. Hover, keyboard focus, or tap changes the active layer and its explanation.
- SVG connector paths draw on entry. The scene scales toward 92% and moves upward with scroll on desktop; frontend/backend components settle toward their connected positions. Mobile uses a compact composition with a much smaller scroll transform.
- The central layered object uses CSS perspective and SVG. Three.js, React Three Fiber, and WebGL are unnecessary for this visual. There is no model download, continuous rendering loop, or WebGL dependency.

### Technology explorer

The new section uses the requested headline, “The tools behind the work.” Four categories expose six individual technologies each. Every card explains a concrete capability and identifies its context: project work, profile capability, this portfolio, or engineering workflow.

- Frontend: React.js, JavaScript, TypeScript, HTML, CSS, Next.js.
- Backend: PHP, Laravel, REST APIs, GraphQL, Authentication, Webhooks.
- Commerce: Shopify, Liquid, Shopify Apps, Polaris, Theme App Extensions, Shopify APIs.
- Workflow: Git, GitHub, VS Code, Codex, AI-assisted engineering, Debugging and testing.

The tabs use selected state, associated panels, roving tab focus, arrow keys, Home/End, mouse, and touch. Orientation updates with the layout. The active indicator moves on desktop; mobile presents compact tabs without horizontal scrolling. Category changes animate the new cards immediately without waiting for an exit sequence. Rapid changes revert the previous context before creating new animations.

The small architecture diagram is interactive and selects the corresponding category. Explanations, code labels, technologies, and related existing projects update together. Backend capabilities are explicitly distinguished from publicly documented project evidence. Next.js and Codex are contextualized through this portfolio. No expertise percentages, proficiency scores, or invented production outcomes were added. With JavaScript disabled, the other categories remain available as readable fallback content.

### Projects, About, and career

- Project images reveal through a transform-based shutter and gently settle from 1.06 scale. Titles and supporting details enter separately.
- Natural desktop scrolling drives a small image offset and focus border. There is no pinning or artificial scroll distance.
- Fine-pointer hover applies a maximum 2.2-degree tilt, an accent outline, and a “View project” cue. Pointer input is capped to one update per frame and uses reusable GSAP quickTo tweens.
- Each project card owns its scoped animations. Filtering cleans up removed cards, initializes replacements, and refreshes measurements once for the changed layout.
- The photograph has a vertical shutter reveal and subtle desktop parallax on a separate image transform. Heading, paragraphs, caption, and professional details enter in sequence.
- The career line follows scroll progress in both directions. Milestones activate as the visitor reaches them. The current role has visual emphasis; no dates, employers, or responsibilities were changed.

### Typography and microinteractions

Geist Sans and Geist Mono remain locally bundled. No additional fonts or weights were added. Major headings use stronger fluid sizing, balanced wrapping, and controlled line heights. Body copy increases to 16–17px, with 18–22px lead copy and more readable labels, project metadata, and technology cards. The two-line hero composition remains intact at small sizes.

Buttons have small desktop magnetic movement; their hit areas stay usable. Links get directional icon and underline feedback. Contact inputs have clear focus states. Validation now shows associated inline errors, identifies invalid fields, and moves focus to the first invalid control. The sending, success, and recoverable failure states remain. Without JavaScript, the native form and native validation still work.

## Motion architecture

`src/lib/motion.ts` centralizes GSAP registration, desktop/tablet/mobile/reduced-motion conditions, and pointer handling. Each `useGSAP` scope reverts its matchMedia context on unmount or dependency changes. Listeners and pending pointer frames are removed. There is no React state update on every scroll event, no wheel/touch interception, and no scroll hijacking.

Transform and opacity carry the motion. The image shutter is an overlay scaled on its own wrapper, avoiding layout animation. The architecture paths animate stroke offset only during their short entrance. Reduced motion removes spatial animation and keeps content fully readable. Reveals remain visible in their final state after completion. CSS and HTML keep content visible when JavaScript is unavailable.

## Files changed

New components and helpers:

- `src/components/animations/HeroMotion.tsx`
- `src/components/animations/ProjectMotion.tsx`
- `src/components/visuals/StackDiagram.tsx`
- `src/lib/motion.ts`
- `src/app/experience.css`
- `scripts/motion-qa.mjs`

Updated application files:

- `src/components/animations/PageMotion.tsx`
- `src/components/visuals/SystemVisual.tsx`
- `src/components/layout/Header.tsx`
- `src/components/sections/Hero.tsx`
- `src/components/sections/FeaturedProjects.tsx`
- `src/components/sections/Expertise.tsx`
- `src/components/sections/About.tsx`
- `src/components/sections/Experience.tsx`
- `src/components/sections/Contact.tsx`
- `src/components/ui/Button.tsx`
- `src/components/ui/ProjectCard.tsx`
- `src/content/skills.ts`
- `src/app/globals.css`
- `src/app/layout.tsx`

Tooling and documentation:

- `package.json`: adds `test:motion`; dependency versions are unchanged.
- `scripts/browser-qa.mjs`: adds tab and inline-validation checks; explicitly loads lazy images before full-page captures.
- `.github/workflows/deploy.yml`: runs the motion checks before deployment eligibility.
- `README.md`, `docs/QA.md`, `docs/FILES.md`, and this record.

## Verification

Run against the production static export, with Edge/Chromium automation on Windows:

```sh
npm run validate
npm run build
npm test
npm run test:browser
npm run test:motion
npm run test:lighthouse
```

The static export generates `out/index.html` and all eight project routes. Automated browser checks cover 320, 375, 390, 768, 1024, 1440, and 1920px with no horizontal overflow. Form responses are mocked and never send real messages. Direct route refresh and client navigation are checked against a static server.

Motion tests observe actual style mutations and computed transforms rather than inferring animation from the presence of GSAP imports. They check masked entry, connector drawing, hero scale progression, project tilt, replacement cards after filtering, portrait reveal/parallax, timeline progression and reverse scrolling, rapid category changes, viewport resizing, reduced motion, and native touch gestures. A 6x CPU throttle simulates slower execution. WebGL is disabled in the touch context; the visual and controls still work. No page pinning is used.

The latest local Lighthouse mobile simulation measured:

| Page                         | Performance | Accessibility | Best practices | SEO |
| ---------------------------- | ----------- | ------------- | -------------- | --- |
| Homepage                     | 98          | 100           | 100            | 100 |
| Rocket Label Lock case study | 100         | 100           | 100            | 100 |

Homepage LCP was 1.4 seconds, CLS 0.001, and total blocking time 100ms. These are local laboratory observations, not guarantees for live devices or hosting.

Reports and screenshots are in ignored `test-results/`, including `browser-report.json`, `motion-report.json`, V2 hero/skills/home screenshots, and Lighthouse JSON/HTML reports. Automated accessibility checks reported no violations in the tested desktop, mobile, skills, invalid-form, and case-study states. There were no unexpected console errors or failed local resource requests in the browser suite.

## Limits and release boundary

Real iOS/Safari devices and real screen-reader testing were not available in this run. Touch input, reduced motion, CPU throttling, and WebGL unavailability were simulated in Chromium; they do not replace testing physical slow devices or assistive technology.

Live Formspree account status and inbox delivery still require a consented live submission. Existing case-study architecture/outcome verification notes remain unchanged. This work does not invent missing facts. The existing résumé PDF is preserved and may need a separate content update.

The original root HTML/assets, project data, employment dates, Next.js static export configuration, and production branch remain unchanged. No push, merge, Pages setting change, or deployment was performed. Deployment still requires approval.
