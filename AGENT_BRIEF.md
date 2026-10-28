# Page agent brief

You build ONE page of the CognitiveBotics replica. Read this fully before you start.

## You own
Page agents may write ONLY these paths:
- `app/<route>/**`
- `components/pages/<slug>/**`
- `tests/e2e/<slug>.spec.ts`
- `notes/<slug>.md`

The contact-us agent additionally owns `lib/contact-form.ts`, `tests/unit/contact-form.test.ts` and `tests/unit/contact-select.test.tsx`.

Your dispatch gives you a git worktree and a port. Run `npm ci` inside the worktree's `cbt-site/` before anything else; start servers only on your own port.

## Everything else is read-only
Explicitly read-only for you: `components/shared/**`, `app/layout.tsx`, `app/globals.css`, `next.config.ts`, `package.json`, `package-lock.json`, `playwright.config.ts`, `vitest.config.ts`, `tests/e2e/helpers.ts`, `tests/unit/**` (except the contact files above), `tools/**`, `reference/**`, `public/**`, `lib/**` (except `lib/contact-form.ts`), `app/kit/**`, `app/coming-soon/**`, `AGENT_BRIEF.md`, `notes/README.md`. `app/page.tsx` is owned ONLY by the home agent (the `/` route); every other agent leaves it alone.
If you need a change to a read-only file, append a request to `notes/<slug>.md` and carry on. The lead decides.

The root layout already renders Header, `<main>`, Footer and CookieBanner. Your page component returns only the page's `<section>` elements (never your own `<main>`, header or footer). `tests/e2e/helpers.ts` counts top-level `<section>`s inside the layout's single `<main>`.

## Inputs
- `reference/<slug>/{375,768,1024,1440}.png` — what the original looks like.
- `reference/<slug>/copy.json` — copy and section order captured at 1440px.
- `reference/<slug>/sections/<N>.html` — each section's original DOM.
- `reference/<slug>/meta.json` — title and description.
- `reference/<slug>/faq.json` — FAQ questions and answers (pages with a FAQ).
- `reference/interactions.json` — dropdown, FAQ, carousel and form behavior.
- `reference/image-manifest.json` — which images have a local file.

## Commands
```bash
node tools/scaffold-page.mjs <slug> && npx prettier --write components/pages/<slug>
node tools/copy-to-ts.mjs <slug>          # writes components/pages/<slug>/content.ts (sections + faq)
node tools/describe.mjs <slug>            # section index, height, first heading
PORT=<your port> npm run e2e -- tests/e2e/<slug>.spec.ts   # builds, serves and tears down its own server
npm run lint && npx tsc --noEmit
```

## Running `verify` (needs a LIVE server)
`npm run verify` does not start anything; it needs a running server on your port.
```bash
npm run build && (npm run start -- -p <your port> > /tmp/<slug>-server.log 2>&1 & echo $! > /tmp/<slug>-server.pid)
sleep 5
BASE=http://localhost:<your port> npm run verify -- <route>
```
- `next start` serves the build it started with. After EVERY code change: `kill $(cat /tmp/<slug>-server.pid)`, `npm run build`, start again, then re-run `verify`. Otherwise you are verifying stale code.
- When done, stop the server: `kill $(cat /tmp/<slug>-server.pid)` and confirm with `lsof -i :<your port>` (no output means it is gone).
- Never use port 3100 (the lead's default) and never leave `PORT` or `BASE` unset: `reuseExistingServer` in `playwright.config.ts` would silently reuse another process's server and test the wrong code.
- If the reference PNG is wider than the nominal width (the original overflowed), `verify` prints a `note:` line and compares the common width; that is not a failure by itself.

## Shared components you may use
- `Button({ href, children, size?: 'lg'|'md'|'nav', variant?: 'solid'|'outline', arrow?, external?, className? })`
- `FAQ({ items: readonly {q:string; a:string}[] })`
- `Placeholder({ label, ratio?, className? })`
- `Eyebrow({ children, tone?: 'purple'|'teal', className? })`
- `Section({ children, id?, bg?, contained?, hero?, className? })`

## Rules
1. Keep the scaffolded section `className` strings verbatim; they carry the exact spacing and typography. Replace markup with a shared component only when the rendered result is identical (for example the FAQ list, repeated `btn` anchors).
2. Never hardcode a color outside the tokens in `app/globals.css` unless the scaffold already did (some off-white section backgrounds are arbitrary values; keep them).
3. Images: leave `Image`/`Placeholder` exactly as scaffolded.
4. Interactive behavior (FAQ, carousel, forms, anchors) must work; read `reference/interactions.json`.
5. `page.tsx` exports `metadata` with the title and description from `meta.json`.
6. Done means: `PORT=<your port> npm run e2e -- tests/e2e/<slug>.spec.ts` passes, `npm run lint` and `npx tsc --noEmit` are clean, and `BASE=http://localhost:<your port> npm run verify -- <route>` passes against a freshly rebuilt server. List every remaining differing band from the verify output in your final message.
7. If a section cannot be matched, record it in `notes/<slug>.md` instead of improvising.
