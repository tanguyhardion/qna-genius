import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Q&A Genius",
  description:
    "Générez des quiz interactifs à partir d'articles et améliorez votre apprentissage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PDRK18J638"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PDRK18J638');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
              fontSize: "14px",
              fontWeight: "500",
              borderRadius: "8px",
              padding: "16px",
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            },
            success: {
              duration: 3000,
              style: {
                background: "#059669",
                color: "#fff",
                border: "2px solid #10b981",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#059669",
              },
            },
            error: {
              duration: 6000,
              style: {
                background: "#dc2626",
                color: "#fff",
                border: "2px solid #ef4444",
                fontSize: "15px",
                fontWeight: "600",
                minWidth: "400px",
                maxWidth: "600px",
                padding: "18px 20px",
                boxShadow:
                  "0 20px 25px -5px rgba(220, 38, 38, 0.2), 0 10px 10px -5px rgba(220, 38, 38, 0.1)",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#dc2626",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
