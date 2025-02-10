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

const SummaryOfPdf = async ({ params: { fileId } }: Props) => {
    const session = await getAuthSession();

    if (!session?.user) 
    {
        return redirect('/');
    }

    const file = await databaseClient.files.findUnique({
        where: 
        { 
            id: parseInt(fileId) 
        }, 
        select: 
        { 
            summary: true, 
            pdfName: true
        }
    })

    if (!file?.summary) 
    {
        return <div className="flex 
                               h-[calc(100vh-65px)] 
                               mt-4 
                               justify-center 
                               items-center 
                               text-xl 
                               font-semibold">
            No summary available
        </div>;
    }

    const summaryPoints = file.summary.split(". ").filter(point => point.trim() !== ""); 

    return (
        <div className="flex 
                        flex-col 
                        h-[calc(100vh-65px)]
                        p-8">
            <h1 className="sm:text-5xl 
                            text-left 
                            font-bold 
                            text-2xl 
                            underline 
                            decoration-4 
                            decoration-green-500
                            mb-7">
                Summary of <span>{file.pdfName}</span>
            </h1>

            <ul className="space-y-4">
                {summaryPoints.map((point, index) => (
                    <li key={index} className="bg-green-100 
                                               text-green-900 
                                               p-4 
                                               rounded-lg 
                                               shadow-md 
                                               border 
                                               border-green-300">
                        {point.trim()}.
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SummaryOfPdf;
