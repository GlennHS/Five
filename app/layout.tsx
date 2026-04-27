import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./context/AppContext";
import { ToastProvider } from "./context/ToastContext";
import { NextStep, NextStepProvider } from "nextstepjs";
import steps from "./tour";
import { Settings } from "./lib/settings";
import { ConsentProvider } from "./context/ConsentContext";
import LayoutClientComponent from "./components/LayoutClientComponent";

const jakarta = Plus_Jakarta_Sans({
  weight: '400',
  subsets: ['latin']
})

export const metadata = {
  title: "FIVE",
  description: "FIVE is a self-care mobile app for habit tracking and self-improvement",
  openGraph: {
    title: "FIVE",
    description: "FIVE is a self-care mobile app for habit tracking and self-improvement",
    url: "https://fivefitness.uk/images/og-image.png",
    siteName: "FIVE",
    images: [
      {
        url: "https://fivefitness.uk/images/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIVE",
    description: "FIVE is a self-care mobile app for habit tracking and self-improvement",
    images: ["https://fivefitness.uk/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <div className="w-full flex flex-col justify-baseline items-center">
          <div className="max-w-3xl w-full p-4">
          <ToastProvider>
            <ConsentProvider>
              <NextStepProvider>
                <AppProvider>
                  <LayoutClientComponent>
                    { children }
                  </LayoutClientComponent>
                </AppProvider>
              </NextStepProvider>
            </ConsentProvider>
          </ToastProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
