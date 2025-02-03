import PDFRequestsAdminSection from "@/components/PDFRequestsAdminSection";
import { getAuthSession } from "@/lib/authentication";
import { databaseClient } from "@/lib/database";
import { redirect } from "next/navigation";
import React from "react";

type Props = 
{
    params:
    {
        aboutPDFConversationId: string;
    }
}

const AboutPDFConversationAdminPage = async ({ params: { aboutPDFConversationId } }: Props) => {
    const session = await getAuthSession();

    if(!session?.user)
    { 
        return redirect('/');
    }

    const userPDFConversations = await databaseClient.aboutPDFConversations.findMany({
        where: 
        { 
            userId: session.user.id 
        }
    })
    
    const currentConversation = userPDFConversations.find(
        (aboutPDFConversation) => aboutPDFConversation.id === parseInt(aboutPDFConversationId)
    )

    const currentConversationName = currentConversation ? currentConversation.pdfName : "Empty conversation";
    
    return (
        <div className="flex">

            <div className="flex 
                            flex-col 
                            flex-[5] 
                            w-full">      

                <h3 className="text-lg 
                                font-bold 
                                bg-green-300
                                dark:bg-green-800 
                                rounded-lg
                                pl-4
                                mb-1
                                mt-[30px]">
                        {currentConversationName}
                </h3>

                <div className="p-4">
                    <PDFRequestsAdminSection aboutPDFConversationId={currentConversation?.id || 0} />
                </div>
            </div>
        </div>
    )
}

export default AboutPDFConversationAdminPage;
