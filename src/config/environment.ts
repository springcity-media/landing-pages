export const applicationEnvironments = ["local", "preview", "production"] as const;

export type ApplicationEnvironment = (typeof applicationEnvironments)[number];

export interface FirebaseEnvironmentConfig {
  environment: ApplicationEnvironment;
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const rawConfig = {
  environment: process.env.NEXT_PUBLIC_APP_ENV,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const variableNames: Record<keyof typeof rawConfig, string> = {
  environment: "NEXT_PUBLIC_APP_ENV",
  apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  storageBucket: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
};

export function getEnvironmentConfig(): FirebaseEnvironmentConfig {
  const missing = Object.entries(rawConfig)
    .filter(([, value]) => !value?.trim())
    .map(([key]) => variableNames[key as keyof typeof rawConfig]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment configuration: ${missing.join(", ")}. ` +
        "Copy .env.example to .env.local and replace every placeholder value.",
    );
  }

  if (!applicationEnvironments.includes(rawConfig.environment as ApplicationEnvironment)) {
    throw new Error(
      `Invalid NEXT_PUBLIC_APP_ENV value "${rawConfig.environment}". ` +
        `Expected one of: ${applicationEnvironments.join(", ")}.`,
    );
  }

  return rawConfig as FirebaseEnvironmentConfig;
}
