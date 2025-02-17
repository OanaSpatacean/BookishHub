"use client";
import { Language, LanguageSession } from '@prisma/client';
import Link from "next/link";
import React from "react";
import { SiVitest } from "react-icons/si";

type Props = {language:Language, languageSession:LanguageSession};

const LanguageSessionDisplayBox = ({ language, languageSession }: Props) => {

    return (
        <div className="rounded-lg 
                        border 
                        p-3 
                        flex 
                        bg-gray-50
                        dark:bg-gray-900
                        hover:bg-gray-200
                        dark:hover:bg-gray-800">
            <Link href={`/language/${language.id}/${languageSession.id}/`} className="relative">
            </Link>

            <div className="flex 
                            flex-grow 
                            justify-between  
                            items-center     /
                            ml-8
                            mr-8 
                            flex-row 
                            w-full">  
                <Link className="mb-2 
                                 flex 
                                 w-full
                                 justify-between" href={`/language/${language.id}/${languageSession.id}`}>
                    <h3 className="text-primary 
                                   truncate 
                                   font-semibold 
                                   text-3xl">
                        Session {languageSession.id} - {languageSession.level}
                    </h3>

                    <SiVitest className="text-3xl 
                                         text-primary" />
                </Link>
            </div>
        </div>
    )
}

export default LanguageSessionDisplayBox;
