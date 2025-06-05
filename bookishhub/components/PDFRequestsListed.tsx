import React from "react";
import { cn } from "@/lib/utils";
import { PDFRequest, UserSystemEnum } from "@prisma/client";
import { Loader2 } from "lucide-react";

type Props = 
{
    PDFRequests: PDFRequest[];
    isLoading: boolean;
}

const PDFRequestsListed = ({PDFRequests,isLoading}: Props) => {
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
                          mt-[70px]">
            <p>
                No requests made for this file yet
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
                    <div key={PDFRequest.id} className={cn("flex", {"pl-10 justify-end": PDFRequest.role === UserSystemEnum.USER,
                                                                    "pr-10 justify-start": PDFRequest.role === UserSystemEnum.SYSTEM,
                                                                    }
                                                            )
                                                        }>

                        <div className={cn("px-3 ring-gray-900/10 py-1 text-sm shadow-md ring-1 rounded-lg",
                                            {
                                                "bg-green-600 text-white": PDFRequest.role === UserSystemEnum.USER, 
                                                "dark:bg-gray-500 dark:text-white": PDFRequest.role === UserSystemEnum.SYSTEM, 
                                            }
                                        )
                                        }>
                            <p>
                                {PDFRequest.content}
                            </p>
                        </div>
                    </div>
                    )
            })}
        </div>
    )
}

export default PDFRequestsListed;
