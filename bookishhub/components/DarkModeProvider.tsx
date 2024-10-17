"use client"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import * as React from "react"

export function DarkModeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider defaultTheme="system" enableSystem attribute="class" {...props}>
    {children}
    </NextThemesProvider>
}
