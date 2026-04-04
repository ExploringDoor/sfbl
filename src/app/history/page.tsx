export default function HistoryPage() {
  return (
    <section className="sec">
      <div className="container">
        <div className="sec-eyebrow">History</div>
        <h2 className="sec-title">34 Years of SFBL</h2>
        <p style={{ marginTop: 16, color: 'var(--muted)', maxWidth: 600 }}>
          The South Florida Baseball League was established in 1992 and has completed
          65+ consecutive seasons of adult baseball across Dade, Broward, and Palm Beach counties.
        </p>

        <div style={{ marginTop: 32, padding: 60, textAlign: 'center', color: 'var(--muted)', background: 'var(--card2)', borderRadius: 14, border: '1px solid var(--border)' }}>
          Historical standings and championship data will be compiled and added here.
          For historical stats, visit{' '}
          <a href="https://ballgamecentral.com/SFBL/Scores.asp?LCID=1" style={{ color: 'var(--gold)', textDecoration: 'none' }}>
            BallgameCentral
          </a>
          .
        </div>
      </div>
    </section>
  );
}
