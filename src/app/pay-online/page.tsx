import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Pay Online — SFBL' };

export default function PayOnlinePage() {
  return (
    <section className="sec">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="sec-eyebrow">Payments</div>
        <h2 className="sec-title">Pay Online</h2>
        <p style={{ color: 'var(--muted)', marginTop: 12, fontSize: 14 }}>
          The SFBL player registration fee for the upcoming season is <strong>$280</strong>.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 32 }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>&#128179;</div>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16, textTransform: 'uppercase', marginBottom: 8 }}>
              Zelle
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }}>
              Send payment to:
            </p>
            <div style={{ fontWeight: 700, color: 'var(--gold)', marginTop: 8, fontSize: 14 }}>
              nelson@sfbl.com
            </div>
          </div>

          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>&#128241;</div>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16, textTransform: 'uppercase', marginBottom: 8 }}>
              Venmo
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }}>
              Send to Nelson Rodriguez:
            </p>
            <div style={{ fontWeight: 700, color: 'var(--gold)', marginTop: 8, fontSize: 14 }}>
              (312) 560-5488
            </div>
          </div>

          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>&#128179;</div>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16, textTransform: 'uppercase', marginBottom: 8 }}>
              Credit/Debit
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }}>
              All major cards accepted
            </p>
            <a
              href="https://sfbl.com/pay-online/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
              style={{ display: 'inline-block', marginTop: 12, padding: '8px 20px', fontSize: 11 }}
            >
              Pay with Card
            </a>
          </div>
        </div>

        <div style={{ marginTop: 32, background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>
            Fees cover: field rentals, umpires, baseballs, insurance, website, stats, All-Star games, prizes &amp; trophies.
            <br />
            Questions? Email <a href="mailto:playball@sfbl.com" style={{ color: 'var(--gold)', textDecoration: 'none' }}>playball@sfbl.com</a> or call <a href="tel:7863720034" style={{ color: 'var(--gold)', textDecoration: 'none' }}>786-372-0034</a>
          </p>
        </div>
      </div>
    </section>
  );
}
