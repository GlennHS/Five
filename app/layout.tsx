import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function FooterSpacer(){
  return (<div className="h-20"></div>)
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Navbar />
        <Footer />
        <FooterSpacer />
      </body>
    </html>
  );
}
