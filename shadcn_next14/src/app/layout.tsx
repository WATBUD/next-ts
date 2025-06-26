import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

import { Inter as FontSans } from "next/font/google"
 
import { cn } from "@/lib/utils"
import AnimatedFavicon from '../common/animated-favicon';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "LanguageTool",
  description: `
  這是一個語言學習工具，提供多語翻譯=>提字卡/記事本/語音翻譯/自定義複製語系功能，幫助您輕鬆學習不同語言。作者工作繁忙但會不斷更新與改善這個工具，致力於讓大家都能體驗到更好的產品
  This is a language learning tool that offers multi-language translations, flashcards, a notebook, voice translation, and customizable copy language features to help you learn different languages effortlessly. Despite a busy schedule, the developer is committed to continuously updating and improving the tool to provide everyone with a better experience.
  `,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <head>
        <link rel="icon" href="/Boli.gif" type="image/gif" />
      </head> */}
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
      <AnimatedFavicon />
      {children}
      </body>

      {/* <body className={inter.className}>{children}</body> */}
    </html>
  );
}
