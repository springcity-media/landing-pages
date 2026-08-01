import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
  type DocumentData,
  type Firestore,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
} from "firebase/firestore";
import { getFirestoreDatabase } from "@/config/firebase";

export interface Event {
  id: string;
  name: string;
  slug: string;
  status: "draft" | "published";
}

export interface LandingPage {
  id: string;
  eventId: string;
  slug: string;
  status: "draft" | "published";
  title: string;
  description: string;
}

export interface Sponsor {
  id: string;
  eventId: string;
  name: string;
  websiteUrl: string;
  logoUrl: string;
  status: "draft" | "published";
  sortOrder: number;
}

function stringField(data: DocumentData, field: string): string {
  const value: unknown = data[field];
  if (typeof value !== "string") {
    throw new Error(`Invalid Firestore record: ${field} must be a string.`);
  }
  return value;
}

function statusField(data: DocumentData): "draft" | "published" {
  const status = stringField(data, "status");
  if (status !== "draft" && status !== "published") {
    throw new Error("Invalid Firestore record: unsupported status.");
  }
  return status;
}

function readOnlyConverter<T>(
  read: (id: string, data: DocumentData) => T,
): FirestoreDataConverter<T> {
  return {
    toFirestore: () => {
      throw new Error("Public data access is read-only.");
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions,
    ): T {
      return read(snapshot.id, snapshot.data(options));
    },
  };
}

const eventConverter = readOnlyConverter<Event>((id, data) => ({
  id,
  name: stringField(data, "name"),
  slug: stringField(data, "slug"),
  status: statusField(data),
}));

const landingPageConverter = readOnlyConverter<LandingPage>((id, data) => ({
  id,
  eventId: stringField(data, "eventId"),
  slug: stringField(data, "slug"),
  status: statusField(data),
  title: stringField(data, "title"),
  description: stringField(data, "description"),
}));

const sponsorConverter = readOnlyConverter<Sponsor>((id, data) => ({
  id,
  eventId: stringField(data, "eventId"),
  name: stringField(data, "name"),
  websiteUrl: stringField(data, "websiteUrl"),
  logoUrl: stringField(data, "logoUrl"),
  status: statusField(data),
  sortOrder: (() => {
    const value: unknown = data.sortOrder;
    if (typeof value !== "number")
      throw new Error("Invalid Firestore record: sortOrder must be a number.");
    return value;
  })(),
}));

export class FirestoreContentRepository {
  constructor(private readonly database: Firestore = getFirestoreDatabase()) {}

  async getEvent(id: string): Promise<Event | null> {
    const snapshot = await getDoc(
      doc(this.database, "events", id).withConverter(eventConverter),
    );
    return snapshot.data() ?? null;
  }

  async getLandingPageBySlug(slug: string): Promise<LandingPage | null> {
    const pages = collection(this.database, "landingPages").withConverter(
      landingPageConverter,
    );
    const snapshot = await getDocs(
      query(
        pages,
        where("slug", "==", slug),
        where("status", "==", "published"),
        limit(1),
      ),
    );
    return snapshot.docs[0]?.data() ?? null;
  }

  async getSponsors(eventId: string): Promise<Sponsor[]> {
    const sponsors = collection(this.database, "sponsors").withConverter(
      sponsorConverter,
    );
    const snapshot = await getDocs(
      query(
        sponsors,
        where("eventId", "==", eventId),
        where("status", "==", "published"),
      ),
    );
    return snapshot.docs
      .map((item) => item.data())
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
}
