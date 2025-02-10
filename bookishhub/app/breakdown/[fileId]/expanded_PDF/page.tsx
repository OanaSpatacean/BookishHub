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
        fileId: string;
    }
}

const ExpandedPDF = async ({ params: { fileId } }: Props) => {
    const session = await getAuthSession();

    if(!session?.user)
    { 
        return redirect('/');
    }

    const userPDFFiles = await databaseClient.files.findMany({
        where: 
        { 
            userId: session.user.id 
        }
    })

    if (!userPDFFiles || userPDFFiles.length === 0) 
    {
        return redirect("/breakdown");
    }
    
    const currentFile = userPDFFiles.find(
        (file) => file.id === parseInt(fileId)
    )

    return (
        <div className="flex h-[calc(100vh-65px)] mt-4">
            <SeePDFContent pdfURL={currentFile?.pdfUrl || ""} />
        </div>
    )
}

export default ExpandedPDF;
