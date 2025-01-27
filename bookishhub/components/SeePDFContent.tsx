"use client"
import { useTheme } from "next-themes";
import React from "react";

type Props = 
{
    pdfURL: string
}

const SeePDFContent: React.FC<Props> = ({ pdfURL }) => {
    const { theme } = useTheme();
  
    return (
      <div className={`w-full h-full relative ${ theme === "dark" ? "bg-gray-900" : "bg-white" }`}>
        <iframe src={pdfURL} className={`w-full h-full`} style={{ filter: theme === "dark" ? "invert(1) hue-rotate(180deg)" : "none"}}></iframe>
      </div>
    )
  }
  
  export default SeePDFContent;