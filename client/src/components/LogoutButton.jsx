import { logout } from "@/services/authService";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login"); // Login sayfasına geri at
      router.refresh(); // Middleware'in cookie'nin silindiğini anlaması için
    } catch (error) {
      console.error("Çıkış yaparken hata oluştu", error);
    }
  };

  return (
    <Button className="cursor-pointer" onClick={handleLogout}>
      Log out
    </Button>
  );
}
