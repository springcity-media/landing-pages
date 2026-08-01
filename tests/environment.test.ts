import assert from "node:assert/strict";
import { test } from "vitest";
import { getEnvironmentConfig } from "@/config/environment";

const validEnvironment = {
  NEXT_PUBLIC_APP_ENV: "preview",
  NEXT_PUBLIC_FIREBASE_API_KEY: "api-key",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "example.firebaseapp.com",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "example",
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "example.firebasestorage.app",
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "123456",
  NEXT_PUBLIC_FIREBASE_APP_ID: "app-id",
};

test("returns typed configuration for a supported environment", () => {
  assert.deepEqual(getEnvironmentConfig(validEnvironment), {
    environment: "preview",
    apiKey: "api-key",
    authDomain: "example.firebaseapp.com",
    projectId: "example",
    storageBucket: "example.firebasestorage.app",
    messagingSenderId: "123456",
    appId: "app-id",
  });
});

test("reports missing configuration by environment variable name", () => {
  const incompleteEnvironment = {
    ...validEnvironment,
    NEXT_PUBLIC_FIREBASE_API_KEY: undefined,
  };

  assert.throws(
    () => getEnvironmentConfig(incompleteEnvironment),
    /Missing required environment configuration: NEXT_PUBLIC_FIREBASE_API_KEY/,
  );
});

test("rejects an unsupported application environment", () => {
  assert.throws(
    () =>
      getEnvironmentConfig({
        ...validEnvironment,
        NEXT_PUBLIC_APP_ENV: "staging",
      }),
    /Invalid NEXT_PUBLIC_APP_ENV value "staging"/,
  );
});
