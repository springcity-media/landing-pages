# Landing Pages

The public landing-page application for Spring City Media campaigns. It uses Next.js, TypeScript, Tailwind CSS, and the App Router.

## Prerequisites

- Node.js 24.18.0 (see `.nvmrc`)
- npm 11.4.2 or any newer npm 11 release
- Java 21 or newer (required by the Firestore Emulator)

With [`nvm`](https://github.com/nvm-sh/nvm) installed, run `nvm install && nvm use` from the project root.

## Local development

```bash
npm ci
cp .env.example .env.local
npm run dev:emulators
```

In a second terminal, seed the emulator and start Next.js:

```bash
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run seed:firestore
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the starter page and
[http://localhost:3000/sample-event](http://localhost:3000/sample-event) for
the seeded Firestore-backed route. Changes in `src/` reload automatically. The
checked-in demo identifiers in `.env.example` are deliberately safe for local
emulator use, so no Firebase account or production credentials are needed.

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

For a repeatable emulator smoke test that starts Firestore, seeds it, and reads
the published record through the same Firebase client SDK query used by the
application, run:

```bash
npm run verify:firestore
```

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
npm run lint         # ESLint (warnings fail the check)
npm run format:check # Verify Prettier formatting
npm run type-check   # TypeScript without emitting files
npm test             # Starter-route and configuration tests
npm run test:rules   # Firestore rule tests (starts an emulator)
npm run verify:firestore # Seed and read the local sample through the client SDK
npm run build        # Optimized production build
npm run verify:build-output # Confirm the expected Hosting/App Hosting artifact
npm run quality      # Run the complete local quality gate above
```

Run `npm run format` to fix formatting failures, then rerun
`npm run format:check`. If type checking or tests appear to use stale generated
Next.js files, remove `.next` and run the failed command again. Firestore rule
tests require Java 21 or newer; confirm `java -version` reports a compatible
version and port 8080 is available if the emulator does not start. Build
failures that name a `NEXT_PUBLIC_*` variable
mean `.env.local` is missing or incomplete; recopy `.env.example` and replace
all placeholders.

The pull-request workflow in `.github/workflows/quality.yml` installs the locked
dependencies and runs every required check independently. A failure in linting,
formatting, type checking, either test suite, or the production build blocks the
workflow.

Deploy the version-controlled rules and indexes with
`npx firebase deploy --only firestore --project <alias>`.

## Firebase App Hosting production

The `freeh2o-landing-pages` production backend deploys through Firebase App
Hosting. Production and local builds generate Next.js's standalone server bundle
for the App Hosting adapter. Automatic production rollouts are triggered by the
backend's configured live branch and can be monitored in the Firebase console.

The build output is selected through `NEXT_PUBLIC_APP_ENV`: `preview` produces
the static `out/` directory used below, while `local` and `production` produce
`.next/standalone`. Keep production secrets in App Hosting environment variables
or Secret Manager; never commit service-account keys or private credentials.

## Firebase Hosting preview verification

Next.js statically exports the application to `out/`, which is the public
directory configured in `firebase.json`. The `sample-event` route is generated
at build time. Firebase Hosting rewrites any other unmatched, single-segment
campaign URL to the exported `/campaign` shell, which reads the requested slug
from the browser URL and loads its content from Firestore.

To deploy and smoke-test an isolated preview, create `.env.local` with the
preview project's Firebase Web app values and `NEXT_PUBLIC_APP_ENV=preview`,
authenticate the Firebase CLI, and run:

```bash
npm run quality
npx firebase hosting:channel:deploy spm-10 --project preview --expires 7d
```

Open both the preview URL and `<preview-url>/sample-event` directly. Confirm the
second URL displays **Sample Community Event** after equivalent seed data has
been created in the preview project's Firestore database. Browser developer
tools should show Firestore requests for the preview project ID, never the
production project. Preview channels isolate Hosting assets, but use the
selected project's normal Firestore database; they do not create a temporary
database.

Alternatively, configure the `preview` GitHub environment with
`FIREBASE_SERVICE_ACCOUNT` and the five `NEXT_PUBLIC_FIREBASE_*` secrets used by
`.github/workflows/preview.yml`, then run **Firebase Hosting Preview** manually.
The service account must have permission to deploy Hosting preview channels in
`freeh2o-landing-pages-preview`. The workflow runs the complete quality gate
before deploying the `spm-10` channel.

### Project selection

Firebase aliases make the deployment target explicit; there is deliberately no
`default` alias:

```bash
npx firebase use development # local integration work
npx firebase use preview     # test/preview deployments
npx firebase use production  # live deployments
```

For CI, pass the alias on every command instead of persisting local selection.
Preview and production builds must set all variables shown in `.env.example`,
with real Firebase Web app identifiers and `NEXT_PUBLIC_APP_ENV` set to
`preview` or `production` respectively.

### Known external prerequisites

A preview deployment cannot be completed from a clean checkout alone: Firebase
CLI authentication, a provisioned preview project, its Web app values, and
seeded preview data are external prerequisites. The placeholder preview project
ID in `.firebaserc` must be replaced if the project is provisioned under another
ID. Local development and all automated checks require none of those cloud
credentials.

## Project structure

```text
src/
├── app/          # App Router layouts, routes, and global styles
├── components/   # Shared UI components
├── config/       # Typed application configuration
└── server/       # Server-only helpers and integrations
```

Keep secrets in `.env.local`, which is ignored by Git. Add safe, documented placeholders to `.env.example` when configuration is introduced.
