import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Store — SFBL' };

const PRODUCTS = [
  { name: 'SFBL T-Shirts', price: '$20.00', desc: 'Official SFBL league t-shirt' },
  { name: 'Authentic SFBL Logo Baseball Caps', price: '$20.00', desc: 'Authentic SFBL fitted and adjustable caps' },
  { name: 'Sandy Alomar Wood Bats', price: '$60.00', desc: 'Game-ready wood bats approved for SFBL play' },
  { name: 'White Baseball Pants', price: '$20.00', desc: 'Regulation white baseball pants' },
];

export default function StorePage() {
  return (
    <section className="sec">
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="sec-eyebrow">Merchandise</div>
        <h2 className="sec-title">SFBL Store</h2>
        <p style={{ color: 'var(--muted)', marginTop: 12, fontSize: 14 }}>
          Official South Florida Baseball League merchandise. To order, email{' '}
          <a href="mailto:playball@sfbl.com" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 700 }}>playball@sfbl.com</a> with your items.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginTop: 32 }}>
          {PRODUCTS.map(p => (
            <div
              key={p.name}
              style={{
                background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12,
                padding: 24, textAlign: 'center', transition: 'all .2s',
              }}
            >
              <div style={{
                width: 80, height: 80, borderRadius: 12, background: 'var(--card2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', fontSize: 32,
              }}>
                {p.name.includes('T-Shirt') ? '👕' : p.name.includes('Cap') ? '🧢' : p.name.includes('Bat') ? '🏏' : '👖'}
              </div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16, textTransform: 'uppercase', marginBottom: 6 }}>
                {p.name}
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 12 }}>{p.desc}</p>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 24, color: 'var(--gold)' }}>
                {p.price}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, textAlign: 'center', background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
          <p style={{ fontWeight: 700, marginBottom: 8 }}>Ready to order?</p>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>
            Email your order to <a href="mailto:playball@sfbl.com" style={{ color: 'var(--gold)', textDecoration: 'none' }}>playball@sfbl.com</a> with item names, sizes, and quantities.
          </p>
          <a href="mailto:playball@sfbl.com?subject=SFBL Store Order" className="btn-gold" style={{ display: 'inline-block' }}>
            Email Your Order
          </a>
        </div>
      </div>
    </section>
  );
}
