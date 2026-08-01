import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { test } from "vitest";
import Home from "@/app/page";
import { siteConfig } from "@/config/site";

test("starter route renders the campaign call to action", () => {
  const markup = renderToStaticMarkup(<Home />);

  assert.match(markup, /Make your brand/);
  assert.match(markup, /Create your campaign/);
  assert.match(markup, new RegExp(`mailto:${siteConfig.contactEmail}`));
});
