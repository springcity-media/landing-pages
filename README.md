# Landing Pages

The public landing-page application for Spring City Media campaigns. It uses Next.js, TypeScript, Tailwind CSS, and the App Router.

## Prerequisites

- Node.js 22.22.2 (see `.nvmrc`)
- npm 11.4.2

With [`nvm`](https://github.com/nvm-sh/nvm) installed, run `nvm install && nvm use` from the project root.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Changes in `src/` reload automatically.

## Checks and production

```bash
npm run lint       # ESLint
npm run type-check # TypeScript without emitting files
npm run build      # Optimized production build
npm start          # Serve an existing out/ build with the Hosting emulator
```

## Firebase Hosting

The application is exported as a static site to `out/` and deployed to the
Firebase project `freeh2o-landing-pages`. Firebase Hosting's `cleanUrls`
setting maps direct requests such as `/campaign` to an exported
`campaign.html`; Next.js also generates `404.html` for routes that do not
exist. Because this deployment has no Node.js runtime, new routes must remain
compatible with Next.js static export.

Authenticate once with `npx firebase login`, or set `GOOGLE_APPLICATION_CREDENTIALS`
to a service-account key path in CI. Do not commit service-account keys or
environment files. The Firebase web SDK values shown in the Firebase console
are client identifiers rather than deployment credentials and are not needed
to deploy Hosting.

Build and validate the site locally:

```bash
npm run build
npm run hosting:serve
```

Deploy a seven-day preview channel, then use the URL printed by the CLI to
verify direct navigation and static assets:

```bash
npm run deploy:preview
```

After the preview is approved, deploy the same build configuration to the live
Hosting site:

```bash
npm run deploy:production
```

Both deploy commands use the project alias in `.firebaserc`. A custom domain is
expected to be attached to this Hosting site through the Firebase console;
domain ownership and DNS values are intentionally not stored in this repository.

## Project structure

```text
src/
├── app/          # App Router layouts, routes, and global styles
├── components/   # Shared UI components
├── config/       # Typed application configuration
└── server/       # Server-only helpers and integrations
```

Keep secrets in `.env.local`, which is ignored by Git. Add safe, documented placeholders to `.env.example` when configuration is introduced.
