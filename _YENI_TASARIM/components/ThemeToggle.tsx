import React, { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "../lib/utils"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  // Initialize state based on localStorage
  // CHANGED: Default is now explicitly Light Mode (Hell Mode) if no saved preference found.
  // We ignore system preference (window.matchMedia) to force the requested "Hell Mode" on first load.
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      // Default to false (Light Mode)
      return false;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <div
      className={cn(
        "flex w-20 h-9 p-1.5 rounded-full cursor-pointer transition-all duration-500 items-center select-none shadow-inner border",
        isDark 
          ? "bg-zinc-800 border-zinc-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" 
          : "bg-gray-200 border-gray-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]",
        className
      )}
      onClick={() => setIsDark(!isDark)}
      role="button"
      tabIndex={0}
      aria-label="Toggle Dark Mode"
    >
      <div className="relative w-full h-full flex items-center justify-between">
         {/* Moving Thumb */}
        <div
          className={cn(
            "absolute top-0 left-0 bottom-0 my-auto flex justify-center items-center w-6 h-6 rounded-full transition-all duration-500 ease-out shadow-lg z-10 border",
            isDark 
              ? "transform translate-x-11 bg-zinc-950 border-zinc-600 shadow-brand-orange/20" 
              : "transform translate-x-0 bg-white border-white shadow-gray-400/50"
          )}
        >
          {isDark ? (
            <Moon 
              className="w-3.5 h-3.5 text-brand-orange fill-brand-orange/20" 
              strokeWidth={2}
            />
          ) : (
            <Sun 
              className="w-3.5 h-3.5 text-brand-orange fill-brand-orange/20" 
              strokeWidth={2}
            />
          )}
        </div>

        {/* Background Icons (Stationary Guides) */}
        <div className="w-full flex justify-between px-1.5 items-center h-full">
            <Sun className={cn("w-3.5 h-3.5 transition-all duration-300", isDark ? "opacity-30 text-gray-500 scale-75" : "opacity-0 scale-50")} />
            <Moon className={cn("w-3.5 h-3.5 transition-all duration-300", isDark ? "opacity-0 scale-50" : "opacity-30 text-gray-400 scale-75")} />
        </div>
      </div>
    </div>
  )
}