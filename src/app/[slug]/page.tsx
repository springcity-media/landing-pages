import { LandingPageContent } from "./landing-page-content";

export function generateStaticParams() {
  return [{ slug: "sample-event" }];
}

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main>
      <LandingPageContent slug={slug} />
    </main>
  );
}
