'use client';

import { Nunito, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AppProvider } from "./context/AppContext";
import { useEffect, useState } from "react";
import Settings from "./lib/settings";
import { ToastProvider } from "./context/ToastContext";
import VersionModal from "./components/VersionModal";

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
  const [showVersionModal, setShowVersionModal] = useState(false)
  const [didCheck, setDidCheck] = useState(false)

  useEffect(() => {
    if (didCheck) return

    Settings.setup() // Check if they're a new user, if so set them up

    const didUpgrade = Settings.upgrade()

    if (didUpgrade) {
      setShowVersionModal(true)
    }

    setDidCheck(true)
  }, [didCheck])

  useEffect(() => {
    const handleScroll = () => setIsScrolling(true)

    const handleScrollEnd = () => {
      setTimeout(() => setIsScrolling(false), 500)
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('scrollend', handleScrollEnd)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scrollend', handleScrollEnd)
    }
  }, [])

  const handleClose = () => setShowVersionModal(false)

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
            <AppProvider>
              <ToastProvider>
                { children }
                { showVersionModal && <VersionModal onClose={handleClose} /> }
              </ToastProvider>
            </AppProvider>
          </div>
        </div>
        <Navbar pageScrolled={isScrolling}/>
        <Footer />
        <FooterSpacer />
      </body>
    </html>
  );
}
