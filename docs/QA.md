# Verification record

Verified locally on November 12, 2026 using Node 22.23.2 on Windows, against the production static export. Browser automation used installed Microsoft Edge (Chromium). Lighthouse used headless Google Chrome with its default mobile simulation.

## Results

| Check                      | Result                                                                                                    |
| -------------------------- | --------------------------------------------------------------------------------------------------------- |
| TypeScript strict check    | Pass                                                                                                      |
| Next.js ESLint checks      | Pass                                                                                                      |
| Production static build    | Pass; `out/index.html` generated                                                                          |
| Project static routes      | All eight generated and opened directly                                                                   |
| Client routing             | Project card and next-project navigation pass                                                             |
| Export integrity           | 12 HTML files checked; local links/assets, titles, descriptions, canonicals, sitemap and `.nojekyll` pass |
| Responsive overflow        | None at 320, 375, 390, 768, 1024, 1440, and 1920px                                                        |
| Keyboard                   | Skip link; mobile menu Escape and trigger focus restoration; navigation activation pass                   |
| Interaction                | Project filters, expandable archive, and expertise accordion pass                                         |
| Contact                    | Mocked success and failure pass; no real messages sent                                                    |
| Reduced motion             | Native instant scrolling and readable static content pass                                                 |
| JavaScript disabled        | Essential headline, project content, and links remain visible                                             |
| Automated accessibility    | Zero axe violations across desktop expanded content, mobile open menu, and representative case study      |
| Console/resource checks    | Zero unexpected console errors and zero failed resource requests                                          |
| Dependency audit           | Zero vulnerabilities following compatible updates and scoped matcher override                             |
| Original production source | Root `index.html` and `assets/` unchanged from `main`                                                     |
| Deployment                 | Prepared only; no remote workflow, Pages setting change, push, merge, or deployment performed             |

## Lighthouse

The final measured local mobile run:

| Page                         | Performance | Accessibility | Best practices | SEO |
| ---------------------------- | ----------- | ------------- | -------------- | --- |
| Homepage                     | 99          | 100           | 100            | 100 |
| Rocket Label Lock case study | 100         | 100           | 100            | 100 |

These are laboratory observations, not promises about real-user performance. Hosting, browser, device, network, extensions, and future content changes can affect scores. Local servers do not reproduce GitHub Pages caching behavior.

## Evidence and reproduction

Run `npm run validate`, `npm run build`, `npm test`, `npm run test:browser`, and `npm run test:lighthouse`. See the README for browser installation or Windows channel selection.

Ignored local evidence:

- `test-results/browser-report.json`
- `test-results/home-desktop.png`
- `test-results/home-mobile.png`
- `test-results/case-study.png`
- `test-results/lighthouse-home.html` and `.json`
- `test-results/lighthouse-case-study.html` and `.json`

The browser test intercepts the Formspree endpoint. The intentionally mocked 422 response is excluded from unexpected console/resource errors; all local route and asset failures still fail the test. It does not assert actual inbox delivery.

## Release checks requiring the live environment

- Verify Formspree account activation, origin configuration, quotas, and actual delivery through a consented live submission.
- Review the unchanged PDF résumé for the newly confirmed employment details.
- Complete marked case-study details only with supporting information. Keep unverified results unclaimed.
- Review in Safari/iOS and Firefox, and with a real screen reader such as NVDA or VoiceOver. Automated axe and keyboard checks are not a full WCAG conformance certification.
- Confirm GitHub Actions and Pages environment settings in the remote repository after deployment approval. The workflow has been reviewed locally but has not run remotely.
- Smoke-test direct case-study URLs, fonts, images, social metadata, email links, and résumé on the live domain after the approved release.

## Fixed during QA

Next.js on Windows generated nested route payload filenames while its client requested dot-separated names. Reproduced 404s were corrected by the documented post-build normalization step. Subsequent browser runs, including client routing, report zero failed requests. A native static server is used for verification so these errors cannot be masked by the development server.
