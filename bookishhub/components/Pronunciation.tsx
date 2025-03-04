import { Language, LanguageSession } from "@prisma/client";
import React from "react";

type Props = 
{
  language: Language,
  languageSession: LanguageSession,
  pronunciationWords: 
    {
    id: string;
    word: string;
  }[]
}

const Pronunciation = ({ language, languageSession, pronunciationWords }: Props) => {
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
                Stage 4 - Pronunciation
            </h1>

    </div>
  )
}

export default Pronunciation;