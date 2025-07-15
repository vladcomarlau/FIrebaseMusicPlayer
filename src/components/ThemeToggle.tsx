
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full h-10 w-10"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-75 dark:rotate-0 dark:scale-100" />
      <Moon className="h-4 w-4 rotate-0 scale-100 transition-all duration-75 dark:-rotate-90 dark:scale-0 [filter:drop-shadow(0_0_1px_hsl(var(--foreground)/0.3))] dark:[filter:drop-shadow(0_0_1px_hsl(var(--primary)/0.8))]" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
