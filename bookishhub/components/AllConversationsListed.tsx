"use client"
import { cn } from "@/lib/utils";
import { AboutPDFConversations } from "@prisma/client";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { TbMessageChatbotFilled } from "react-icons/tb";

type Props = 
{
    userPDFConversations: AboutPDFConversations[];
    aboutPDFConversationId: number;
    havePowerAccount: any;
}

const AllConversationsListed = ({userPDFConversations, aboutPDFConversationId, havePowerAccount}: Props) => {
    const [loading, setLoading] = React.useState(false);

    return (
        <div className="dark:text-gray-100 
                        mt-5 
                        w-full 
                        p-4 
                        text-gray-900 
                        h-[calc(100vh-65px)] 
                        bg-gray-200 
                        dark:bg-gray-800 
                        overflow-scroll">
            <Link href="/breakdown">
                <Button className="w-full">
                    <Plus className="w-full 
                                     mr-2 
                                     h-4" />
                    Create new PDF conversation
                </Button>
            </Link>
  
        <div className="mt-5 
                        pb-20 
                        max-h-screen 
                        flex 
                        gap-2 
                        flex-col">
          {userPDFConversations.map((userPDFConversation) => (
            <Link key={userPDFConversation.id} href={`/breakdown/${userPDFConversation.id}`}>
              <div className={cn("rounded-lg p-3 flex items-center",
                                {"bg-purple-600 text-white hover:bg-purple-500 hover:dark:bg-purple-900 dark:text-white":
                                    userPDFConversation.id === aboutPDFConversationId,
                                "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:dark:bg-gray-600 hover:dark:text-white":
                                    userPDFConversation.id !== aboutPDFConversationId
                                },
                                userPDFConversation.id === aboutPDFConversationId ? "hover:bg-purple-500"
                                : "hover:bg-gray-300 hover:text-gray-900"
                            )}>

                <TbMessageChatbotFilled  className="mr-2"/>

                <p className="whitespace-nowrap 
                              text-sm 
                              truncate 
                              w-full 
                              text-ellipsis 
                              overflow-hidden">
                  {userPDFConversation.pdfName}
                </p>

              </div>
            </Link>
          ))}
        </div>
      </div> 
    )
}

export default AllConversationsListed;
