"use client";
import { cn } from "@/lib/utils";
import { AboutPDFConversations } from "@prisma/client";
import Link from "next/link";
import React, { useState } from "react";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { useToast } from "./ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "./ui/button";
import { FaExpandAlt } from "react-icons/fa";

type Props = 
{
    userPDFConversations: AboutPDFConversations[];
    aboutPDFConversationId: number;
}

const AllConversationsListedAdmin = ({ userPDFConversations, aboutPDFConversationId }: Props) => {
    const { toast } = useToast();
    const [loadingId, setLoadingId] = useState<number | null>(null); 

    const { mutate: deletePDFConversation } = useMutation({
        mutationFn: async (input: { PDFConversationId: number }) => {
            setLoadingId(input.PDFConversationId); 
            const response = await axios.delete("/api/admin/edit_pdfs", { data: input });
            return response.data;
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "PDF conversation deleted successfully",
            });
            window.location.reload();
        },
        onError: (error) => {
            console.error("Error deleting PDF conversation:", error);
            toast({
                title: "Warning",
                description: "An error occurred while deleting the PDF conversation",
                variant: "destructive",
            });
            setLoadingId(null); 
        }
    })

    return (
        <div className="w-full 
                        flex 
                        flex-col 
                        gap-5">
            {userPDFConversations.map((conversation) => (
                <div key={conversation.id} className={cn("rounded-lg border p-4 flex items-center bg-gray-50 dark:bg-gray-900 w-full",
                                                            {
                                                                "bg-green-600 text-white hover:bg-green-500 dark:hover:bg-green-700":
                                                                    conversation.id === aboutPDFConversationId,
                                                                "hover:bg-gray-300 dark:hover:bg-gray-800":
                                                                    conversation.id !== aboutPDFConversationId,
                                                            }
                                                        )}>
                    <TbMessageChatbotFilled className="mr-3 
                                                       text-xl 
                                                       text-primary"/>

                    <Link href={`/admin/edit_pdfs/${conversation.id}`} className="flex-grow">
                        <h3 className="text-primary 
                                       truncate 
                                       font-semibold 
                                       text-lg">
                            {conversation.pdfName}
                        </h3>
                    </Link>

                    <div className="justify-end 
                                    flex">
                        <div className="text-secondary-foreground/70">
                            <Link href={`/admin/edit_pdfs/${conversation.id || ''}/expanded_PDF`} className='underline 
                                                                                                                    text-blue-500 
                                                                                                                    block 
                                                                                                                    w-fit 
                                                                                                                    disabled:opacity-50 
                                                                                                                    mt-2
                                                                                                                    mr-5'>
                                    See PDF file
                            </Link> 
                        </div>
                    </div>

                    <div className="justify-end 
                                    flex">
                        <div className="text-secondary-foreground/70">
                            <button onClick={() => deletePDFConversation({ PDFConversationId: conversation.id })} className="underline 
                                                                                                                             text-red-500 
                                                                                                                             block 
                                                                                                                             w-fit 
                                                                                                                             disabled:opacity-50 
                                                                                                                             mt-2" disabled={loadingId === conversation.id}>
                                {loadingId === conversation.id ? "Deleting..." : "Delete PDF conversation"}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AllConversationsListedAdmin;
