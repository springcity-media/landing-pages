import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from "firebase/firestore";
import { getEnvironmentConfig } from "@/config/environment";

let firestore: Firestore | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }

  const config = getEnvironmentConfig();
  return initializeApp({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
  });
}

/** Returns Firestore configured for the current environment. Local builds never contact production. */
export function getFirestoreDatabase(): Firestore {
  if (firestore) {
    return firestore;
  }

  const config = getEnvironmentConfig();
  firestore = getFirestore(getFirebaseApp());

  if (config.environment === "local") {
    connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
  }

  return firestore;
}
