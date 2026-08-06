"use client";

import { logout } from "@/services/authService";
import { Button } from "./ui/button";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      // 1. Backend'e logout isteği at
      await logout();
    } catch (error) {
      console.error("Çıkış yaparken hata oluştu", error);
    } finally {
      // 2. Client tarafındaki cookie'yi sil
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=None; Secure";

      // 3. ClientLayout kilitlenmesini kırmak için tam sayfa yönlendirmesi yap
      window.location.href = "/login";
    }
  };

  return (
    <Button className="cursor-pointer" onClick={handleLogout}>
      Log out
    </Button>
  );
}
