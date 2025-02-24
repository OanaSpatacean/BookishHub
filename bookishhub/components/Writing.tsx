import { Language } from "@prisma/client";
import { LanguageSession } from "@prisma/client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "./ui/button";

type Props = 
{
  language: Language,
  languageSession: LanguageSession
  }

const Writing = ({ language, languageSession }: Props) => {
  return (
    <div className="w-full">
      <div className="">
              <h1 className="sm:text-3xl 
                            text-left 
                            font-bold 
                            text-3xl 
                            underline 
                            decoration-4 
                            decoration-purple-400 
                            mb-5">
                  Stage 3 - Writing
              </h1>

              <div className="w-full 
                              mb-5 
                              border 
                              shadow-lg 
                              border-stone-200 
                              px-16 
                              rounded-lg 
                              py-8">
                                
              </div>

              <div className="w-full 
                              flex 
                              justify-between 
                              items-center 
                              mb-4">                
                  <Link href={`/language/${language.id}/${languageSession.id}/rephrasing`} className={`${buttonVariants({ className: "flex items-center font-semibold bg-purple-500 hover:bg-purple-800" })}`}>
                      <ArrowLeft strokeWidth={5} className="ml-1 
                                                              h-3 
                                                              w-3"/>
                      Return to the previous stage
                  </Link>

                  <Link href={`/language/${language.id}/${languageSession.id}/pronunciation`} className={`${buttonVariants({ className: "flex items-center font-semibold bg-purple-500 hover:bg-purple-800" })}`}>    
                      Go to the next stage
                      <ArrowRight strokeWidth={5} className="ml-1 
                                                              h-3 
                                                              w-3"/>
                  </Link>
            </div>
      </div>
    </div>
  )
}

export default Writing;