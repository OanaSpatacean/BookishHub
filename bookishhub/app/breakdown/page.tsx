import PDFDrop from '@/components/PDFDrop';
import { getAuthSession } from '@/lib/authentication';
import verifyMembership from '@/lib/membership';
import { ArrowRight, InfoIcon } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useState } from 'react'

type Props = {}

const PDFBreakdown = async (props: Props) => {
    const session = await getAuthSession();

    if(!session?.user){ 
        return redirect('/');
    }

    const havePowerAccount = verifyMembership();
    
    return (
        <div className="max-w-7xl 
                        mx-auto  
                        py-8">
            <div className="text-center 
                            mb-7">
                    <h1 className="sm:text-5xl 
                                    text-left 
                                    font-bold 
                                    text-3xl 
                                    underline 
                                    decoration-4 
                                    decoration-purple-500">
                        Break down your PDFs
                    </h1>
                    <Link href="/PDFrequests" className="mt-9
                                                        inline-block 
                                                        text-white 
                                                        transition 
                                                        bg-gradient-to-r 
                                                        from-purple-500 
                                                        to-purple-900 
                                                        hover:from-purple-600 
                                                        hover:to-purple-800 
                                                        rounded-lg 
                                                        py-2
                                                        px-7 
                                                        flex 
                                                        items-center 
                                                        text-md
                                                        font-semibold">
                        Click here to converse with our AI about your PDFs
                        <ArrowRight strokeWidth={5} className="ml-[750px] 
                                                               h-6 
                                                               w-6"/>
                    </Link>
            </div>
            <PDFDrop/>
            <div className="bg-secondary 
                            border-none 
                            p-4 
                            flex
                            mt-5">
                <div className="flex-shrink-0">
                    <InfoIcon 
                        className="text-green-500 
                                    h-10 
                                    w-10 
                                    bg-green-100 
                                    rounded-full 
                                    p-2 
                                    shadow-sm" />
                </div>

                <div className="ml-5">
                    Hi! Here, you can easily upload your PDF file and feed the information into our AI. Once uploaded, you can converse with the AI and ask any questions about the contents of your document. This will save you time and effort, as you no longer have to read through lengthy pages—our AI is here to help you break down your PDFs and assist with any query related to the text. To start your conversation with our AI, simply click the button above. You'll be able to see all the PDFs you've uploaded, and if this is your first time, just upload your file, and you're good to go! Enjoy the convenience and power of AI-assisted reading.
                </div>
            </div>
        </div>              
    );
};

export default PDFBreakdown;
