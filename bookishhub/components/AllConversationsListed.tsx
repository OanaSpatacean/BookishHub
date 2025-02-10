"use client"
import { cn } from "@/lib/utils";
import { Files } from "@prisma/client";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { FaBook } from "react-icons/fa";
import { FaExpandAlt } from "react-icons/fa";

type Props = 
{
    userPDFConversations: Files[];
    fileId: number;
    havePowerAccount: any;
}

const AllConversationsListed = ({userPDFConversations, fileId, havePowerAccount}: Props) => {
    return (
        <div className="dark:text-gray-100 
                        mt-5 
                        w-full 
                        p-4 
                        text-gray-900 
                        h-[calc(100vh-65px)] 
                        bg-gray-200 
                        dark:bg-gray-800 
                        overflow-y-scroll 
                        overflow-x-hidden">
            <Link href={`/breakdown/`}>
                <Button className="w-full mb-1">
                    <Plus className="w-full 
                                     mr-2 
                                     h-4" />
                    Upload another file
                </Button>
            </Link>

            <Link href={`/breakdown/${fileId || ''}/expanded_PDF`}>
                <Button className="w-full">
                    <FaExpandAlt className="w-full 
                                     mr-2 
                                     h-4"/>
                    Expand current file
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
                                {"bg-green-600 text-white hover:bg-green-500 hover:dark:bg-green-900 dark:text-white":
                                    userPDFConversation.id === fileId,
                                "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:dark:bg-gray-600 hover:dark:text-white":
                                    userPDFConversation.id !== fileId
                                },
                                userPDFConversation.id === fileId ? "hover:bg-green-500"
                                : "hover:bg-gray-300 hover:text-gray-900"
                            )}>

                <FaBook className="mr-2"/>

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
