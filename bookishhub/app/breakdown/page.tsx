import { getAuthSession } from '@/lib/authentication';
import verifyMembership from '@/lib/membership';
import { ArrowRight } from 'lucide-react';
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
                    <Link href="/design" className="mt-9
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
                        Click here to break down your PDF
                        <ArrowRight strokeWidth={5} className="ml-[850px] 
                                                            h-6 
                                                            w-6"/>
                    </Link>
            </div>

            
        </div>              
    );
};

export default PDFBreakdown;
