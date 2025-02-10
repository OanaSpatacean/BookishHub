"use client"
import { useMutation } from "@tanstack/react-query";
import { redirect, useRouter } from "next/navigation";
import React from "react";
import { toast } from "./ui/use-toast";
import axios  from 'axios';

type Props = 
{
    fileId: String
}

const Summary = ({fileId}: Props) => {
    const router = useRouter();

    const { mutate: generateSummary, isLoading } = useMutation({
        mutationFn: async () => {
            const response = await axios.post("/api/summary_of_pdf", { fileId });
            return response.data;
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Summary generated successfully!" });
            router.push(`/breakdown/${fileId || ''}/summary_of_PDF`);
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to generate summary", variant: "destructive" });
        }
    })

    return (
        <div className="flex 
                        flex-col 
                        w-full
                        mb-4
                        mt-[-12px]">
           <button onClick={() => generateSummary()} disabled={isLoading} className="text-left 
                                                                                     text-lg 
                                                                                     dark:font-bold 
                                                                                     bg-green-600 
                                                                                     hover:bg-green-700 
                                                                                     text-white 
                                                                                     dark:bg-white 
                                                                                     dark:text-black 
                                                                                     rounded-lg 
                                                                                     pl-4 ">
                    {isLoading ? "Generating summary..." : "Click here to get the summary of your document"}
            </button>
        </div>
    )
}

export default Summary;
