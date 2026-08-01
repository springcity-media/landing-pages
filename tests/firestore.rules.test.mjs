import { readFile } from "node:fs/promises";
import { after, before, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";

let environment;

before(async () => {
  environment = await initializeTestEnvironment({
    projectId: "demo-landing-pages",
    firestore: { rules: await readFile("firestore.rules", "utf8") },
  });
});

beforeEach(async () => {
  await environment.clearFirestore();
  await environment.withSecurityRulesDisabled(async (context) => {
    const database = context.firestore();
    await setDoc(doc(database, "landingPages/published"), { slug: "welcome", status: "published" });
    await setDoc(doc(database, "landingPages/draft"), { slug: "secret", status: "draft" });
    await setDoc(doc(database, "private/config"), { enabled: true });
  });
});

after(async () => environment?.cleanup());

test("allows a published landing page to be read", async () => {
  const database = environment.unauthenticatedContext().firestore();
  const snapshot = await assertSucceeds(getDoc(doc(database, "landingPages/published")));
  assert.equal(snapshot.data().slug, "welcome");
});

test("denies draft and unspecified documents", async () => {
  const database = environment.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(database, "landingPages/draft")));
  await assertFails(getDoc(doc(database, "private/config")));
});

test("allows only a query constrained to published records", async () => {
  const database = environment.unauthenticatedContext().firestore();
  const published = query(collection(database, "landingPages"), where("status", "==", "published"));
  await assertSucceeds(getDocs(published));
  await assertFails(getDocs(collection(database, "landingPages")));
});

test("denies all client writes", async () => {
  const database = environment.unauthenticatedContext().firestore();
  await assertFails(setDoc(doc(database, "landingPages/new"), { status: "published" }));
});
