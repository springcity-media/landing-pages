"use client";

import { useEffect, useState } from "react";
import { FirestoreContentRepository, type LandingPage } from "@/data/firestore";

export function LandingPageContent({ slug }: { slug?: string }) {
  const [page, setPage] = useState<LandingPage | null>();

  useEffect(() => {
    let active = true;
    const repository = new FirestoreContentRepository();
    const requestedSlug =
      slug ?? decodeURIComponent(window.location.pathname.slice(1));

    repository
      .getLandingPageBySlug(requestedSlug)
      .then((result) => {
        if (active) setPage(result);
      })
      .catch(() => {
        if (active) setPage(null);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (page === undefined) {
    return <p role="status">Loading landing page…</p>;
  }

  if (page === null) {
    return <p role="alert">This landing page is not available.</p>;
  }

  return (
    <article>
      <p className="eyebrow">Community campaign</p>
      <h1>{page.title}</h1>
      <p>{page.description}</p>
    </article>
  );
}
