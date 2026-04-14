import { ReactNode } from "react";
import { Header } from "@/app/components/Header/Header";
import { Footer } from "@/app/components/Footer/Footer";

type LayoutBaseProps = {
  children: ReactNode;
};

export const LayoutBase = ({ children }: LayoutBaseProps) => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-white dark:bg-[#202024] text-black dark:text-whit">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center">
        {children}
      </main>

      <Footer />
    </div>
  );
};
