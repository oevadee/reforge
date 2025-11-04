import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SessionProvider } from '@/components/SessionProvider';
import { Navigation } from '@/components/Navigation';
import { GlobalLayout } from '@/components/GlobalLayout';
import { GlobalStyles } from '@/components/GlobalStyles';
import EmotionRegistry from '@/app/emotion-registry';
import { getSession } from '@/lib/auth-utils';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Reforge - AI-Powered Habit Tracker',
  description: 'Build good habits, break bad ones, and reflect on daily progress with AI-powered insights.',
  keywords: ['habits', 'productivity', 'self-improvement', 'AI', 'tracking'],
  authors: [{ name: 'Reforge Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({
  children
}: RootLayoutProps): Promise<React.JSX.Element> {
  const session = await getSession();

  return (
    <html lang="en" className={inter.variable}>
      <body>
        <EmotionRegistry>
          <SessionProvider session={session}>
            <ThemeProvider>
              <GlobalStyles />
              <GlobalLayout>
                <Navigation />
                {children}
              </GlobalLayout>
            </ThemeProvider>
          </SessionProvider>
        </EmotionRegistry>
      </body>
    </html>
  );
}
