"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

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
