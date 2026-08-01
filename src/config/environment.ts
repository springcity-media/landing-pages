export const applicationEnvironments = [
  "local",
  "preview",
  "production",
] as const;

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

type EnvironmentVariables = Record<string, string | undefined>;

function readRawConfig(environment: EnvironmentVariables) {
  return {
    environment: environment.NEXT_PUBLIC_APP_ENV,
    apiKey: environment.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: environment.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: environment.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: environment.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: environment.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: environment.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

type RawConfig = ReturnType<typeof readRawConfig>;

const variableNames: Record<keyof RawConfig, string> = {
  environment: "NEXT_PUBLIC_APP_ENV",
  apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  storageBucket: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
};

export function getEnvironmentConfig(
  environment: EnvironmentVariables = process.env,
): FirebaseEnvironmentConfig {
  const rawConfig = readRawConfig(environment);
  const missing = Object.entries(rawConfig)
    .filter(([, value]) => !value?.trim())
    .map(([key]) => variableNames[key as keyof RawConfig]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment configuration: ${missing.join(", ")}. ` +
        "Copy .env.example to .env.local and replace every placeholder value.",
    );
  }

  if (
    !applicationEnvironments.includes(
      rawConfig.environment as ApplicationEnvironment,
    )
  ) {
    throw new Error(
      `Invalid NEXT_PUBLIC_APP_ENV value "${rawConfig.environment}". ` +
        `Expected one of: ${applicationEnvironments.join(", ")}.`,
    );
  }

  return rawConfig as FirebaseEnvironmentConfig;
}
