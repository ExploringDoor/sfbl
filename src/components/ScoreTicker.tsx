'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, useRef } from 'react';
import { GAMES, calculateStandings } from '@/lib/games';
import { getTeam } from '@/lib/teams';
import Link from 'next/link';

export default function ScoreTicker() {
  const [hidden, setHidden] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          setHidden(y > 10);
          const nav = document.querySelector('.nav') as HTMLElement;
          if (nav) {
            nav.style.top = y > 10 ? '0px' : '48px';
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    const nav = document.querySelector('.nav') as HTMLElement;
    if (nav) nav.style.top = '48px';
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Drag-to-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      startX.current = e.pageX - el.offsetLeft;
      scrollLeft.current = el.scrollLeft;
      el.style.cursor = 'grabbing';
    };
    const onMouseUp = () => {
      isDragging.current = false;
      el.style.cursor = 'grab';
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX.current) * 2;
      el.scrollLeft = scrollLeft.current - walk;
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousemove', onMouseMove);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const standings = calculateStandings();
  const recentGames = GAMES
    .filter(g => g.status === 'final')
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 20);

  const formatRec = (teamId: string) => {
    const s = standings[teamId];
    if (!s) return '';
    return `(${s.wins}-${s.losses})`;
  };

  const formatDate = (date: string) => {
    const d = new Date(date + 'T12:00:00');
    return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
  };

  return (
    <div
      id="score-ticker"
      style={{
        transform: hidden ? 'translateY(-100%)' : undefined,
        opacity: hidden ? 0 : undefined,
        pointerEvents: hidden ? 'none' : undefined,
      }}
    >
      <div className="st-label">
        SFBL <span style={{ color: 'rgba(255,255,255,.5)', fontWeight: 400 }}>2026</span>
      </div>
      <div className="st-scroll" ref={scrollRef} style={{ cursor: 'grab', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <div className="st-track">
          {recentGames.map(g => {
            const away = getTeam(g.awayTeam);
            const home = getTeam(g.homeTeam);
            if (!away || !home || g.awayScore === null || g.homeScore === null) return null;
            const awayWon = g.awayScore > g.homeScore;

            return (
              <div className="st-game" key={g.id} onClick={() => window.location.href = `/scores?game=${g.id}`}>
                <div className="st-game-inner">
                  <div className="st-datetime">{formatDate(g.date)} &middot; Final</div>
                  <div className="st-row">
                    <span className={`st-abbr ${awayWon ? 'winner' : 'loser'}`}>{away.abbr}</span>
                    <span className="st-rec">{formatRec(away.id)}</span>
                    <span className={`st-score ${awayWon ? 'winner' : 'loser'}`}>{g.awayScore}</span>
                  </div>
                  <div className="st-row">
                    <span className={`st-abbr ${!awayWon ? 'winner' : 'loser'}`}>{home.abbr}</span>
                    <span className="st-rec">{formatRec(home.id)}</span>
                    <span className={`st-score ${!awayWon ? 'winner' : 'loser'}`}>{g.homeScore}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Link href="/schedule" className="st-full">
        Full Schedule &raquo;
      </Link>
    </div>
  );
}
