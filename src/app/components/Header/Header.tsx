"use client";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
  return (
    <header className="w-full h-20  flex items-center justify-between px-20 py-6 dark:bg-[#121214] bg-[#d1fae5]">
      <div className="flex items-center gap-2">
        <Image src="/icon.svg" alt="Logo" width={50} height={50} />{" "}
        <span className="font-medium text-green-800 dark:text-green-200">
          DinDin
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="
            inline-flex items-center justify-center
            px-6 py-2
            rounded-md
            text-white
            bg-green-700
            hover:bg-green-800
            active:bg-green-900
            transition
            focus:outline-none
            focus:ring-2
            focus:ring-green-400
            focus:ring-offset-2
            font-medium
          "
        >
          Nova transação
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
};
