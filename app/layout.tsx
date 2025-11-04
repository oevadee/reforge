import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import EmotionRegistry from "@/app/emotion-registry";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GlobalStyles } from "@/components/GlobalStyles";
import { SessionProvider } from "@/components/SessionProvider";
import { getSession } from "@/lib/auth-utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reforge",
  description: "A personal development and habit tracking app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<React.JSX.Element> {
  const session = await getSession();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionProvider session={session}>
          <EmotionRegistry>
            <ThemeProvider>
              <GlobalStyles />
              {children}
            </ThemeProvider>
          </EmotionRegistry>
        </SessionProvider>
      </body>
    </html>
  );
}
