import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { DarkModeProvider } from "@/components/DarkModeProvider";
import { Montserrat   } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import NavigationBar from "@/components/NavigationBar";

const font = Montserrat ({ subsets: ["cyrillic"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={
        cn(font.className, 'subpixel-antialiased min-h-full pt-12')
        }>
          <DarkModeProvider>
            <NavigationBar/>
            <Toaster/>
            {children}
          </DarkModeProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "BookishHub",
};