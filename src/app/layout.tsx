import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Roboto } from "next/font/google";

import "./globals.css";

import { LayoutBase } from "./layout/LayoutBase/LayoutBase";

export const metadata: Metadata = {
  title: "dindin",
  description: "Gestão de dados financeiros",
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
    <html lang="en" className={roboto.variable}>
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
