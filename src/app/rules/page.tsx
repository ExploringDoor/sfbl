import { FIELDS } from '@/lib/fields';

export default function RulesPage() {
  return (
    <section className="sec">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="sec-eyebrow">League Info</div>
        <h2 className="sec-title">Rules &amp; Fields</h2>

        {/* League Overview */}
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 20, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gold)', marginBottom: 16 }}>
            League Overview
          </h3>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 24, lineHeight: 1.8 }}>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><strong>Wood Bat League</strong> - All players must use wood bats</li>
              <li><strong>3 Divisions:</strong> 18+, 28+, and 35+</li>
              <li><strong>Season:</strong> 12 regular season games + 3 playoff rounds (Quarterfinals, Semifinals, Championship)</li>
              <li><strong>Game Day:</strong> All games played on Sundays (mornings and afternoons)</li>
              <li><strong>Baseballs:</strong> Minor League baseballs</li>
              <li><strong>Umpires:</strong> South Florida College Baseball Umpires Association</li>
            </ul>
          </div>
        </div>

        {/* Registration */}
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 20, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gold)', marginBottom: 16 }}>
            Registration
          </h3>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 24, lineHeight: 1.8 }}>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><strong>Membership:</strong> $280 per player</li>
              <li><strong>Uniforms:</strong> $25-$45 (team-dependent)</li>
              <li>New players are assigned to the Player Pool, then placed on teams based on age, position, and location</li>
              <li>Fees cover: field rentals, umpires, baseballs, insurance, website, stats, All-Star games, prizes/trophies</li>
            </ul>
          </div>
        </div>

        {/* Championship Prizes */}
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 20, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gold)', marginBottom: 16 }}>
            Championship Prizes
          </h3>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 24, lineHeight: 1.8 }}>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>$1,000 cash prize per division champion</li>
              <li>Team trophy</li>
              <li>MVP trophy</li>
              <li>Championship t-shirts</li>
              <li>Authentic SFBL logo caps</li>
            </ul>
          </div>
        </div>

        {/* Fields */}
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 20, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gold)', marginBottom: 16 }}>
            Fields
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FIELDS.map(f => (
              <div key={f.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 18 }}>
                  {f.name}
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>
                  {f.address}, {f.city}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 20, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gold)', marginBottom: 16 }}>
            Contact
          </h3>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 24, lineHeight: 1.8 }}>
            <div><strong>Phone:</strong> <a href="tel:7863720034" style={{ color: 'var(--gold)', textDecoration: 'none' }}>786-372-0034</a></div>
            <div><strong>Email:</strong> <a href="mailto:playball@sfbl.com" style={{ color: 'var(--gold)', textDecoration: 'none' }}>playball@sfbl.com</a></div>
            <div><strong>Website:</strong> <a href="https://sfbl.com" style={{ color: 'var(--gold)', textDecoration: 'none' }}>sfbl.com</a></div>
          </div>
        </div>
      </div>
    </section>
  );
}
