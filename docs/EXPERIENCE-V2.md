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

## V3 showcase layer

Built on the V2 system using GSAP 3.15's bundled SplitText and ScrambleText plus `lenis` for inertial wheel scrolling. Styles live in `src/app/showcase.css`.

- **Smooth scroll** (`SmoothScroll.tsx`): Lenis runs on the GSAP ticker for fine pointers only. Touch, keyboard and reduced-motion users get native scroll. Anchor links route through Lenis with header offset.
- **Context cursor** (`Cursor.tsx`): a trailing ring grows on links and expands into a labelled pill on `[data-cursor]` targets (project images read "View case"). Fine pointer only; the native cursor stays visible.
- **Hero**: eyebrow text decodes via ScrambleText; headline letters rise through the line masks; letters lift and flash mint under the pointer; a cursor-following spotlight sits behind; on scroll the two headline lines part horizontally and fade.
- **Headings**: every section `h2` splits into masked lines/words that rise on entry; eyebrow markers spin in.
- **Manifesto** (new section after Work): words brighten and un-blur in step with scroll, with key words in mint, and a rule draws underneath.
- **Tech marquee** (new section after About): two counter-moving rails listing every technology from `skills.ts`. Scroll velocity boosts speed, flips direction and skews the rows. Pauses offscreen; screen readers get a plain list.
- **Skills explorer**: the category code label scrambles on tab change; technology cards flip in in 3D; marks spring in; a pointer spotlight tracks across the card grid.
- **Projects**: frames open from an inset rounded clip to full bleed as they rise through the viewport.
- **Process** (desktop ≥900px): the section pins once and the five stages travel horizontally with outlined numerals parallax, a progress rail and a live 01/05 counter. Smaller screens keep a vertical reveal. This is the only pinned section.
- **Footer**: a viewport-wide "Wajahat Naqvi" signature rises letter by letter from the centre and warms toward mint over the last stretch of scroll.

QA updates: the hero entrance check accepts per-letter movement, the scroll helper jumps Lenis directly when it is active, and the pin assertion allows the one process pin. Local Lighthouse mobile simulation: home 95/100/100/100, case study 100/100/100/100.

## V4 interactive layer

Patterns drawn from a survey of current interactive developer portfolios (Awwwards portfolio honourees, command-palette and terminal portfolios). All content comes from the existing `projects.ts`, `skills.ts`, `experience.ts` and `profile.ts`; nothing new is claimed. Styles live in `src/app/interactive.css`; components in `src/components/interactive/`.

- **Command palette** (`CommandPalette.tsx`): `⌘K` / `Ctrl+K` / `/` anywhere, or the header button. Fuzzy search over sections, all eight projects (by name, type, stack) and actions: copy email, résumé, GitHub, LinkedIn. ARIA combobox + listbox, arrow keys, Enter, Esc, focus returns to the opener. Section jumps go through Lenis.
- **Stack Lab** (`StackLab.tsx`, new section after Expertise): every technology in the project data as a token with its usage count. Fine pointers can drag and throw tokens (Draggable + Inertia, bounded to the arena), drop them on the tray, scatter or reset. Tap or keyboard toggles them everywhere. Projects re-rank by overlap with a Flip animation, matching stack tags light up, a meter shows the share, and a live status line reports the result. Touch screens get tap-only so dragging never traps page scroll.
- **Terminal** (`Terminal.tsx`, new section after the process): `help`, `whoami`, `skills [category]`, `projects`, `open <project>`, `stack <tech>`, `experience`, `goto <section>`, `contact`, `email`, `resume`, `clear`, plus easter eggs (`sudo hire-me`, `coffee`, `rm`). Tab completes commands, project slugs, sections and categories; ↑/↓ walks history; Ctrl+L clears. Output is a polite live region; suggestion buttons run commands for touch users.
- **Archive previews**: hovering a row in “More from the archive” shows that project's screenshot trailing the cursor, tilting with horizontal velocity. Fine pointer only.
- **Fixes**: removed ScrollTrigger snapping from the pinned process section because it fought Lenis and pulled the page toward that section from elsewhere; renamed the global cursor flag to `data-custom-cursor` so it no longer collides with `[data-cursor]` labels.

Local Lighthouse mobile simulation, three runs: home 79 / 93 / 94 performance (variance from a late hydration task under 4× CPU throttle), 100 accessibility, best practices and SEO each run; case study 100 across the board.

## V5 hero field and square portrait

- **Hero dot field** (`src/components/visuals/HeroField.tsx`): a full-bleed canvas grid behind the headline. Dots breathe in a slow diagonal wave, part around a mouse pointer and glow mint near it, and a click or tap on empty hero space sends a shockwave ring. The loop runs only while the hero is on screen and the tab is visible; reduced motion draws one static frame. Device pixel ratio is capped at 2.
- **Square portrait**: the source photo is a circle on white. `scripts/prepare-assets.mjs` now fills everything outside the circle with the photo's own navy backdrop (#203F5E) and crops a 1:1 head-and-shoulders square, so the frame no longer shows white corners. The About frame is 1:1, and the grayscale portrait warms to full colour on hover.

Local Lighthouse after this change: home 92/100/100/100, case study 99/100/100/100.
