import PDFRequestsAdminSection from "@/components/PDFRequestsAdminSection";
import { getAuthSession } from "@/lib/authentication";
import { databaseClient } from "@/lib/database";
import { redirect } from "next/navigation";
import React from "react";

type Props = 
{
    params:
    {
        fileId: string;
    }
}

const AboutPDFConversationAdminPage = async ({ params: { fileId } }: Props) => {
    const session = await getAuthSession();

    if(!session?.user)
    { 
        return redirect('/');
    }

    const userPDFConversations = await databaseClient.aboutPDFConversations.findMany({
    })
    
    const currentConversation = userPDFConversations.find(
        (aboutPDFConversation) => aboutPDFConversation.id === parseInt(fileId)
    )

    const currentConversationName = currentConversation ? currentConversation.pdfName : "Unknown file";

    return (
        <div className="flex">

            <div className="flex 
                            flex-col 
                            flex-[5] 
                            w-full">      

                <h3 className="text-lg 
                                dark:font-bold
                                bg-gray-900
                                text-white
                                dark:bg-white
                                dark:text-black
                                rounded-lg
                                pl-4
                                mb-1
                                mt-[17px]">
                        {currentConversationName}
                </h3>

                <div className="p-4">
                    <PDFRequestsAdminSection fileId={currentConversation.id} />
                </div>
            </div>
        </div>
    )
}

export default AboutPDFConversationAdminPage;
