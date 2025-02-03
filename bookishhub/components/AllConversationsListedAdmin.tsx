"use client";

import { cn } from "@/lib/utils";
import { AboutPDFConversations } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { TbMessageChatbotFilled } from "react-icons/tb";

type Props = 
{
    userPDFConversations: AboutPDFConversations[];
    aboutPDFConversationId: number;
}

const AllConversationsListedAdmin = ({ userPDFConversations, aboutPDFConversationId }: Props) => {
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
                                                       text-primary" />
                    <Link href={`/breakdown/${conversation.id}`} className="flex-grow">
                        <h3 className="text-primary 
                                       truncate 
                                       font-semibold 
                                       text-lg">
                            {conversation.pdfName}
                        </h3>
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default AllConversationsListedAdmin;
