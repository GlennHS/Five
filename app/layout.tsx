import { Nunito, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AppProvider } from "./context/AppContext";

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
  return (
    <html lang="en" className={nunito.className}>
      <head>
        <title>FIVE! Love Yourself</title>
      </head>
      <link rel="apple-touch-icon" sizes="256x256" href="/images/icons/five-icon-256.png" />
      <link rel="apple-touch-icon" sizes="128x128" href="/images/icons/five-icon-128.png" />
      <link rel="apple-touch-icon" sizes="64x64" href="/images/icons/five-icon-64.png" />
      <link rel="icon" href="/images/icons/five-icon.png" sizes="any" />
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
