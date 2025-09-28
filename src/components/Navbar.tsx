"use client";

import React from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-row items-center justify-between bg-blue-100 p-4 dark:bg-gray-800">
      <div>Navbar goes here</div>
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          theme === "light" ? setTheme("dark") : setTheme("light")
        }
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    </div>
  );
}
