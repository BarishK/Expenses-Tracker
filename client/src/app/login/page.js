"use client";
import { useState } from "react";
import { login } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { delay } from "@/lib/delay";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });

      // Yanıttan token dönüyorsa cookie'yi istemci tarafında garantiye al
      if (res?.data?.token) {
        document.cookie = `token=${res.data.token}; path=/; max-age=3600; SameSite=None; Secure`;
      }

      toast.success("Sign in successful. Redirecting...", {
        position: "top-center",
      });

      await delay(1000);

      // SPA yönlendirmesi yerine tam sayfa yönlendirmesi yapılarak cookie sıfırlanır
      window.location.href = "/";
    } catch (error) {
      toast.error("Incorrect email or password", { position: "top-center" });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-muted/20 px-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access your financial dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full mt-2">
              Sign In
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <a
              href="/register"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
