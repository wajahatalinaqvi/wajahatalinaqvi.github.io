# Wajahat Naqvi — Full-Stack Developer

A dark, editorial portfolio built with Next.js App Router, TypeScript, Tailwind CSS, and GSAP. Fully exported to static files for the root-domain GitHub Pages user site: https://wajahatalinaqvi.github.io/.

The original `index.html` and `assets/` are preserved. The redesign is on `redesign/premium-portfolio`. Nothing has been deployed or pushed to production.

## Local development

Use Node.js 22 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:3000. On Windows with a restricted PowerShell script policy, use `npm.cmd` instead of `npm`.

## Production preview and checks

```sh
npm ci
npm run validate
npm run build
npm test
npm run preview
```

Open http://127.0.0.1:4173. The production artifact is `out/`, including `out/index.html`, all eight project directories, `404.html`, metadata, fonts, and public assets. Do not use `next start` for this static export.

```sh
npx playwright install chromium
npm run test:browser
npm run test:lighthouse
```

The browser script starts its own temporary static server. It checks responsive overflow, keyboard access, navigation, filtering, the archive, accordion, direct and client project navigation, reduced motion, content with JavaScript disabled, and axe scans. Contact responses are mocked; no real messages are sent. Screenshots and JSON/HTML reports go to ignored `test-results/`.

To use installed Microsoft Edge on Windows:

```powershell
$env:BROWSER_CHANNEL='msedge'
npm.cmd run test:browser
```

Lighthouse uses an installed Chrome. If discovery fails:

```powershell
$env:CHROME_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'
npm.cmd run test:lighthouse
```

## Architecture

- `src/app/`: static homepage, shared layout, metadata, 404, and generated project routes.
- `src/components/layout/`: responsive header and footer.
- `src/components/sections/`: independent page sections.
- `src/components/ui/`: buttons, headings, and project cards.
- `src/components/animations/`: scoped GSAP lifecycle and reduced-motion handling.
- `src/components/visuals/`: pointer-responsive CSS/SVG architectural visual.
- `src/content/`: typed projects, career timeline, skills, and profile links.
- `public/`: optimized existing project assets, portrait, résumé, sharing image, and `.nojekyll`.
- `scripts/`: asset preparation, static preview, export validation, browser QA, and Lighthouse.
- `.github/workflows/deploy.yml`: PR validation and approved production deployment.

Most sections render at build time. Client code is limited to animation and interactive controls. The hero uses CSS perspective and SVG rather than Three.js; it works without WebGL, uses no continuous rendering loop, and needs no 3D bundle. GSAP uses native scrolling, matchMedia, scoped cleanup, and transform-based motion. Essential content is visible without animation or JavaScript.

Fonts are bundled locally through `geist`; builds and visitors do not need a Google Fonts connection. Project assets are generated from the original approved portfolio assets with `node scripts/prepare-assets.mjs`. Generated assets are checked in, so normal builds do not rerun image conversion.

The image build tool uses sharp 0.35.5. A scoped `minimatch` override patches the TypeScript ESLint dependency without changing unrelated older matcher APIs. The lockfile records the resolved compatible versions.

## GitHub Pages setup and approval

1. Review the local redesign and the content notes in [docs/AUDIT.md](docs/AUDIT.md). Obtain approval before merging or deploying.
2. In repository Settings → Pages, select **GitHub Actions** as the source when ready to replace the old site.
3. In Settings → Environments → `github-pages`, configure a required reviewer if a separate deployment approval is desired. GitHub plan/repository rules determine whether required reviewers are available.
4. Push the redesign branch and open a pull request against `main`. The workflow installs via `npm ci`, validates, builds, checks the static export, runs browser QA, and uploads test evidence. Pull requests do not deploy.
5. After explicit approval, merge into `main`. The workflow uploads `out/` and deploys it using `actions/deploy-pages`, subject to environment protection. Manual dispatch only deploys when the selected branch is `main`.
6. Verify the root URL, one direct `/projects/<slug>/` URL, the résumé, social image, and a consented live contact-form submission.

There is no `basePath`: this is a user-site repository at the domain root. The workflow uses minimal job permissions and deployment concurrency protection. No API routes, server actions, request-time rendering, or server-dependent features are used.

The workflow is prepared but has not been run on GitHub. Repository settings and environment protections have not been changed. Keep the existing Pages source until deployment approval.

To roll back after a release, revert the approved redesign merge on `main` and restore the previous Pages source configuration if reverting to root-branch publishing. The original root HTML/assets are still present.

## Contact

The existing Formspree endpoint is preserved: `https://formspree.io/f/xdoqjgzv`. The form works from static hosting with a native POST fallback, browser validation, a honeypot, a request timeout, a sending state, a success state, and a recoverable error with an email fallback.

Automated tests verify both response paths without sending email. Account ownership, activation, origin settings, service quotas, spam filtering, and actual inbox delivery need a consented live test before release. No credentials are stored in this repository.

## Content maintenance

Edit the files in `src/content/`. Every existing project has a dedicated static route, generated with `generateStaticParams`. Add new projects only after confirming contribution and publication permission.

TPH and Swishtag titles and month-level dates were confirmed by the owner during the redesign. Other career and education details are preserved from the original portfolio. Existing project names, source references, and screenshots are retained; deeper architectural notes and measurable outcomes are explicitly marked for verification. The supplied PDF is preserved as-is and may need updating to match the confirmed timeline.

SEO includes canonical URLs, page-specific metadata, Open Graph/Twitter images, Person JSON-LD with actual social links, a sitemap, and robots directives. No X account has been invented.

## Troubleshooting

- **404s on local project navigation after a Windows build:** `npm run build` includes `normalize-export.mjs`, which creates expected flat route-payload filenames for [the documented Next.js Windows static export issue](https://github.com/vercel/next.js/issues/92339). It preserves the original generated files and is harmless on Linux. Do not bypass this step by running `next build` directly.
- **Unstyled pages or `_next` 404s on Pages:** ensure the workflow uploads all of `out/`, including `.nojekyll`, and serves the domain root without a repository base path.
- **Direct project URLs fail:** use the directory URL with its trailing slash and verify `out/projects/<slug>/index.html` exists.
- **Old site still appears:** verify Pages uses Actions and the approved `main` run succeeded; check the environment approval and browser cache.
- **Form errors:** verify the Formspree dashboard and allowed origins. The direct email link remains available.
- **Browser missing:** install Chromium or select a locally installed browser with `BROWSER_CHANNEL`.
- **Image conversion fontconfig messages on Windows:** the generated sharing PNG may log cache warnings in a restricted account; committed assets avoid this during normal builds.

See [docs/QA.md](docs/QA.md) for recorded verification and its limits.
