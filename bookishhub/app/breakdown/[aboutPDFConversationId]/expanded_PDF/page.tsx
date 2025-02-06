import SeePDFContent from "@/components/SeePDFContent";
import { Button } from "@/components/ui/button";
import { getAuthSession } from "@/lib/authentication";
import { databaseClient } from "@/lib/database";
import { Link } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { FaExpandAlt } from "react-icons/fa";

type Props = 
{
    params:
    {
        aboutPDFConversationId: string;
    }
}

const ExpandedPDF = async ({ params: { aboutPDFConversationId } }: Props) => {
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

    if (!userPDFConversations || userPDFConversations.length === 0) 
    {
        return redirect("/breakdown");
    }
    
    const currentConversation = userPDFConversations.find(
        (aboutPDFConversation) => aboutPDFConversation.id === parseInt(aboutPDFConversationId)
    )

    return (
        <div className="flex h-[calc(100vh-65px)] mt-4">
            <SeePDFContent pdfURL={currentConversation?.pdfUrl || ""} />
        </div>
    )
}

export default ExpandedPDF;
