'use client';

import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-bg/95 backdrop-blur-md border-b border-border"
      aria-label="Primary navigation"
    >
      <div className="mx-auto w-full max-w-content px-5 sm:px-8 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          {/* Brand — N monogram */}
          <Link
            href="#home"
            aria-label="Home"
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
              <span className="font-mono font-bold text-xs text-ivory">N</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex lg:items-center lg:gap-8"
            aria-label="Desktop navigation"
          >
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted transition-colors duration-200 ease-out-soft hover:text-fg"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="#contact"
              className="inline-flex h-9 items-center justify-center rounded-full border border-accent bg-transparent px-4 text-xs font-medium text-accent transition-colors duration-200 ease-out-soft hover:bg-accent hover:text-ivory"
              onClick={() => setOpen(false)}
            >
              Get in Touch
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-fg"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <nav
        id="mobile-menu"
        className={`lg:hidden bg-surface border-b border-border overflow-hidden transition-all duration-300 ease-out-soft ${
          open ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!open}
      >
        <div className="px-5 py-6 space-y-3">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block text-sm font-medium text-muted hover:text-fg transition-colors duration-200 ease-out-soft"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="#contact"
            className="block inline-flex h-10 w-full items-center justify-center rounded-full border border-accent text-xs font-medium text-accent transition-colors duration-200 ease-out-soft hover:bg-accent hover:text-ivory"
            onClick={() => setOpen(false)}
          >
            Get in Touch
          </Link>
        </div>
      </nav>
    </header>
  );
}
