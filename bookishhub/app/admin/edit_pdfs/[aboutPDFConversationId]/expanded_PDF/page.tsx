import SeePDFContent from "@/components/SeePDFContent";
import { Button } from "@/components/ui/button";
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

const ExpandedPDFAdmin = async ({ params: { fileId } }: Props) => {
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

    if (!currentConversation) 
    {
        return redirect("/admin/edit_pdfs");
    }

    return (
        <div className="flex h-[calc(100vh-65px)] mt-4">
            <SeePDFContent pdfURL={currentConversation?.pdfUrl || ""} />
        </div>
    )
}

export default ExpandedPDFAdmin;
