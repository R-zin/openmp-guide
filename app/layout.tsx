import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import 'katex/dist/katex.min.css';
import { AppShell } from '@/components/layout/AppShell';
import { getSearchIndex } from '@/lib/content';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Parallel Programming Study Guide // MPI & OpenMP',
  description: 'Complete, deployable study guide for parallel programming covering MPI and OpenMP for undergraduate lab exam preparation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchItems = getSearchIndex();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAFAFC] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7]">
        <AppShell searchItems={searchItems}>{children}</AppShell>
      </body>
    </html>
  );
}
