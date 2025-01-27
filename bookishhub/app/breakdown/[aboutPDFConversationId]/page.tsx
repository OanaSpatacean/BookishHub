import AllConversationsListed from "@/components/AllConversationsListed";
import PDFRequestsSection from "@/components/PDFRequestsSection";
import SeePDFContent from "@/components/SeePDFContent";
import { getAuthSession } from "@/lib/authentication";
import { databaseClient } from "@/lib/database";
import verifyMembership from "@/lib/membership";
import { redirect } from "next/navigation";
import React from "react";

type Props = 
{
    params:
    {
        aboutPDFConversationId: string;
    }
}

const AboutPDFConversationPage = async ({ params: { aboutPDFConversationId } }: Props) => {
    const session = await getAuthSession();

    if(!session?.user)
    { 
        return redirect('/');
    }

    const havePowerAccount = verifyMembership();

    const userPDFConversations = await databaseClient.aboutPDFConversations.findMany({
        where: 
        { 
            userId: session.user.id 
        }
    })

    if (!userPDFConversations || userPDFConversations.length === 0) 
    {
        return redirect("/breakdown");
    }
    
    const currentConversation = userPDFConversations.find(
        (aboutPDFConversation) => aboutPDFConversation.id === parseInt(aboutPDFConversationId)
    )

    if (!currentConversation) 
    {
    return redirect("/breakdown");
    }
    
    return (
        <div className="flex h-[calc(100vh-65px)]">
            <div className="max-w-xs 
                            h-[calc(100vh-65px)]
                            flex-[1] 
                            border-r-2 
                            border-r-slate-200">
                <AllConversationsListed userPDFConversations={userPDFConversations} aboutPDFConversationId={currentConversation.id} havePowerAccount={havePowerAccount}/>
            </div>

            <div className="flex 
                            flex-col 
                            flex-[5] 
                            w-full">      
                <div className="p-4 
                                flex-grow">
                    <SeePDFContent pdfURL={currentConversation.pdfUrl || ""} />
                </div>

                <h3 className="text-lg 
                                font-bold 
                                bg-green-300
                                dark:bg-green-800 
                                rounded-lg
                                pl-4
                                mb-1
                                mt-[-16px]">
                        PDF Conversation
                </h3>

                <div className="p-4 
                                h-[40%] 
                                overflow-y-scroll 
                                overflow-x-hidden">
                    <PDFRequestsSection aboutPDFConversationId={currentConversation.id} />
                </div>
            </div>
        </div>
    )
}

export default AboutPDFConversationPage;
