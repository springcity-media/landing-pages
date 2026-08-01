import { BrandMark } from "@/components/brand-mark";
import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <main>
      <nav aria-label="Main navigation">
        <a className="brand" href="#top" aria-label={`${siteConfig.name} home`}>
          <BrandMark />
          <span>{siteConfig.name}</span>
        </a>
        <a className="nav-link" href={`mailto:${siteConfig.contactEmail}`}>Start a project</a>
      </nav>

      <section className="hero" id="top">
        <div className="eyebrow"><span /> Advertising people can hold</div>
        <h1>Make your brand<br /><em>refreshing.</em></h1>
        <p>{siteConfig.description} We turn premium bottled water into a meaningful connection between local brands and their communities.</p>
        <a className="button" href={`mailto:${siteConfig.contactEmail}`}>Create your campaign <span>→</span></a>
      </section>

      <aside className="campaign-card" aria-label="Campaign preview">
        <div className="can">
          <span className="can-top" />
          <div><small>Your brand</small><strong>HERE</strong><span>Spring City<br />Pure Water</span></div>
        </div>
        <p><strong>Designed to be seen.</strong><br />Shared where it matters.</p>
      </aside>

      <footer><span>Strategy</span><i /> <span>Design</span><i /> <span>Distribution</span></footer>
    </main>
  );
}
