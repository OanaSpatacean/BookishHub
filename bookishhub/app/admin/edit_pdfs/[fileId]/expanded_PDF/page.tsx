export const dynamic = 'force-dynamic';
import SeePDFContent from "@/components/SeePDFContent";
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

    const userPDFFiles = await databaseClient.files.findMany({
    })
    
    const currentFile = userPDFFiles.find(
        (file) => file.id === parseInt(fileId)
    )

    const currentFileName = currentFile ? currentFile.pdfName : "Unknown file";

    if (!currentFile) 
    {
        return redirect("/admin/edit_pdfs");
    }

    return (
        <div className="flex h-[calc(100vh-65px)] mt-4">
            <SeePDFContent pdfURL={currentFile?.pdfUrl || ""} />
        </div>
    )
}

export default ExpandedPDFAdmin;
