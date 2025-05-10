"use client";

import Link from 'next/link';
import { Dumbbell, PlusSquare, BarChartHorizontalBig, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';


const navItems = [
  { href: '/', label: 'Log Attendance', icon: PlusSquare },
  { href: '/view-report', label: 'View Report', icon: BarChartHorizontalBig },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const NavLinks = ({ isMobileLayout = false }: { isMobileLayout?: boolean }) => (
    navItems.map((item) => (
      <Button
        key={item.href}
        variant={pathname === item.href ? 'secondary' : 'ghost'}
        asChild
        className={cn(
          "justify-start",
          isMobileLayout ? "w-full text-lg py-3" : "text-sm",
          pathname === item.href && "font-semibold text-primary hover:text-primary"
        )}
        onClick={() => isMobileLayout && setMobileNavOpen(false)}
      >
        <Link href={item.href} className="flex items-center gap-2">
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
      </Button>
    ))
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2" onClick={() => setMobileNavOpen(false)}>
          <Dumbbell className="h-7 w-7 text-primary" />
          <span className="font-bold text-xl text-primary tracking-tight">FitFriend</span>
        </Link>
        
        {isMobile ? (
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs p-6">
              <div className="flex flex-col space-y-4 mt-6">
                <NavLinks isMobileLayout={true} />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex items-center space-x-2">
            <NavLinks />
          </nav>
        )}
      </div>
    </header>
  );
}
