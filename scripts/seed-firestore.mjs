import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  throw new Error(
    "Refusing to seed without FIRESTORE_EMULATOR_HOST. Start the local Firestore Emulator first.",
  );
}

const projectId = process.env.GCLOUD_PROJECT ?? "demo-landing-pages";
const app = initializeApp({ projectId });
const database = getFirestore(app);

const records = [
  [
    "events/sample-event",
    {
      name: "Sample Community Event",
      slug: "sample-event",
      status: "published",
    },
  ],
  [
    "landingPages/sample-event",
    {
      eventId: "sample-event",
      slug: "sample-event",
      status: "published",
      title: "Sample Community Event",
      description:
        "A local Firestore Emulator landing page used for development.",
    },
  ],
  [
    "sponsors/sample-water",
    {
      eventId: "sample-event",
      name: "Sample Water Co.",
      websiteUrl: "https://example.com",
      logoUrl: "https://placehold.co/240x120?text=Sample+Sponsor",
      status: "published",
      sortOrder: 10,
    },
  ],
];

const batch = database.batch();
for (const [path, data] of records) batch.set(database.doc(path), data);
await batch.commit();
console.log(
  `Seeded ${records.length} records into ${projectId} at ${process.env.FIRESTORE_EMULATOR_HOST}.`,
);
