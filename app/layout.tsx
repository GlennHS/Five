'use client';

import { Nunito, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AppProvider } from "./context/AppContext";
import { useEffect, useState } from "react";
import { ToastProvider } from "./context/ToastContext";
import { NextStep, NextStepProvider } from "nextstepjs";
import steps from "./tour";
import { Settings } from "./lib/settings";

function FooterSpacer(){
  return (<div className="h-20"></div>)
}

const nunito = Nunito({
  weight: '400',
  subsets: ['latin']
})

const inter = Inter({
  weight: '400',
  subsets: ['latin']
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);

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
    const handleScrollEnd = () => setIsScrolling(false)

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scrollend', handleScrollEnd)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scrollend', handleScrollEnd)
    }
  }, []);

  return (
    <html lang="en" className={nunito.className}>
      <head>
        <title>FIVE! Love Yourself</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link rel="apple-touch-icon" sizes="256x256" href="/images/icons/five-app-icon-256.png" />
        <link rel="apple-touch-icon" sizes="128x128" href="/images/icons/five-app-icon-128.png" />
        <link rel="apple-touch-icon" sizes="64x64" href="/images/icons/five-app-icon-64.png" />
        <link rel="icon" href="/images/icons/five-icon-256.png" sizes="any" />
      </head>
      <body>
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
                    { children }
                  </NextStep>
                </ToastProvider>
              </AppProvider>
            </NextStepProvider>
          </div>
        </div>
        <Navbar pageScrolled={isScrolling} scrollDirection={scrollDirection}/>
        <Footer />
        <FooterSpacer />
      </body>
    </html>
  );
}
