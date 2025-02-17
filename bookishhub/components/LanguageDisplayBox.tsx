"use client";
import { Language } from '@prisma/client';
import Link from "next/link";
import React from "react";
import { FaLanguage } from 'react-icons/fa6';

type Props = {language:Language};

const LanguagesDisplayBox = ({ language }: Props) => {

    return (
        <div className="rounded-lg 
                        border 
                        p-3 
                        flex 
                        bg-gray-50
                        dark:bg-gray-900">
            <Link href={`/language/${language.id}`} className="relative">
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
                                 justify-between" href={`/language/${language.id}`}>
                    <h3 className="text-primary 
                                   truncate 
                                   font-semibold 
                                   text-3xl">
                        {language.name}
                    </h3>

                    <FaLanguage className="text-3xl 
                                           text-primary" />
                </Link>
            </div>
        </div>
    )
}

export default LanguagesDisplayBox;
