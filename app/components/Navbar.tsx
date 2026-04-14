'use client';

import Link from 'next/link';
import { ChartColumnIncreasing, ChevronUp, Cog, House, ListChecks } from 'lucide-react'
import Image from 'next/image';
import { useState } from 'react';

type NavLinkProps = {
  href?: string
  ariaLabel?: string
  children?: React.ReactNode
};

function NavLink({ href = '#', ariaLabel, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="px-2 py-1 text-sm text-slate-900 hover:text-slate-700 flex flex-col items-center content-center"
    >
      {children}
    </Link>
  );
}

export default function Navbar({ pageScrolled } : { pageScrolled: boolean }) {
  const [isShowing, setIsShowing] = useState<boolean>(true)

  return (
    <>
      <nav className={`w-full border-t-2 bg-white border-slate-600 bg-neutral fixed bottom-0 left-0 h-20 flex flex-col justify-center items-center transition-opacity duration-300 ${isShowing && !pageScrolled ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="w-full flex flex-col items-center gap-2 px-4 py-2">
          <div className="w-full">
            <ul className="h-full flex items-center justify-between text-base gap-4">
              <li>
                <NavLink
                  href="/"
                  aria-label="Go to home"
                >
                  <House />
                  <span>Home</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  href="/track"
                  aria-label="Go to track"
                >
                  <ListChecks />
                  <span>Track</span>
                </NavLink>
              </li>

              <li>
                <Image
                  src="/images/icons/five-icon-64.png"
                  width={64}
                  height={64}
                  alt="App logo"
                  className="h-10 w-auto block object-cover"
                  onClick={() => setIsShowing(false)}
                />
              </li>

              <li>
                <NavLink
                  href="/metrics"
                  aria-label="Go to metrics"
                >
                  <ChartColumnIncreasing />
                  <span>Metrics</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  href="/settings"
                  aria-label="Go to settings"
                >
                  <Cog />
                  <span>Settings</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <nav
        className={`w-full fixed bottom-0 left-0 flex flex-col justify-center items-center transition-opacity duration-300 ${isShowing && !pageScrolled ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}`}
        onClick={() => setIsShowing(true)}
      >
        <div className='bg-white border border-gray-400 px-2 py-1 flex flex-col justify-center items-center'>
          <ChevronUp size={12} strokeWidth={4}/>
          <Image
            src='/images/icons/five-icon-128.png'
            alt='Navigation icon'
            width={24}
            height={24}
          />
        </div>
      </nav>
    </>
  );
}

