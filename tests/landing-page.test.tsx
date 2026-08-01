import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { test } from "vitest";
import { LandingPageContent } from "@/app/[slug]/landing-page-content";

test("landing-page route renders an accessible loading state", () => {
  const markup = renderToStaticMarkup(
    <LandingPageContent slug="sample-event" />,
  );

  assert.match(markup, /role="status"/);
  assert.match(markup, /Loading landing page/);
});

test("campaign fallback renders an accessible loading state", () => {
  const markup = renderToStaticMarkup(<LandingPageContent />);

  assert.match(markup, /role="status"/);
  assert.match(markup, /Loading landing page/);
});
