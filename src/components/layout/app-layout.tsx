'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/layout/sidebar-nav';
import Header from '@/components/layout/header';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import LoginPage from '@/app/login/page';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && isAuthenticated === false && pathname !== '/login') {
      router.push('/login');
    }
  }, [isAuthenticated, pathname, router, isClient]);

  if (!isClient || isAuthenticated === undefined) {
    return null; 
  }
  
  if (!isAuthenticated) {
      return <LoginPage />
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <Header />
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
