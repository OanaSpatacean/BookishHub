"use client";
import { cn } from "@/lib/utils";
import { Files } from "@prisma/client";
import Link from "next/link";
import React, { useState } from "react";
import { useToast } from "./ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FaBook} from "react-icons/fa";

type Props = 
{
    userPDFFiles: Files[];
    fileId: number;
}

const AllFilesListedAdmin = ({ userPDFFiles, fileId }: Props) => {
    const { toast } = useToast();
    const [loadingId, setLoadingId] = useState<number | null>(null); 

    const { mutate: deletePDFFile } = useMutation({
        mutationFn: async (input: { PDFFileId: number }) => {
            setLoadingId(input.PDFFileId); 
            const response = await axios.delete("/api/admin/edit_pdfs", { data: input });
            return response.data;
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "File deleted successfully",
            });
            window.location.reload();
        },
        onError: (error) => {
            console.error("Error deleting file:", error);
            toast({
                title: "Warning",
                description: "An error occurred while deleting the file",
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
            {userPDFFiles.map((file) => (
                <div key={file.id} className={cn("rounded-lg border p-4 flex items-center bg-gray-50 dark:bg-gray-900 w-full",
                                                            {
                                                                "bg-green-600 text-white hover:bg-green-500 dark:hover:bg-green-700":
                                                                    file.id === fileId,
                                                                "hover:bg-gray-300 dark:hover:bg-gray-800":
                                                                    file.id !== fileId,
                                                            }
                                                        )}>
                    <FaBook className="mr-3 
                                                       text-xl 
                                                       text-primary"/>

                    <Link href={`/admin/edit_pdfs/${file.id}`} className="flex-grow">
                        <h3 className="text-primary 
                                       truncate 
                                       font-semibold 
                                       text-lg">
                            {file.pdfName}
                        </h3>
                    </Link>

                    <div className="justify-end 
                                    flex">
                        <div className="text-secondary-foreground/70">
                            <Link href={`/admin/edit_pdfs/${file.id || ''}/expanded_PDF`} className='underline 
                                                                                                                    text-blue-500 
                                                                                                                    block 
                                                                                                                    w-fit 
                                                                                                                    disabled:opacity-50 
                                                                                                                    mt-2
                                                                                                                    mr-5'>
                                    See file
                            </Link> 
                        </div>
                    </div>

                    <div className="justify-end 
                                    flex">
                        <div className="text-secondary-foreground/70">
                            <button onClick={() => deletePDFFile({ PDFFileId: file.id })} className="underline 
                                                                                                                             text-red-500 
                                                                                                                             block 
                                                                                                                             w-fit 
                                                                                                                             disabled:opacity-50 
                                                                                                                             mt-2" disabled={loadingId === file.id}>
                                {loadingId === file.id ? "Deleting..." : "Delete file"}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AllFilesListedAdmin;
