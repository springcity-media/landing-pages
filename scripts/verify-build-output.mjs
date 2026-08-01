import { access } from "node:fs/promises";

const preview = process.env.NEXT_PUBLIC_APP_ENV === "preview";
const expectedArtifact = preview
  ? "out/campaign.html"
  : ".next/standalone/.next/routes-manifest.json";

try {
  await access(expectedArtifact);
} catch {
  throw new Error(
    `Missing ${expectedArtifact}. The Next.js output mode is incompatible with ${preview ? "Firebase Hosting preview" : "Firebase App Hosting"}.`,
  );
}

console.log(`Verified build artifact: ${expectedArtifact}`);
