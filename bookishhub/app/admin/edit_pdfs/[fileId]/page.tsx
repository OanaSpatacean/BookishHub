export const dynamic = 'force-dynamic';
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

const FileAdminPage = async ({ params: { fileId } }: Props) => {
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
        return <p>File not found</p>; 
    }

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
                        {currentFileName}
                </h3>

                <div className="p-4">
                    <PDFRequestsAdminSection fileId={currentFile.id} />
                </div>
            </div>
        </div>
    )
}

export default FileAdminPage;
