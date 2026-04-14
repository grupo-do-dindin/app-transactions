"use client";

import { useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });
  const toggleTheme = () => {
    const newTheme = !dark;
    setDark(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      if (newTheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="
      w-8 h-8
      flex items-center justify-center
      rounded-full
      bg-white dark:bg-zinc-800
      shadow-md
      hover:shadow-lg
      transition-all duration-200
      text-l
    "
    >
      {dark ? "🌙" : "☀️"}
    </button>
  );
}
