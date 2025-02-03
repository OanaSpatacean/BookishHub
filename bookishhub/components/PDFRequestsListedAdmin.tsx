"use client"
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { PDFRequest } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineDownloading } from "react-icons/md";

type Props = 
{
    PDFRequests: PDFRequest[];
    isLoading: boolean;
}

const PDFRequestsListedAdmin = ({PDFRequests,isLoading}: Props) => {
    const { toast } = useToast();
    const [loadingId, setLoadingId] = useState<number | null>(null); 

    const { mutate: deletePDFRequest } = useMutation({
        mutationFn: async (input: { PDFRequestId: number }) => {
            setLoadingId(input.PDFRequestId); 
            const response = await axios.delete("/api/admin/edit_pdf_request", { data: input });
            return response.data;
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "PDF request deleted successfully",
            });
            setLoadingId(null); 
            window.location.reload();
        },
        onError: (error) => {
            console.error("Error deleting PDF request:", error);
            toast({
                title: "Warning",
                description: "An error occurred while deleting the PDF request",
                variant: "destructive",
            });
            setLoadingId(null); 
        }
    })

    if (isLoading) 
    {
        return (
            <div className="-translate-y-1/2 
                            left-1/2 
                            -translate-x-1/2 
                            top-1/2  
                            absolute">
                <Loader2 className="h-6 
                                    animate-spin 
                                    w-6"/>
            </div>
        )
    }

    if (!PDFRequests || PDFRequests.length === 0) {
        return (
          <div className="text-center 
                          text-gray-500 
                          mt-[210px]
                          italic">
            <p>
                No requests found for this conversation
            </p>
          </div>
        );
      }

    return (
        <div className="gap-2 
                        flex-col 
                        px-4 
                        flex
                        mb-6">
            {PDFRequests.map((PDFRequest) => {
                return (
                    <div key={PDFRequest.id} className={cn("flex", {"pl-10 justify-end": PDFRequest.role === "user",
                                                                    "pr-10 justify-start": PDFRequest.role === "system",
                                                                    }
                                                            )
                                                        }>

                        <div className={cn("px-3 ring-gray-900/10 py-1 text-sm shadow-md ring-1 rounded-lg",
                                            {
                                                "bg-green-600 text-white": PDFRequest.role === "user", 
                                                "dark:bg-gray-500 dark:text-white": PDFRequest.role === "system", 
                                            }
                                        )
                                        }>
                            <p>
                                {PDFRequest.content}
                            </p>
                        </div>
                        <div className="justify-end 
                                        flex">
                            <div className="text-secondary-foreground/70">
                                <button onClick={() => deletePDFRequest({ PDFRequestId: PDFRequest.id })} className="underline 
                                                                                                                    text-red-500 
                                                                                                                    block 
                                                                                                                    w-fit 
                                                                                                                    disabled:opacity-50" disabled={loadingId === PDFRequest.id}>
                                    {loadingId === PDFRequest.id ? <MdOutlineDownloading /> : <FaRegTrashAlt/>}
                                </button>
                            </div>
                        </div>
                    </div>
                    )
            })}
        </div>
    )
}

export default PDFRequestsListedAdmin;
