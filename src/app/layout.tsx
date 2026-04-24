import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Roboto } from "next/font/google";

import "./globals.css";

import { LayoutBase } from "./layout/LayoutBase/LayoutBase";

export const metadata: Metadata = {
  title: "DinDin",
  description: "Gestão de dados financeiros",
  icons: {
    icon: "/icon.svg",
  },
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <LayoutBase>{children}</LayoutBase>
        </ThemeProvider>
      </body>
    </html>
  );
}
