# Landing Pages

The public landing-page application for Spring City Media campaigns. It uses Next.js, TypeScript, Tailwind CSS, and the App Router.

## Prerequisites

- Node.js 24.18.0 (see `.nvmrc`)
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
```

## Firebase App Hosting

The application is deployed to the `freeh2o-landing-pages` Firebase project
through Firebase App Hosting. Next.js produces a standalone server bundle that
the App Hosting framework adapter deploys to Cloud Run behind Cloud CDN.

Build the production application locally:

```bash
npm run build
```

Automatic rollouts are triggered by commits to the backend's configured live
branch. Rollout status, custom domains, and manual rollouts are managed from
the App Hosting section of the Firebase console.

Keep secrets in App Hosting environment variables or Secret Manager. Do not
commit service-account keys or environment files.

## Project structure

```text
src/
├── app/          # App Router layouts, routes, and global styles
├── components/   # Shared UI components
├── config/       # Typed application configuration
└── server/       # Server-only helpers and integrations
```

Keep secrets in `.env.local`, which is ignored by Git. Add safe, documented placeholders to `.env.example` when configuration is introduced.
