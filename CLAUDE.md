# CBT site

@AGENTS.md

## Git rules (must follow)

- **Never run `git push` unless the user explicitly says to push.** Committing locally is fine when asked; pushing is not. Approval to push once does not carry over to later changes.
- Do not force-push, and do not change the `origin` remote, without being asked.
- This directory (`cbt-site`) is its own git repo (branch `main`). The parent folder `/Users/samarthkumar/CBT` is a separate repo; do not push from there.
- The remote is `https://github.com/Samarth-kumar-300/cbt-website-prototype.git`. Pushes only work from VS Code's integrated terminal (it holds the user's GitHub login); a plain agent shell has no credentials.
- Commit messages end with the Co-Authored-By line given in the session's system reminder.

## What this is

A pixel-and-behaviour replica of the CognitiveBotics marketing site, built as a prototype. It deploys to Vercel; `vercel.json` only pins the framework and build commands, since Vercel detects Next.js on its own.

- Next.js 16.4.x (App Router, Turbopack), React 19.3, Tailwind v4, GSAP (`gsap`, `@gsap/react`) for motion.
- Next.js 16 differs from older versions. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next-specific code (see AGENTS.md).
- Tailwind v4 is compiled through a Turbopack loader rule in `next.config.ts`. There is no postcss config; keep that rule.
- No API routes and no environment variables. The contact form is validated client-side (`lib/contact-form.ts`).

## Commands

- `npm run dev`: dev server.
- `npm run build` / `npm run start`: production build and server.
- `npm run lint`: ESLint over `app components lib`.
- `npm test`: Vitest unit tests (`tests/unit`).
- `npm run e2e`: Playwright (`tests/e2e`); builds and serves on port 3100 (`PORT` overrides).
- `npm run capture` / `npm run verify`: reference-capture and page-comparison tools in `tools/`.

## Layout

- `app/<route>/page.tsx`: routes: `/`, `about`, `careers` (+`[slug]` job pages), `contact-us`, `parents`, `resources`, `schools`, `therapy-centres`, plus `kit` (component showcase) and `coming-soon`.
- `app/layout.tsx` renders Header, a single `<main>`, Footer and CookieBanner. Page components return only their `<section>` elements, never their own `<main>`, header or footer.
- `components/pages/<slug>/`: per-page components, `content.ts` copy, `sections/SectionN.tsx`.
- `components/shared/`: shared primitives (Button, Section, FAQ, Reveal, MotionImage, scroll components, nav config).
- `lib/stub-routes.ts`: routes not built yet (privacy, terms, blog, etc.); `next.config.ts` rewrites them to `/coming-soon`.
- `reference/<slug>/`: captured original site (screenshots at 375/768/1024/1440, `copy.json`, section HTML). Source of truth for copy and visuals.
- `tools/`: scripts for capturing, scaffolding pages, importing assets and verifying pages.
- `notes/`: per-page notes and audits. `docs/superpowers/`: specs and plans.
- `AGENT_BRIEF.md`: ownership rules for per-page agents. Read it before doing page-level work in parallel.

## Conventions

- Match the original site: copy comes from `reference/<slug>/copy.json`, and images are listed in `reference/image-manifest.json`.
- Motion is driven by the shared helpers (`Reveal`, `RevealStagger`, `TextReveal`, `MotionImage`, `image-motion.ts`); reuse them instead of adding one-off animations.
- Add or update tests with behaviour changes: unit tests for logic and components, Playwright specs for pages.
- `reference/` and `verify/` hold about 57 MB of screenshots. Don't regenerate or move them casually.
- Run `npm run build` before declaring work done; a plain retry has fixed transient failures before.
