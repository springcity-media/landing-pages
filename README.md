# Landing Pages

The public landing-page application for Spring City Media campaigns. It uses Next.js, TypeScript, Tailwind CSS, and the App Router.

## Prerequisites

- Node.js 24.18.0 (see `.nvmrc`)
- npm 11.4.2

With [`nvm`](https://github.com/nvm-sh/nvm) installed, run `nvm install && nvm use` from the project root.

## Local development

```bash
npm install
cp .env.example .env.local
# Replace every placeholder in .env.local with the development Firebase Web app values.
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Changes in `src/` reload automatically.

### Local Firestore

Local mode always connects the browser SDK to the Firestore Emulator at
`127.0.0.1:8080`; it cannot silently fall back to production Firestore. Start
`npm run dev:emulators` in one terminal. In another terminal, run:

```bash
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run seed:firestore
npm run dev
```

The Emulator UI is at [http://127.0.0.1:4000](http://127.0.0.1:4000). The seed
command refuses to run unless `FIRESTORE_EMULATOR_HOST` is set. The typed,
read-only content boundary is `FirestoreContentRepository` in
`src/data/firestore.ts`.

Configuration is validated when Next.js starts. A missing value or an invalid
`NEXT_PUBLIC_APP_ENV` (`local`, `preview`, or `production`) stops startup with a
message naming the value that must be fixed. The typed configuration lives in
`src/config/environment.ts`; Firebase is initialized once through
`getFirebaseApp()` in `src/config/firebase.ts`.

The `NEXT_PUBLIC_FIREBASE_*` values are Firebase Web SDK identifiers and are
necessarily delivered to the browser. Restrict the API key in Google Cloud and
enforce access through Firebase Security Rules. Values without the
`NEXT_PUBLIC_` prefix, service-account JSON, private keys, and other server-side
credentials are secrets: store them in Firebase App Hosting environment
variables or Secret Manager, never in `.env.example` or Git.

## Checks and production

```bash
npm run lint       # ESLint
npm run type-check # TypeScript without emitting files
npm run build      # Optimized production build
npm run test:rules # Firestore rule tests (starts an emulator)
```

Deploy the version-controlled rules and indexes with
`npx firebase deploy --only firestore --project <alias>`.

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

### Project selection

Firebase aliases make the deployment target explicit; there is deliberately no
`default` alias. Select the matching project for interactive CLI work:

```bash
npx firebase use development # local integration work
npx firebase use preview     # test/preview rollouts
npx firebase use production  # live rollouts
```

For CI, avoid persisted local selection and pass the alias on every command,
for example `npx firebase deploy --project preview` or
`npx firebase deploy --project production`. Preview and production builds must
set all variables shown in `.env.example`, with `NEXT_PUBLIC_APP_ENV` set to
`preview` or `production` respectively. Before the first non-production
deployment, create the development and preview Firebase projects (or replace
their IDs in `.firebaserc` with the provisioned project IDs).

## Project structure

```text
src/
├── app/          # App Router layouts, routes, and global styles
├── components/   # Shared UI components
├── config/       # Typed application configuration
└── server/       # Server-only helpers and integrations
```

Keep secrets in `.env.local`, which is ignored by Git. Add safe, documented placeholders to `.env.example` when configuration is introduced.
