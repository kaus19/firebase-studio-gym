import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono'; // Removed as it's not found and not currently used
import './globals.css';
import Header from '@/components/layout/Header';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'FitTomodachi - Gym Attendance Tracker',
  description: 'Log your gym sessions and share progress with friends.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} font-sans antialiased`}> {/* Removed GeistMono.variable */}
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="py-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} FitTomodachi. Stay Active!
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
