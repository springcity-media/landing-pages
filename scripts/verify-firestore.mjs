import assert from "node:assert/strict";
import { initializeApp } from "firebase/app";
import {
  collection,
  connectFirestoreEmulator,
  getDocs,
  getFirestore,
  limit,
  query,
  terminate,
  where,
} from "firebase/firestore";

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  throw new Error("FIRESTORE_EMULATOR_HOST must be set by the emulator.");
}

const app = initializeApp({ projectId: "demo-landing-pages" });
const database = getFirestore(app);
const [host, port] = process.env.FIRESTORE_EMULATOR_HOST.split(":");
connectFirestoreEmulator(database, host, Number(port));

const snapshot = await getDocs(
  query(
    collection(database, "landingPages"),
    where("slug", "==", "sample-event"),
    where("status", "==", "published"),
    limit(1),
  ),
);
const page = snapshot.docs[0]?.data();

assert.equal(page?.title, "Sample Community Event");
assert.equal(
  page?.description,
  "A local Firestore Emulator landing page used for development.",
);
console.log(
  "Verified the seeded sample-event landing page through the client SDK.",
);
await terminate(database);
