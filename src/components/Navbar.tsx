'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DarkModeToggle from './DarkModeToggle';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/standings', label: 'Standings' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/teams', label: 'Teams' },
  { href: '/stats', label: 'Stats' },
  { href: '/leaders', label: 'Leaders' },
  { href: '/news', label: 'News' },
  { href: '/rules', label: 'Rules' },
];

const MORE_ITEMS = [
  { href: '/register', label: 'Register' },
  { href: '/pay-online', label: 'Pay Online' },
  { href: '/store', label: 'Store' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-brand">
          SFBL
        </Link>
        <ul className="nav-links">
          {NAV_ITEMS.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={pathname === item.href ? 'active' : ''}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li style={{ position: 'relative' }}>
            <span
              onClick={() => setMoreOpen(!moreOpen)}
              className={MORE_ITEMS.some(i => pathname === i.href) ? 'active' : ''}
              style={{ cursor: 'pointer' }}
            >
              More ▾
            </span>
            {moreOpen && (
              <div className="nav-dropdown">
                {MORE_ITEMS.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={pathname === item.href ? 'active' : ''}
                    onClick={() => setMoreOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </li>
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
        {[...NAV_ITEMS, ...MORE_ITEMS].map(item => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
}
