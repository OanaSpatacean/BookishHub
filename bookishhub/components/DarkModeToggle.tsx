"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu"
import { Moon, Sun } from "lucide-react"
import * as React from "react"
import { useTheme } from "next-themes"

export function DarkModeToggle({className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  const { setTheme } = useTheme()

  return (
    <div className="className" {...props}>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                    <Sun className="transition-all 
                                    dark:scale-0 
                                    dark:-rotate-90 
                                    w-[1.2rem] 
                                    h-[1.2rem] 
                                    rotate-0 
                                    scale-100"/>
                    <Moon className="transition-all 
                                    scale-0 
                                    rotate-90 
                                    w-[1.2rem] 
                                    h-[1.2rem] 
                                    absolute 
                                    dark:scale-100 
                                    dark:rotate-0" />
                    <span className="sr-only">Dark mode toggle</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )
}
