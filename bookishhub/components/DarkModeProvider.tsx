"use client"
import {QueryClientProvider, QueryClient} from "@tanstack/react-query"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import * as React from "react"

const qClient = new QueryClient();

export function DarkModeProvider({ children, ...props }: ThemeProviderProps) {
  return (<QueryClientProvider client={qClient}><NextThemesProvider defaultTheme="system" enableSystem attribute="class" {...props}>
    {children}
    </NextThemesProvider></QueryClientProvider>)
}
