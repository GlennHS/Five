'use client'

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import AnalyticsBanner from "./AnalyticsBanner";
import Footer from "./Footer";
import { NextStep } from "nextstepjs";
import { Settings } from "../lib/settings";
import steps from "../tour";

export default function LayoutClientComponent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [scrolledToTop, setScrolledToTop] = useState<boolean>(true);

  useEffect(() => {
    let lastY = window.scrollY

    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastY;

      if (Math.abs(diff) < 5) return; // ignore tiny movements

      if (currentY > lastY) {
        setScrollDirection('down')
      } else if (currentY < lastY) {
        setScrollDirection('up')
      }

      lastY = currentY;
    };
    const handleScrollEnd = () => setScrolledToTop(window.scrollY === 0)

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scrollend', handleScrollEnd)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scrollend', handleScrollEnd)
    }
  }, []);

  return (
    <NextStep
      steps={steps}
      onStart={() => Settings.set("wantsTutorial", "inProgress")}
      onComplete={() => Settings.set('wantsTutorial', 'false')}
      onSkip={() => Settings.set('wantsTutorial', 'false')}
    >
      <AnalyticsBanner />
      { children }
      <Navbar pageScrolledToTop={scrolledToTop} scrollDirection={scrollDirection}/>
      <Footer />
    </NextStep>
  )
}