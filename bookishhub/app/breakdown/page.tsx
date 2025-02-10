import MembershipFees from '@/components/MembershipFees';
import PDFDrop from '@/components/PDFDrop';
import { getAuthSession } from '@/lib/authentication';
import { databaseClient } from '@/lib/database';
import verifyMembership from '@/lib/membership';
import { ArrowRight, InfoIcon } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {}

const PDFBreakdown = async (props: Props) => {
    const session = await getAuthSession();

    if(!session?.user){ 
        return redirect('/');
    }

    const userId = session.user.id; 

    const havePowerAccount = await verifyMembership();

    const userFiles = await databaseClient.files.findMany({
        where: {
            userId: userId,
        },
    });

    const initialFile = userFiles?.[0] || null;

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
                                    decoration-green-500">
                        Break down your files
                    </h1>
                    {initialFile ? (
                    <Link href={`/breakdown/${initialFile?.id || ''}`} className="mt-9
                                                        inline-block 
                                                        text-white 
                                                        transition 
                                                        bg-gradient-to-r 
                                                        from-green-500 
                                                        to-green-900 
                                                        hover:from-green-600 
                                                        hover:to-green-800 
                                                        rounded-lg 
                                                        py-2
                                                        px-7 
                                                        flex 
                                                        items-center 
                                                        text-md
                                                        font-semibold">
                        Click here to open your interactive textbook
                        <ArrowRight strokeWidth={5} className="ml-[830px] 
                                                               h-6 
                                                               w-6"/>
                    </Link>
                    ) : (
                        <div className="mt-9
                                                        inline-block 
                                                        text-white 
                                                        transition 
                                                        bg-gradient-to-r 
                                                        from-green-500 
                                                        to-green-900 
                                                        rounded-lg 
                                                        py-2
                                                        px-7 
                                                        flex 
                                                        items-center 
                                                        text-md
                                                        font-semibold">
                        Upload your first file in the next section to open your interactive textbook
                    </div>
                    )}
            </div>
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
                    Think of your files as pages in a textbook—except now, instead of passively reading, you have a dynamic, interactive experience guiding you through every chapter. Upload a document, and our AI-powered system will navigate the information for you, breaking down complex ideas and giving you instant access to key details—just like an expert-led lecture, but at your own pace.
                    Why sit through endless pages when you can explore knowledge in a smarter way? To open your interactive textbook and get a helpful study companion for each of your files, simply click the button above. You will find all the documents you’ve ever uploaded. If this is your first time, just upload your file, and you're ready to go! Keep in mind that only .pdf files are accepted.
                    Enjoy the power of AI-assisted learning, where your documents become more than just pages—they become a guided experience.    
                </div>
            </div>
            <MembershipFees havePowerAccount={havePowerAccount}/>
            <PDFDrop session={session} havePowerAccount={havePowerAccount}/>     
        </div>              
    );
};

export default PDFBreakdown;
