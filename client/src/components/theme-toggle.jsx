"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

import { CiDark } from "react-icons/ci";
import { CiLight } from "react-icons/ci";
import { FaQuestionCircle } from "react-icons/fa";
import { Spinner } from "./ui/spinner";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <Button variant="outline">
        <Spinner />
      </Button>
    );

  return (
    <Button
      variant="outline"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <CiLight /> : <CiDark />}
    </Button>
  );
}
