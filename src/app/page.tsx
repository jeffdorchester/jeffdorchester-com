import CapabilitiesGame from '@/components/CapabilitiesGame';
import StatsGame from '@/components/StatsGame';

const links = {
  email: 'jeff@jeffdorchester.com',
  linkedin: 'https://linkedin.com/in/jeffdorchester',
  forbes:
    'https://www.forbes.com/sites/afdhelaziz/2020/09/22/how-innovative-tech-platform-irel8-is-helping-shatter-the-stigma-of-mental-health-by-giving-people-a-chance-to-support-each-other/',
  microsoftTransform:
    'https://news.microsoft.com/transform/a-new-app-aims-to-shatter-the-stigma-surrounding-mental-health/',
  microsoftTransformPartners:
    'https://news.microsoft.com/transform/irel8-partners-veterans-artists-reduce-mental-illness-stigma/',
  resume: '/resume.pdf',
};

export default function Home() {
  return (
    <main>
      <header className="hero">
        <div className="status" role="status" aria-live="polite">
          <span className="status-dot" aria-hidden="true" />
          <span className="status-text-full">
            Available for senior technology leadership roles
          </span>
          <span className="status-text-short">
            Available for senior leadership
          </span>
        </div>

        <h1>Jeff Dorchester</h1>
        <p className="role">
          Founder-CTO &middot; Industrial Designer Turned Tech Executive
        </p>
        <p className="location">Stonington, ME &middot; Remote-first</p>
        <p className="pitch">
          I build regulated software, and I fix what others have walked away
          from.
        </p>
        <div className="hero-cta">
          <a
            href={links.resume}
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download resume
          </a>
          <a href={`mailto:${links.email}`} className="btn btn-secondary">
            Get in touch
          </a>
        </div>
      </header>

      <StatsGame />

      <section className="narrative">
        <h2>About</h2>
        <p>
          Twenty-seven years building technology companies. Six startups, one
          acquisition, one near-IPO, a Microsoft Ignite keynote, and most
          recently a multi-year run as the entire technology function at a
          behavioral-health platform serving thousands of patients in active
          care.
        </p>
        <p>
          I trained as an industrial designer (ASU &apos;99, with a year at Köln
          International School of Design in Germany). That is why I think about
          users, systems, and supply chains at the same time, and why my work
          moves cleanly between code reviews, sales calls, partner negotiations,
          and boardrooms without losing any of those audiences.
        </p>
      </section>

      <section className="featured-work">
        <h2>Selected work</h2>

        <article className="work-card">
          <div className="work-header">
            <h3>Youturn Health</h3>
            <span className="work-meta">CTO &middot; 2023–2026</span>
          </div>
          <div className="work-stats">
            <div className="work-stat">
              <div className="ws-number">20</div>
              <div className="ws-label">months solo CTO</div>
            </div>
            <div className="work-stat">
              <div className="ws-number">3</div>
              <div className="ws-label">compliance programs</div>
            </div>
            <div className="work-stat">
              <div className="ws-number">99.9%</div>
              <div className="ws-label">platform uptime</div>
            </div>
          </div>
          <p>
            Behavioral-health platform combining proprietary SaaS with peer
            support and coaching. Joined as strategic consultant. Shipped a
            multi-year stalled product to MVP in 90 days, then promoted to CTO.
            Through a company-wide RIF, ran the entire technology function solo
            for an extended period: engineering, IT, security, compliance, and
            endpoint. Delivered SOC 2, HIPAA, and CIS Critical Security Controls
            in parallel. Materially increased operational leverage through
            UX-driven workflow redesign. Unlocked a strategic partnership with a
            top-tier US healthcare provider.
          </p>
        </article>

        <article className="work-card">
          <div className="work-header">
            <h3>iRel8</h3>
            <span className="work-meta">
              Co-Founder &amp; CTO &middot; 2017–2024
            </span>
          </div>
          <div className="work-stats">
            <div className="work-stat">
              <div className="ws-number">100K+</div>
              <div className="ws-label">users</div>
            </div>
            <div className="work-stat">
              <div className="ws-number">54+</div>
              <div className="ws-label">languages</div>
            </div>
            <div className="work-stat">
              <div className="ws-number">2018</div>
              <div className="ws-label">MSFT Ignite keynote</div>
            </div>
          </div>
          <p>
            Bootstrapped peer-to-peer mental-wellness platform built on the
            thesis that anonymity unlocks vulnerability. White-labeled to
            mission-critical partners across mental health, first responders,
            special forces, and maternal health. Drove a multi-year strategic
            partnership with Microsoft, including a 12-person Microsoft product
            team contributed pro bono and the{' '}
            <a href={links.microsoftTransform}>Microsoft Transform</a> feature
            that headlined the Microsoft homepage for over a month.
          </p>
        </article>

        <article className="work-card">
          <div className="work-header">
            <h3>Loyl.Me</h3>
            <span className="work-meta">
              Founder &amp; CCO &middot; 2012–2015
            </span>
          </div>
          <div className="work-stats">
            <div className="work-stat">
              <div className="ws-number">18</div>
              <div className="ws-label">countries</div>
            </div>
            <div className="work-stat">
              <div className="ws-number">6</div>
              <div className="ws-label">languages</div>
            </div>
            <div className="work-stat">
              <div className="ws-number">2015</div>
              <div className="ws-label">acquired</div>
            </div>
          </div>
          <p>
            Bootstrapped CRM and automated-marketing platform serving SMBs
            through Fortune 500. Mostly organic growth. Customers ranged from
            street-cart vendors to Fortune 500 enterprises. Acquired by Monetary
            LLC, October 2015, by the same investor who had previously walked
            away from the same problem with 100+ employees.
          </p>
        </article>
      </section>

      <CapabilitiesGame />

      <section className="press">
        <h2>Featured in</h2>
        <div className="press-grid">
          <a href={links.forbes} className="press-card">
            <div className="press-name">Forbes</div>
            <div className="press-detail">
              September 2020 feature on iRel8 by Afdhel Aziz
            </div>
          </a>
          <a href={links.microsoftTransform} className="press-card">
            <div className="press-name">Microsoft Transform</div>
            <div className="press-detail">
              Multiple features. Top of homepage for over a month.
            </div>
          </a>
          <div className="press-card press-card-static">
            <div className="press-name">Microsoft Ignite</div>
            <div className="press-detail">
              2018 keynote, Scott Hanselman session, 5,000+ in-room
            </div>
          </div>
          <div className="press-card press-card-static">
            <div className="press-name">NYSE</div>
            <div className="press-detail">
              Roadshow appearances with the Microsoft strategic partnership
            </div>
          </div>
        </div>
      </section>

      <section className="cta-block">
        <h2 className="cta-eyebrow">What I am looking for</h2>
        <p className="cta-headline">
          The right next chapter as CTO, CPO, or hybrid
          technology-and-compliance leadership.
        </p>
        <p className="cta-sub">
          Regulated software preferred. Industry-flexible. The throughline is
          not a vertical, it is the operator instinct.
        </p>
        <div className="cta-buttons">
          <a href={`mailto:${links.email}`} className="btn btn-primary">
            Get in touch
          </a>
          <a
            href={links.resume}
            className="btn btn-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            View resume
          </a>
        </div>
        <div className="cta-meta">
          <a href={`mailto:${links.email}`}>{links.email}</a>
          <span className="dot">&middot;</span>
          <a href={links.linkedin}>linkedin.com/in/jeffdorchester</a>
        </div>
      </section>
    </main>
  );
}
