'use client';

import { useState } from 'react';
import Link from 'next/link';

interface NewsArticle {
  date: string;
  title: string;
  summary: string;
  fullContent?: string;
  tag: string;
  externalUrl?: string;
}

const NEWS_ITEMS: NewsArticle[] = [
  {
    date: 'March 29, 2026',
    title: 'Week 7: Rain Washes Out Most of Sunday\'s Slate',
    summary: 'Only two games were completed on March 29 as heavy rain across South Florida forced the postponement of 11 games.',
    fullContent: 'Only two games were completed on March 29 as heavy rain across South Florida forced the postponement of 11 games. Miami Amigos defeated Dade Nationals 17-6 at Flamingo Park behind a dominant offensive performance. Miami Yankees beat Matanzas 13-3 at West Perrine Park. The remaining 11 games across all three divisions were postponed due to weather. Make-up dates will be announced by the league office.',
    tag: 'GAME DAY',
  },
  {
    date: 'March 22, 2026',
    title: 'Full Slate: 11 Games Played Across All Divisions',
    summary: 'Highlights include Margate Marlins\' dominant 17-0 shutout of Miami Red Sox and Delray Devil Rays staying undefeated at 4-0.',
    fullContent: 'A full slate of 11 games were played across all three divisions on March 22. In the 18+ division, Margate Marlins delivered a dominant 17-0 shutout of Miami Red Sox at Margate Sports Complex, while West Palm Beach Cardinals edged South Florida Rays 11-10 and Miami Orioles crushed Broward Yankees 16-3.\n\nThe 28+ division saw Sunrise Giants handle Aventura Dodgers 14-5 and Miami JC defeat Aventura Braves 14-3.\n\nIn the 35+ division, Delray Devil Rays stayed perfect at 4-0 with a 19-0 blanking of South Florida Angels. South Florida Travelers routed Kooper City Royals 16-5, Southern Yankees beat Boca Mets 11-7, Miami Cardinals topped Dade Nationals 13-9, Miami Amigos edged Miami Yankees 7-6, and Matanzas defeated South Florida Dodgers 13-1.',
    tag: 'RECAP',
  },
  {
    date: 'March 15, 2026',
    title: 'Week 5: Dodgers Dominate, Devil Rays Stay Perfect',
    summary: 'South Florida Dodgers crushed Miami Charros 14-3 while Delray Devil Rays moved to 4-0.',
    fullContent: 'South Florida Dodgers crushed Miami Charros 14-3 at Floyd Hull Stadium while Delray Devil Rays moved to 4-0 with a 4-0 shutout of South Florida Travelers at Coral Springs Sportsplex. Boca Mets continued their strong play with an 18-2 win over South Florida Angels at Sugar Sand Park. Southern Yankees blanked Kooper City Royals 6-0 and South Florida Astros beat Miami Amigos 9-4.\n\nIn the 28+ division, Palm Beach Pirates dominated Aventura Dodgers 19-8 and Broward Senators edged Sunrise Giants 3-2. South Florida Rays defeated Miami Orioles 9-5 in the 18+ division.\n\nSeveral games were rained out including Matanzas vs Miami Cardinals, Aventura Braves vs Miami Brewers, and West Palm Beach Cardinals vs Miami Red Sox.',
    tag: 'RECAP',
  },
  {
    date: 'March 8, 2026',
    title: 'Week 4: Big Scores Across the Board',
    summary: 'West Palm Beach Cardinals blasted Broward Yankees 22-5. Miami Orioles put up 20 runs.',
    fullContent: 'West Palm Beach Cardinals blasted Broward Yankees 22-5 at Coral Springs Sportsplex in the 18+ division. Miami Orioles put up 20 runs against Miami Red Sox (20-9). Margate Marlins beat South Florida Rays 6-3.\n\nIn the 35+ division, South Florida Dodgers routed Dade Nationals 15-7, Boca Mets beat Kooper City Royals 15-5, Miami Amigos topped South Florida Angels 15-8, and Miami Cardinals edged Miami Yankees 12-10.\n\nThe 28+ saw Aventura Braves dominate Aventura Dodgers 14-4, Palm Beach Pirates beat Miami Brewers 6-3, and Broward Senators edged Miami JC 3-2. The Delray Devil Rays vs Southern Yankees game was rained out.',
    tag: 'RECAP',
  },
  {
    date: 'March 1, 2026',
    title: 'Week 3: Travelers Set Record, Multiple Rain Outs',
    summary: 'South Florida Travelers exploded for 23 runs in a 23-0 demolition of South Florida Angels.',
    fullContent: 'South Florida Travelers exploded for 23 runs in a stunning 23-0 demolition of South Florida Angels at Coral Springs Sportsplex. Miami Yankees scored 20 against Miami Charros at Flamingo Park. Delray Devil Rays continued their strong start with a 20-8 win over Boca Mets, and Miami Amigos crushed Miami Cardinals 15-4.\n\nSouth Florida Astros beat South Florida Dodgers 6-1 at West Perrine Park. In the 28+ division, Palm Beach Pirates defeated Broward Senators 9-6 and Sunrise Giants beat Miami Brewers 10-6.\n\nFour games were rained out: Miami Orioles vs Margate Marlins, Kooper City Royals vs Southern Yankees, Aventura Braves vs Miami JC, and Miami Red Sox vs Broward Yankees.',
    tag: 'RECAP',
  },
  {
    date: 'February 22, 2026',
    title: 'Week 2: Brewers-Dodgers Slugfest Highlights',
    summary: 'Miami Brewers outlasted Aventura Dodgers 27-15 in a combined 42-run marathon.',
    fullContent: 'Miami Brewers outlasted Aventura Dodgers 27-15 in a wild combined 42-run marathon at Flamingo Park. Southern Yankees scored 23 runs against South Florida Angels (23-12) at Coral Springs Sportsplex. South Florida Travelers beat Boca Mets 20-7 at Sugar Sand Park. Delray Devil Rays blanked Kooper City Royals 19-0.\n\nMiami Cardinals beat Miami Charros 12-7 at West Perrine Park. Sunrise Giants edged Palm Beach Pirates 7-5 at Pompey Park. South Florida Rays won a tight 1-0 game over Broward Yankees. Miami JC beat Margate Marlins 13-5 in a cross-division matchup.',
    tag: 'RECAP',
  },
  {
    date: 'February 15, 2026',
    title: 'Spring 2026 Season Opens — Season 66!',
    summary: 'The 66th season of SFBL baseball kicked off with games across all three divisions.',
    fullContent: 'The 66th season of SFBL baseball kicked off with games across all three divisions on February 15. Boca Mets opened with a strong 18-8 win over Miami Charros at Sugar Sand Park. Aventura Braves beat Sunrise Giants 9-3 at Sabal Pines Park. Miami JC dominated Aventura Dodgers 10-1 at Floyd Hull Stadium.\n\nMiami Cardinals edged South Florida Dodgers 6-4 at West Perrine Park. Kooper City Royals beat South Florida Angels 13-7 at Floyd Hull Stadium. Broward Yankees won a close one against Miami Orioles 8-7 at Sabal Pines Park.\n\nTwo games were postponed due to field conditions: South Florida Rays vs Miami Red Sox and Delray Devil Rays vs South Florida Travelers.',
    tag: 'SEASON',
  },
  {
    date: 'April 9, 2024',
    title: 'Margate Marlins Take Spring 2023 18+ Division Title',
    summary: 'The Margate Marlins defeated Team Venezuela 2-1 in the 18+ Open Division finals.',
    fullContent: 'Managed by Kelvin Abreu, the Margate Marlins entered the spring 2023 postseason as the 3rd seed but proved formidable throughout the playoffs. Starter Ariel Burgos delivered a strong seven-inning performance, allowing just six hits and striking out six batters while surrendering only one earned run.\n\nThe championship game featured a pitching duel between Burgos and Team Venezuela\'s left-hander Orestes Melendez, who went the distance for nine innings and achieved a personal-best 16 strikeouts. Despite his outstanding performance, Melendez couldn\'t secure the victory.\n\nThe turning point came in the eighth inning when closer Miguel Castellanos ripped an RBI double, later scoring himself as the Marlins rallied for two runs. Castellanos then pitched two scoreless innings with four strikeouts to seal the championship.\n\nThe Marlins emphasized team cohesion, with Abreu noting the roster consists of a group of guys who are brothers who have been playing together for 7-8 seasons. Burgos and Castellanos shared co-MVP honors.',
    tag: 'CHAMPIONSHIP',
    externalUrl: 'https://sfbl.com/margate-marlins-hoist-spring-23-championship-trophy/',
  },
  {
    date: 'April 9, 2024',
    title: 'Miami Amigos Steal 28+ Crown with Walk-Off Win',
    summary: 'The Miami Amigos captured the 28+ Division title with a dramatic 6-5 walk-off victory over Aventura Braves.',
    fullContent: 'The Miami Amigos clinched the 28+ division championship with a dramatic 6-5 walk-off victory against the Aventura Braves in a contest filled with tension.\n\nThe game remained competitive throughout. The Braves scored first in the second inning, but the Amigos equalized. Aventura extended their lead to 3-1 by the fifth inning, though Miami answered back to make it 5-3 after the Braves added two runs in the seventh.\n\nThe championship moment arrived in the ninth inning. With two outs and runners in scoring position, Eddie Cabrera stepped to the plate on a full count and delivered a single down the first-base line. After stealing second base, Cabrera advanced to third when Jose Aguada hit a grounder into the outfield gap. Cabrera scored the tying run, and after a bad hop, crossed home plate to secure the 6-5 victory.\n\nCabrera earned MVP honors, finishing 3-for-5 with two RBIs and two stolen bases. Pitcher Ruben Ramos threw 7 1/3 innings, striking out six batters.',
    tag: 'CHAMPIONSHIP',
    externalUrl: 'https://sfbl.com/miami-amigos-survive-testy-9th-to-win-23-spring-title-over-braves/',
  },
  {
    date: 'April 11, 2024',
    title: 'Dade Nationals Repeat as 35+ Champions — 9th Straight Title',
    summary: 'Dade Nationals demolished Southern Yankees 13-5, securing their ninth consecutive championship.',
    fullContent: 'The Dade Nationals defeated the Southern Yankees 13-5 in the Spring 2023 championship game, securing their ninth consecutive division title. The Yankees, who finished the regular season with an impressive 10-2 record, struggled offensively against Nationals pitcher Ramon Alfonso.\n\nAlfonso delivered a dominant complete-game performance, collecting four hits including two doubles — one clearing the bases in the third inning. The Nationals\' defense proved nearly flawless throughout the season, while the Yankees committed three critical errors that proved costly.\n\nThe Yankees managed limited offensive production, with Mike Ennis and Melvyn Martinez each recording two hits.\n\nNationals manager Jorge Orbeta expressed satisfaction with the achievement, stating it\'s no easy feat winning 9 championships in a row. Alfonso earned championship game MVP honors.',
    tag: 'CHAMPIONSHIP',
    externalUrl: 'https://sfbl.com/dade-nationals-conquer-southern-yankees-13-5-in-spring-23-blowout-championship-victory/',
  },
];

export default function NewsPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="sec">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="sec-eyebrow">Latest Updates</div>
        <h2 className="sec-title">News</h2>

        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {NEWS_ITEMS.map((item, i) => {
            const isExpanded = expandedIndex === i;
            return (
              <article
                key={i}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 28,
                  borderLeft: `4px solid ${item.tag === 'CHAMPIONSHIP' ? 'var(--accent)' : item.tag === 'SEASON' ? 'var(--green)' : 'var(--gold)'}`,
                  cursor: 'pointer',
                  transition: 'all .15s',
                }}
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
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
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted2)' }}>
                    {isExpanded ? '▲ Close' : '▼ Read more'}
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 22, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 10 }}>
                  {item.title}
                </h3>
                {!isExpanded && (
                  <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: 14 }}>
                    {item.summary}
                  </p>
                )}
                {isExpanded && (
                  <div>
                    {(item.fullContent || item.summary).split('\n\n').map((para, j) => (
                      <p key={j} style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: 14, marginBottom: 12 }}>
                        {para}
                      </p>
                    ))}
                    {item.externalUrl && (
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{ display: 'inline-block', marginTop: 8, fontSize: 12, fontWeight: 700, color: 'var(--gold)', textDecoration: 'none' }}
                      >
                        Read original article on sfbl.com &raquo;
                      </a>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <Link href="/schedule" className="btn-outline">View Full Schedule &amp; Scores</Link>
        </div>
      </div>
    </section>
  );
}
