"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";

const PUBLIC_ROUTES = ["/login", "/register"];

export default function ClientLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  const isAuthPage = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    // Cookie içindeki token varlığını kontrol et
    const hasToken = document.cookie
      .split("; ")
      .some((row) => row.startsWith("token="));

    if (!hasToken && !isAuthPage) {
      setAuthorized(false);
      router.replace("/login");
    } else if (hasToken && isAuthPage) {
      router.replace("/");
    } else {
      setAuthorized(true);
    }
  }, [pathname, isAuthPage, router]);

  // Token yoksa ve korunan sayfadaysa yönlendirme bitene kadar ekranı basma
  if (!authorized && !isAuthPage) {
    return null;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {isAuthPage ? (
        <main className="w-full">{children}</main>
      ) : (
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full">
            <div className="p-4 md:hidden">
              <SidebarTrigger />
            </div>
            {children}
          </main>
        </SidebarProvider>
      )}
    </ThemeProvider>
  );
}
