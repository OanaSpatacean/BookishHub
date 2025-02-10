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
            summary: true 
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
                        mt-4 
                        p-8">
            <h1 className="sm:text-5xl 
                            text-left 
                            font-bold 
                            text-3xl 
                            underline 
                            decoration-4 
                            decoration-green-500
                            mb-7">
                Summary of the Document
            </h1>

            <ul className="list-disc 
                           list-inside 
                           space-y-2 
                           text-lg">
                {summaryPoints.map((point, index) => (
                    <li key={index}>{point.trim()}.</li>
                ))}
            </ul>
        </div>
    )
}

export default SummaryOfPdf;
