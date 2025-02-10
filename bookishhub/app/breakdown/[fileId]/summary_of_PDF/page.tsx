import { getAuthSession } from "@/lib/authentication";
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

    if(!session?.user)
    { 
        return redirect('/');
    }

    return (
        <div className="flex h-[calc(100vh-65px)] mt-4">
            SummaryOfPdf
        </div>
    )
}

export default SummaryOfPdf;
