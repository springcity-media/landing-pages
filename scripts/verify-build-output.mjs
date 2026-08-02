import { access } from "node:fs/promises";

const staticExport = process.env.FIREBASE_STATIC_EXPORT === "true";
const expectedArtifact = staticExport
  ? "out/campaign.html"
  : ".next/standalone/.next/routes-manifest.json";

try {
  await access(expectedArtifact);
} catch {
  throw new Error(
    `Missing ${expectedArtifact}. The Next.js output mode is incompatible with ${staticExport ? "Firebase Hosting preview" : "Firebase App Hosting"}.`,
  );
}

console.log(`Verified build artifact: ${expectedArtifact}`);
