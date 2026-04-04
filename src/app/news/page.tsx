'use client';

/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';

interface NewsArticle {
  date: string;
  title: string;
  summary: string;
  fullContent?: string;
  tag: string;
  externalUrl: string;
  image?: string;
}

const NEWS_ITEMS: NewsArticle[] = [
  // Spring 2026 recaps
  { date: 'Mar 29, 2026', title: 'Week 7: Rain Washes Out Most of Sunday\'s Slate', summary: 'Only 2 of 13 games completed. Miami Amigos beat Dade Nationals 17-6, Miami Yankees beat Matanzas 13-3. 11 games postponed due to weather.', tag: 'RECAP', externalUrl: '/scores' },
  { date: 'Mar 22, 2026', title: 'Full Slate: 11 Games Played Across All Divisions', summary: 'Margate Marlins shut out Miami Red Sox 17-0. Delray Devil Rays stay undefeated at 4-0 with 19-0 win over SF Angels. SF Travelers rout Kooper City Royals 16-5.', tag: 'RECAP', externalUrl: '/scores' },
  { date: 'Mar 15, 2026', title: 'Week 5: Dodgers Dominate, Devil Rays Stay Perfect', summary: 'SF Dodgers crush Miami Charros 14-3. Boca Mets win 18-2 over SF Angels. Several games rained out.', tag: 'RECAP', externalUrl: '/scores' },
  { date: 'Mar 8, 2026', title: 'Week 4: Big Scores Across the Board', summary: 'WPB Cardinals blast Broward Yankees 22-5. Miami Orioles put up 20 runs. Boca Mets beat Kooper City Royals 15-5.', tag: 'RECAP', externalUrl: '/scores' },
  { date: 'Mar 1, 2026', title: 'Week 3: Travelers Set Record, Multiple Rain Outs', summary: 'SF Travelers explode for 23-0 over SF Angels. Miami Yankees score 20 against Miami Charros. Four games rained out.', tag: 'RECAP', externalUrl: '/scores' },
  { date: 'Feb 22, 2026', title: 'Week 2: Brewers-Dodgers Slugfest', summary: 'Miami Brewers outlast Aventura Dodgers 27-15 in 42-run marathon. Southern Yankees score 23. Delray Devil Rays blank Kooper City Royals 19-0.', tag: 'RECAP', externalUrl: '/scores' },
  { date: 'Feb 15, 2026', title: 'Spring 2026 Season Opens — Season 66!', summary: 'The 66th season kicks off. Boca Mets open with 18-8 win over Miami Charros. Broward Yankees edge Miami Orioles 8-7.', tag: 'SEASON', externalUrl: '/scores' },

  // Championship articles from sfbl.com
  { date: 'Aug 19, 2025', title: 'SFBL Fall 2023 Season Recap', summary: 'Championship results across all divisions for the Fall 2023 season.', tag: 'CHAMPIONSHIP', externalUrl: 'https://sfbl.com/fall-2023-season-recap/', image: 'https://sfbl.com/wp-content/uploads/2025/01/Fall-2023-Champions-copy-2-177x142.jpg' },
  { date: 'Aug 19, 2025', title: 'SFBL Spring 2023 Season Recap', summary: 'Complete Spring 2023 championship results and season summary.', tag: 'CHAMPIONSHIP', externalUrl: 'https://sfbl.com/sfbl-spring-2023-season-recap/', image: 'https://sfbl.com/wp-content/uploads/2024/03/Spring-2023-Champions-3-TEAMS-177x142.jpg' },
  { date: 'Apr 9, 2024', title: 'Margate Marlins Take Spring 2023 18+ Title with 2-1 Win', summary: 'Marlins defeat Team Venezuela behind Ariel Burgos\' strong pitching. Miguel Castellanos delivers clutch RBI double in the 8th.', tag: 'CHAMPIONSHIP', externalUrl: 'https://sfbl.com/margate-marlins-hoist-spring-23-championship-trophy/', image: 'https://sfbl.com/wp-content/uploads/2024/02/IMG_9760-177x142.jpg' },
  { date: 'Apr 9, 2024', title: 'Miami Amigos Steal 28+ Crown with 6-5 Walk-Off', summary: 'Eddie Cabrera delivers walk-off single in the 9th. Earns MVP honors going 3-for-5 with 2 RBI and 2 stolen bases.', tag: 'CHAMPIONSHIP', externalUrl: 'https://sfbl.com/miami-amigos-survive-testy-9th-to-win-23-spring-title-over-braves/', image: 'https://sfbl.com/wp-content/uploads/2024/02/amigos-177x142.jpg' },
  { date: 'Apr 11, 2024', title: 'Dade Nationals Repeat as 35+ Champs — 9th Straight Title', summary: 'Nationals demolish Southern Yankees 13-5. Ramon Alfonso dominates with complete game and 4 hits including 2 doubles.', tag: 'CHAMPIONSHIP', externalUrl: 'https://sfbl.com/dade-nationals-conquer-southern-yankees-13-5-in-spring-23-blowout-championship-victory/', image: 'https://sfbl.com/wp-content/uploads/2019/06/F19-dade-nationals-team-photo-w-trophies-680-510-177x142.jpg' },
  { date: 'Apr 16, 2024', title: 'SFBL Fall 2022 Season Recap', summary: 'Complete Fall 2022 championship documentation across all divisions.', tag: 'CHAMPIONSHIP', externalUrl: 'https://sfbl.com/sfbl-fall-2022-season-recap/', image: 'https://sfbl.com/wp-content/uploads/2022/09/miami-jc-photo-action-shot-1-pdf.jpg' },
  { date: 'Apr 11, 2024', title: 'Slugfest: 17-15 Fall \'22 Dade Nationals 35+ 7th Straight Title', summary: 'High-scoring championship match results in Dade Nationals capturing their 7th consecutive 35+ title.', tag: 'CHAMPIONSHIP', externalUrl: 'https://sfbl.com/slugfest-results-in-17-15-fall-22-dade-nationals-35-7th-straight-title/', image: 'https://sfbl.com/wp-content/uploads/2024/02/IMG_1104-177x142.jpeg' },
  { date: 'Apr 16, 2024', title: 'Dacar Senators Win Fall \'22 28+ Title 10-2 Over Amigos', summary: 'Dacar Senators dominate Miami Amigos to claim the 28+ Division championship.', tag: 'CHAMPIONSHIP', externalUrl: 'https://sfbl.com/dacar-senators-win-fall-22-title-10-2-over-amigos/', image: 'https://sfbl.com/wp-content/uploads/2024/02/dacar-senators-177x142.jpg' },
  { date: 'Apr 16, 2024', title: 'Miami JC Walks Off Serinca Baseball 2-1 in Championship', summary: 'Miami JC wins 18+ title with dramatic walk-off victory in Fall 2022.', tag: 'CHAMPIONSHIP', externalUrl: 'https://sfbl.com/miami-jc-18-walks-off-serinca-baseball-club-2-1-in-championship-finale-of-22-fall-season/', image: 'https://sfbl.com/wp-content/uploads/2024/03/miami-jc-177x142.png' },
  { date: 'Apr 16, 2024', title: 'SFBL Spring 2022 Season Recap', summary: 'Championship and runner-up results across all age divisions.', tag: 'CHAMPIONSHIP', externalUrl: 'https://sfbl.com/sfbl-spring-2022-season-recap/' },
  { date: 'Apr 16, 2024', title: 'Fall 2021 SFBL Season Recap', summary: 'Complete Fall 2021 season recap and championship results.', tag: 'CHAMPIONSHIP', externalUrl: 'https://sfbl.com/fall-2021-sfbl-season-recap/' },
  { date: 'Apr 11, 2024', title: 'Boca Red Sox Shut Out Plantation Astros 8-0 for 18+ Title', summary: 'Boca Red Sox win Spring 2021 18+ Division championship with dominant shutout.', tag: 'CHAMPIONSHIP', externalUrl: 'https://sfbl.com/boca-red-sox-shut-out-plantation-astros-8-0-to-win-18-division-spring-2021-season-championship/', image: 'https://sfbl.com/wp-content/uploads/2022/01/S21-18-BOCA-RED-SOX-CHAMPS-680-590-177x142.jpg' },
  { date: 'Feb 12, 2022', title: 'Hollywood Astros Win 28+ Spring 2021 Crown', summary: 'Hollywood Astros beat Miami Mariners 13-6 for the 28+ Division championship.', tag: 'CHAMPIONSHIP', externalUrl: 'https://sfbl.com/hollywood-astros-win-28-division-spring-2021-season-crown-beat-miami-mariners-13-6/', image: 'https://sfbl.com/wp-content/uploads/2022/01/S21-28-FINALS-HOLLYWOOD-ASTROS-CHAMPS-CHAMPAGNE-680-590-177x142.jpg' },
  { date: 'Feb 12, 2022', title: 'Dade Nationals Win 35+ Spring 2021 Title 17-6', summary: 'Dade Nationals defeat South Florida Dodgers for another 35+ Division championship.', tag: 'CHAMPIONSHIP', externalUrl: 'https://sfbl.com/dade-nationals-earn-35-division-spring-2021-season-title-with-17-6-win-over-south-florida-dodgers/', image: 'https://sfbl.com/wp-content/uploads/2022/01/S21-35-FINALS-DADE-NATIONALS-CHAMPIONS-680-590-177x142.jpg' },
  { date: 'Dec 14, 2019', title: 'Valma Senators Claim First Senior 30+ Division Title', summary: 'Senators defeat Miami Amigos 6-1 to capture their first championship.', tag: 'CHAMPIONSHIP', externalUrl: 'https://sfbl.com/valma-senators-claim-first-senior-30-plus-division-title-with-6-1-win-over-miami-amigos/', image: 'https://sfbl.com/wp-content/uploads/2019/12/S19-MASTERS-40-PLUS-FINALS-SENATORS-HOISTING-177x142.png' },
  { date: 'Jan 30, 2021', title: 'Miami Brewers Win Another Open 18+ Title 10-6', summary: 'Brewers defeat Delray Nationals for another 18+ Division championship.', tag: 'CHAMPIONSHIP', externalUrl: 'https://sfbl.com/miami-brewers-win-another-open-18-plus-division-title-10-6-over-delray-nationals/', image: 'https://sfbl.com/wp-content/uploads/2019/12/S19-OPEN-FINALS-BREWRS-TROPHIES-177x142.png' },
  { date: 'Jan 29, 2021', title: 'South Florida Baseball League — Baseball Heaven', summary: 'Video showcase of the SFBL experience.', tag: 'FEATURE', externalUrl: 'https://sfbl.com/awesome-video-south-florida-baseball-league-baseball-heaven/' },
];

export default function NewsPage() {
  const [filter, setFilter] = useState<string>('all');

  const tags = ['all', 'RECAP', 'CHAMPIONSHIP', 'SEASON', 'FEATURE'];
  const filtered = filter === 'all' ? NEWS_ITEMS : NEWS_ITEMS.filter(a => a.tag === filter);

  return (
    <section className="sec">
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="sec-eyebrow">Latest Updates</div>
        <h2 className="sec-title">News</h2>

        <div className="div-filter" style={{ marginTop: 20 }}>
          {tags.map(t => (
            <button key={t} className={`div-filter-btn ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>
              {t === 'all' ? 'All' : t}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map((item, i) => {
            const isExternal = item.externalUrl.startsWith('http');
            return (
              <a
                key={i}
                href={item.externalUrl}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                style={{
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                  background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12,
                  padding: 20, borderLeft: `4px solid ${item.tag === 'CHAMPIONSHIP' ? 'var(--accent)' : item.tag === 'SEASON' ? 'var(--green)' : item.tag === 'FEATURE' ? '#f59e0b' : 'var(--gold)'}`,
                  textDecoration: 'none', color: 'var(--white)', transition: 'all .15s',
                }}
              >
                {item.image && (
                  <img src={item.image} alt="" style={{ width: 100, height: 75, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
                      padding: '2px 7px', borderRadius: 3,
                      background: item.tag === 'CHAMPIONSHIP' ? 'rgba(200,16,46,.1)' : item.tag === 'SEASON' ? 'rgba(34,197,94,.1)' : item.tag === 'FEATURE' ? 'rgba(245,158,11,.1)' : 'var(--gold-dim)',
                      color: item.tag === 'CHAMPIONSHIP' ? 'var(--red)' : item.tag === 'SEASON' ? 'var(--green)' : item.tag === 'FEATURE' ? '#f59e0b' : 'var(--gold)',
                    }}>{item.tag}</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>{item.date}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 18, textTransform: 'uppercase', lineHeight: 1.15, marginBottom: 4 }}>
                    {item.title}
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.5 }}>{item.summary}</p>
                  {isExternal && <span style={{ fontSize: 10, color: 'var(--gold)', marginTop: 4, display: 'inline-block' }}>Read on sfbl.com &raquo;</span>}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
