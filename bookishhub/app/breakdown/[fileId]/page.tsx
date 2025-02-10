import AllFilesListed from "@/components/AllFilesListed";
import PDFRequestsSection from "@/components/PDFRequestsSection";
import SeePDFContent from "@/components/SeePDFContent";
import { getAuthSession } from "@/lib/authentication";
import { databaseClient } from "@/lib/database";
import verifyMembership from "@/lib/membership";
import { redirect } from "next/navigation";
import React from "react";
import Summary from "@/components/Summary";

type Props = 
{
    params:
    {
        fileId: string;
    }
}

const FilePage = async ({ params: { fileId } }: Props) => {
    const session = await getAuthSession();

    if(!session?.user)
    { 
        return redirect('/');
    }

    const havePowerAccount = verifyMembership();

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

    if (!currentFile) 
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
                <AllFilesListed userPDFFiles={userPDFFiles} fileId={currentFile.id} havePowerAccount={havePowerAccount}/>
            </div>

            <div className="flex 
                            flex-col 
                            flex-[5] 
                            w-full">      
                <div className="p-4 
                                flex-grow">
                    <SeePDFContent pdfURL={currentFile.pdfUrl || ""} />
                </div>

                <Summary fileId={fileId}/>

                <h3 className="text-lg 
                                dark:font-bold
                                bg-gray-900
                                text-white
                                dark:bg-white
                                dark:text-black
                                rounded-lg
                                pl-4
                                mb-1
                                mt-[-16px]">
                        Study companion
                </h3>

                <div className="p-4 
                                h-[40%] 
                                overflow-y-hidden 
                                overflow-x-hidden">
                    <PDFRequestsSection fileId={currentFile.id} />
                </div>
            </div>
        </div>
    )
}

export default FilePage;
