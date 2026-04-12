'use client';

import { Nunito, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AppProvider } from "./context/AppContext";
import { useEffect } from "react";
import Settings from "./lib/settings";

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
  useEffect(() => Settings.setup(), [])
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
        <AppProvider>
          {children}
        </AppProvider>
        <Navbar />
        <Footer />
        <FooterSpacer />
      </body>
    </html>
  );
}
