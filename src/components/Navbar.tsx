"use client";

import React from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-row items-center justify-between bg-blue-100 p-4 dark:bg-gray-800">
      <div>Test Capacitor App</div>
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          theme === "light" ? setTheme("dark") : setTheme("light")
        }
      >
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      </Button>
    </div>
  );
}
