# Change inventory

The original `index.html` and `assets/` are unchanged. The following files were added for the redesign.

## Configuration and deployment

- `.gitignore`
- `.prettierignore`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `next-env.d.ts`
- `next.config.ts`
- `postcss.config.mjs`
- `eslint.config.mjs`
- `.github/workflows/deploy.yml`

## Application

- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
- `src/app/not-found.tsx`
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `src/app/projects/[slug]/page.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/sections/Hero.tsx`
- `src/components/sections/FeaturedProjects.tsx`
- `src/components/sections/About.tsx`
- `src/components/sections/Expertise.tsx`
- `src/components/sections/Experience.tsx`
- `src/components/sections/Approach.tsx`
- `src/components/sections/Contact.tsx`
- `src/components/animations/PageMotion.tsx`
- `src/components/visuals/SystemVisual.tsx`
- `src/components/ui/Button.tsx`
- `src/components/ui/SectionHeading.tsx`
- `src/components/ui/ProjectCard.tsx`
- `src/content/profile.ts`
- `src/content/projects.ts`
- `src/content/experience.ts`
- `src/content/skills.ts`

## Static assets

- `public/.nojekyll`
- `public/icon.svg`
- `public/images/wajahat-naqvi.webp`
- `public/images/social-card.png`
- `public/resume/Wajahat-Naqvi.pdf`
- `public/projects/rocket-label-lock.webp`
- `public/projects/djordan-media.webp`
- `public/projects/bundle-builder.webp`
- `public/projects/formatica.webp`
- `public/projects/efendina.webp`
- `public/projects/legacy-gallery.webp`
- `public/projects/afterparty.webp`
- `public/projects/shopvoice.webp`

## Tooling and handoff

- `scripts/prepare-assets.mjs`
- `scripts/normalize-export.mjs`
- `scripts/serve.mjs`
- `scripts/check-export.mjs`
- `scripts/browser-qa.mjs`
- `scripts/lighthouse-qa.mjs`
- `README.md`
- `docs/AUDIT.md`
- `docs/QA.md`
- `docs/FILES.md`

Generated build output (`.next/`, `out/`), dependency installations (`node_modules/`), and local QA reports (`test-results/`) are ignored.
