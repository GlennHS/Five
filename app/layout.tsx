'use client';

import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { AppProvider } from "./context/AppContext";
import { useEffect, useState } from "react";
import { ToastProvider } from "./context/ToastContext";
import { NextStep, NextStepProvider } from "nextstepjs";
import steps from "./tour";
import { Settings } from "./lib/settings";
import AnalyticsBanner from "./components/AnalyticsBanner";
import dynamic from "next/dynamic";

const jakarta = Plus_Jakarta_Sans({
  weight: '400',
  subsets: ['latin']
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [scrolledToTop, setScrolledToTop] = useState<boolean>(true);
  const [loadedConsent, setLoadedConsent] = useState<boolean>(false);
  const [givenConsent, setGivenConsent] = useState<boolean | null>(null);

  const Analytics = dynamic(
    () => import('@vercel/analytics/next').then(mod => mod.Analytics),
    { ssr: false }
  )

  const handleConsent = (gaveConsent: boolean): void => {
    window.cookieStore.set('analytics-consent', `${gaveConsent ? 'yes' : 'no'}`)
    setGivenConsent(true)
  }

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

  useEffect(() => {
    window.cookieStore.get('analytics-consent').then(res => {
      if (res?.value === 'yes') setGivenConsent(true)
      else if (res?.value === 'no') setGivenConsent(false)
    }).then(() => setLoadedConsent(true))
  }, [])

  return (
    <html lang="en" className={jakarta.className}>
      <head>
        <title>FIVE! Love Yourself</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link rel="apple-touch-icon" sizes="128x128" href="/images/icons/five-app-icon-128.png" />
        <link rel="apple-touch-icon" sizes="64x64" href="/images/icons/five-app-icon-64.png" />
        <link rel="icon" href="/images/icons/five-icon-256.png" sizes="any" />
      </head>
      <body>
        { givenConsent && <Analytics />}
        <div className="w-full flex flex-col justify-baseline items-center">
          <div className="max-w-3xl w-full p-4">
            <NextStepProvider>
              <AppProvider>
                <ToastProvider>
                  <NextStep
                    steps={steps}
                    onStart={() => Settings.set("wantsTutorial", "inProgress")}
                    onComplete={() => Settings.set('wantsTutorial', 'false')}
                    onSkip={() => Settings.set('wantsTutorial', 'false')}
                  >
                    { givenConsent === null && loadedConsent && <AnalyticsBanner consentHandler={handleConsent} /> }
                    { children }
                  </NextStep>
                </ToastProvider>
              </AppProvider>
            </NextStepProvider>
          </div>
        </div>
        <Navbar pageScrolledToTop={scrolledToTop} scrollDirection={scrollDirection}/>
        <Footer />
      </body>
    </html>
  );
}
