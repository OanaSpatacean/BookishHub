import { Language, LanguageSession, TextWriting } from "@prisma/client";
import React from "react";

type Props = 
{
  language: Language,
  languageSession: LanguageSession,
  reading: 
    {
    id: string;
    text: string;
    question: string;
    answer: string;
    choices: string;
    }[],
  text: TextWriting
}

const Reading = (props: Props) => {
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
                Reading
            </h1>

    </div>
  )
}

export default Reading;