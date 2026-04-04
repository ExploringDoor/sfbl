'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DarkModeToggle from './DarkModeToggle';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/standings', label: 'Standings' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/scores', label: 'Scores' },
  { href: '/teams', label: 'Teams' },
  { href: '/stats', label: 'Stats', children: [
    { href: '/stats', label: 'Batting Stats' },
    { href: '/leaders', label: 'Leaders' },
  ]},
  { href: '/news', label: 'News' },
  { href: '/register', label: 'Register' },
  { href: '/store', label: 'Store' },
  { href: '/rules', label: 'Rules' },
  { href: '/contact', label: 'Contact' },
];

const MOBILE_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/standings', label: 'Standings' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/scores', label: 'Scores' },
  { href: '/teams', label: 'Teams' },
  { href: '/stats', label: 'Stats' },
  { href: '/leaders', label: 'Leaders' },
  { href: '/news', label: 'News' },
  { href: '/register', label: 'Register' },
  { href: '/store', label: 'Store' },
  { href: '/pay-online', label: 'Pay Online' },
  { href: '/rules', label: 'Rules' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-brand">SFBL</Link>
        <ul className="nav-links">
          {NAV_ITEMS.map(item => (
            <li key={item.href + item.label} style={{ position: 'relative' }}>
              {item.children ? (
                <>
                  <a
                    onClick={(e) => { e.preventDefault(); setStatsOpen(!statsOpen); }}
                    href="#"
                    className={['/stats', '/leaders'].includes(pathname) ? 'active' : ''}
                  >
                    {item.label} <span style={{ fontSize: 8, marginLeft: 2 }}>&#9660;</span>
                  </a>
                  {statsOpen && (
                    <div className="nav-dropdown">
                      {item.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={pathname === child.href ? 'active' : ''}
                          onClick={() => setStatsOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={pathname === item.href ? 'active' : ''}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <DarkModeToggle />
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div className={`mob-menu ${menuOpen ? 'open' : ''}`}>
        {MOBILE_ITEMS.map(item => (
          <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
}
