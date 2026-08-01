import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getEnvironmentConfig } from "@/config/environment";

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
