'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ChartColumnIncreasing, Cog, House, ListChecks } from 'lucide-react'

interface NavLinkProps {
  href?: string
  ariaLabel?: string
  children?: React.ReactNode
  isActive?: boolean
}
interface NavbarProps {
  pageScrolledToTop: boolean,
  scrollDirection: 'up' | 'down' | null
}

function NavLink({ href = '#', ariaLabel, children, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`px-2 py-1 text-sm flex flex-col items-center content-center ${
        isActive ? 'text-pink-500' : 'text-slate-900 hover:text-slate-700'
      }`}
    >
      {children}
    </Link>
  );
}

export default function Navbar({ pageScrolledToTop, scrollDirection } : NavbarProps) {
  const pathname = usePathname();

  const [isScrollable, setIsScrollable] = useState(false)
  const isVisible = !isScrollable || pageScrolledToTop || scrollDirection === 'up'

  useEffect(() => {
    const checkScrollable = () => {
      const scrollable = document.documentElement.scrollHeight > window.innerHeight;
      setIsScrollable(scrollable);
    };

    const id = setTimeout(checkScrollable, 500);

    window.addEventListener('resize', checkScrollable);

    return () => {
      clearTimeout(id);
      window.removeEventListener('resize', checkScrollable);
    };
  }, []);

  return (
    <>
      <nav className={`w-full border-t-2 bg-white border-slate-600 bg-neutral fixed bottom-0 left-0 h-20 z-50 flex flex-col justify-center items-center transition-opacity duration-300 ${isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="w-full flex flex-col items-center gap-2 px-4 py-2">
          <div className="w-full">
            <ul className="h-full flex items-center justify-between text-base gap-4">
              <li>
                <NavLink
                  href="/"
                  aria-label="Go to home"
                >
                  <House className={pathname === '/' ? 'text-mind' : ''} />
                  <span className={pathname === '/' ? 'text-mind' : ''}>Home</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  href="/track"
                  aria-label="Go to track"
                >
                  <ListChecks className={pathname === '/track' ? 'text-body' : ''}/>
                  <span className={pathname === '/track' ? 'text-body' : ''}>Track</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  href="/"
                  aria-label="Go to home"
                >
                  <Image
                    src="/images/icons/five-icon-64.png"
                    width={64}
                    height={64}
                    alt="App logo"
                    className="h-10 w-auto block object-cover"
                  />
                </NavLink>
              </li>

              <li>
                <NavLink
                  href="/metrics"
                  aria-label="Go to metrics"
                >
                  <ChartColumnIncreasing className={/\/metrics/.test(pathname) ? 'text-cash' : ''}/>
                  <span className={/\/metrics/.test(pathname) ? 'text-cash' : ''}>Metrics</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  href="/settings"
                  aria-label="Go to settings"
                >
                  <Cog className={/\/settings/.test(pathname) ? 'text-work' : ''}/>
                  <span className={/\/settings/.test(pathname) ? 'text-work' : ''}>Settings</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

