import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Contact — SFBL' };

export default function ContactPage() {
  return (
    <section className="sec">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="sec-eyebrow">Get in Touch</div>
        <h2 className="sec-title">Contact Us</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 32 }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 28 }}>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gold)', marginBottom: 16 }}>
              League Office
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14, lineHeight: 1.7 }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>Address</div>
                <div style={{ color: 'var(--muted)' }}>1331 Brickell Bay Drive #1005<br />Miami, Florida 33131</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>Phone</div>
                <a href="tel:7863720034" style={{ color: 'var(--gold)', textDecoration: 'none' }}>786-372-0034</a>
                <span style={{ color: 'var(--muted)', margin: '0 6px' }}>|</span>
                <a href="tel:3125605488" style={{ color: 'var(--gold)', textDecoration: 'none' }}>312-560-5488</a>
              </div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>Email</div>
                <a href="mailto:playball@sfbl.com" style={{ color: 'var(--gold)', textDecoration: 'none' }}>playball@sfbl.com</a>
              </div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>Website</div>
                <a href="https://sfbl.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'none' }}>sfbl.com</a>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 28 }}>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gold)', marginBottom: 16 }}>
              Follow Us
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14 }}>
              <a href="http://www.facebook.com/southfloridabaseball" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>
                Facebook — /southfloridabaseball
              </a>
              <a href="https://x.com/flahardball" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>
                X (Twitter) — @flahardball
              </a>
              <a href="https://www.instagram.com/southfloridabaseballleague" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>
                Instagram — @southfloridabaseballleague
              </a>
              <a href="https://www.youtube.com/channel/UCQms-U-6J_NS7MxY5h75_OA" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>
                YouTube — SFBL Channel
              </a>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 32, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 28 }}>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gold)', marginBottom: 16 }}>
            Playing Fields
          </h3>
          <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: 14 }}>
            The SFBL operates across Dade, Broward, and Palm Beach counties. All games are played on Sundays
            at quality facilities including Coral Springs Sportsplex, Flamingo Park, Floyd Hull Stadium,
            Sabal Pines Park, Sugar Sand Park, Sunset Park, West Perrine Park, Pompey Park, and Margate Sports Complex.
          </p>
        </div>
      </div>
    </section>
  );
}
