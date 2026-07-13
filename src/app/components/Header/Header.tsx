"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useModalStore } from "@/app/store/useModalStore";
import { Button } from "@grupo-do-dindin/design-system";

export const Header = () => {
  const openModal = useModalStore((state) => state.open);
  const pathname = usePathname();
  const isDashboard = pathname === "/";

  return (
    <header className="w-full h-20  flex items-center justify-between px-20 py-6 dark:bg-[#121214] bg-[#d1fae5]">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/icon.svg" alt="Logo" width={50} height={50} />{" "}
        <span className="font-medium text-green-800 dark:text-green-200">
          DinDin
        </span>
      </Link>
      <div className="flex items-center gap-2">
        {isDashboard && <Button onClick={openModal}>Nova transação</Button>}
        <ThemeToggle />
      </div>
    </header>
  );
};
