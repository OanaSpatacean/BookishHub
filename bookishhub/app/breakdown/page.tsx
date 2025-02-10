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

    const userConversations = await databaseClient.aboutPDFConversations.findMany({
        where: {
            userId: userId,
        },
    });

    const initialAboutPDFConversation = userConversations?.[0] || null;

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
                    {initialAboutPDFConversation ? (
                    <Link href={`/breakdown/${initialAboutPDFConversation?.id || ''}`} className="mt-9
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
                        Click here to open a conversation with our AI to explore your uploaded files
                        <ArrowRight strokeWidth={5} className="ml-[550px] 
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
                        Upload your first file in the next section to start a conversation with our AI
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
                    Hi! Here, you can easily upload your file and feed the information into our AI. Keep in mind that only .pdf files are acccepted. Once uploaded, you can converse with the AI and ask any questions about the contents of your document. This will save you time and effort, as you no longer have to read through lengthy pages—our AI is here to help you break down your files and assist with any query related to the text. To start your conversation with our AI, simply click the button above. You'll be able to see all the files you've uploaded, and if this is your first time, just upload your file, and you're good to go! Enjoy the convenience and power of AI-assisted reading.
                </div>
            </div>
            <MembershipFees havePowerAccount={havePowerAccount}/>
            <PDFDrop session={session} havePowerAccount={havePowerAccount}/>     
        </div>              
    );
};

export default PDFBreakdown;
