import { Language } from "@prisma/client";
import { LanguageSession } from "@prisma/client";
import React from "react";

type Props = 
{
  language: Language,
  languageSession: LanguageSession
}

const Writing = ({ language, languageSession }: Props) => {
  return (
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

    </div>
  )
}

export default Writing;