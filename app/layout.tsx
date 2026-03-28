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
