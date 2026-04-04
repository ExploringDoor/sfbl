export default function PhotosPage() {
  return (
    <section className="sec">
      <div className="container">
        <div className="sec-eyebrow">Gallery</div>
        <h2 className="sec-title">Photos</h2>
        <div style={{
          marginTop: 32,
          padding: 60,
          textAlign: 'center',
          color: 'var(--muted)',
          background: 'var(--card2)',
          borderRadius: 14,
          border: '1px solid var(--border)',
        }}>
          Photos will be added throughout the season. Check back soon!
        </div>
      </div>
    </section>
  );
}
