"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient();
export function DarkModeProvider({ children, ...props }: ThemeProviderProps) 
{
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider {...props} enableSystem defaultTheme="system" attribute="class">
          <SessionProvider>
            {children}
          </SessionProvider>
        </NextThemesProvider>
      </QueryClientProvider>
    )
  } catch (error) {
    console.error('Error DarkModeProvider:', error);
  }
}