import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'News — SFBL' };

const NEWS_ITEMS = [
  {
    date: 'March 29, 2026',
    title: 'Week 7: Rain Washes Out Most of Sunday\'s Slate',
    content: 'Only two games were completed on March 29 as heavy rain across South Florida forced the postponement of 11 games. Miami Amigos defeated Dade Nationals 17-6 and Miami Yankees beat Matanzas 13-3. Make-up dates will be announced.',
    tag: 'GAME DAY',
  },
  {
    date: 'March 22, 2026',
    title: 'Full Slate: 11 Games Played Across All Divisions',
    content: 'Highlights include Margate Marlins\' dominant 17-0 shutout of Miami Red Sox, Delray Devil Rays\' 19-0 blanking of South Florida Angels to stay undefeated at 4-0, and South Florida Travelers\' 16-5 win over Kooper City Royals.',
    tag: 'RECAP',
  },
  {
    date: 'March 15, 2026',
    title: 'Week 5: Dodgers Dominate, Devil Rays Stay Perfect',
    content: 'South Florida Dodgers crushed Miami Charros 14-3 while Delray Devil Rays moved to 4-0 with a shutout of South Florida Travelers. Boca Mets continued their strong play with an 18-2 win over South Florida Angels. Several games were rained out.',
    tag: 'RECAP',
  },
  {
    date: 'March 8, 2026',
    title: 'Week 4: Big Scores Across the Board',
    content: 'West Palm Beach Cardinals blasted Broward Yankees 22-5 in the 18+ division. Miami Orioles put up 20 runs against Miami Red Sox. In the 35+ division, Boca Mets beat Kooper City Royals 15-5 and Miami Amigos topped South Florida Angels 15-8.',
    tag: 'RECAP',
  },
  {
    date: 'March 1, 2026',
    title: 'Week 3: Travelers Set Record, Multiple Rain Outs',
    content: 'South Florida Travelers exploded for 23 runs in a 23-0 demolition of South Florida Angels. Miami Yankees scored 20 against Miami Charros. Four games were rained out and will be rescheduled.',
    tag: 'RECAP',
  },
  {
    date: 'February 22, 2026',
    title: 'Week 2: Brewers-Dodgers Slugfest Highlights',
    content: 'Miami Brewers outlasted Aventura Dodgers 27-15 in a combined 42-run marathon. Southern Yankees scored 23 runs against South Florida Angels. Delray Devil Rays blanked Kooper City Royals 19-0.',
    tag: 'RECAP',
  },
  {
    date: 'February 15, 2026',
    title: 'Spring 2026 Season Opens — Season 66!',
    content: 'The 66th season of SFBL baseball kicked off with games across all three divisions. Boca Mets opened with an 18-8 win over Miami Charros, Aventura Braves beat Sunrise Giants 9-3, and Broward Yankees edged Miami Orioles 8-7. Two games were postponed.',
    tag: 'SEASON',
  },
  {
    date: 'April 9, 2024',
    title: 'Margate Marlins Take Spring 2023 18+ Division Title',
    content: 'The Margate Marlins, managed by Kelvin Abreu, defeated Team Venezuela 2-1 in the 18+ Open Division finals to capture the championship.',
    tag: 'CHAMPIONSHIP',
  },
  {
    date: 'April 9, 2024',
    title: 'Miami Amigos Steal 28+ Crown with Walk-Off Win',
    content: 'The Miami Amigos captured the 28+ Division title with a dramatic 6-5 come-from-behind walk-off victory over Aventura Braves in the championship game.',
    tag: 'CHAMPIONSHIP',
  },
  {
    date: 'April 11, 2024',
    title: 'Dade Nationals Repeat as 35+ Champions',
    content: 'Dade Nationals demolished Southern Yankees 13-5 in a dominant performance, securing their ninth consecutive championship in the 35+ Division.',
    tag: 'CHAMPIONSHIP',
  },
];

export default function NewsPage() {
  return (
    <section className="sec">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="sec-eyebrow">Latest Updates</div>
        <h2 className="sec-title">News</h2>

        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {NEWS_ITEMS.map((item, i) => (
            <article
              key={i}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: 28,
                borderLeft: `4px solid ${item.tag === 'CHAMPIONSHIP' ? 'var(--accent)' : 'var(--gold)'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase',
                  padding: '3px 8px', borderRadius: 4,
                  background: item.tag === 'CHAMPIONSHIP' ? 'rgba(200,16,46,.1)' : item.tag === 'SEASON' ? 'rgba(34,197,94,.1)' : 'var(--gold-dim)',
                  color: item.tag === 'CHAMPIONSHIP' ? 'var(--red)' : item.tag === 'SEASON' ? 'var(--green)' : 'var(--gold)',
                }}>
                  {item.tag}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  {item.date}
                </span>
              </div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 22, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 10 }}>
                {item.title}
              </h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: 14 }}>
                {item.content}
              </p>
            </article>
          ))}
        </div>

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <Link href="/schedule" className="btn-outline">View Full Schedule &amp; Scores</Link>
        </div>
      </div>
    </section>
  );
}
