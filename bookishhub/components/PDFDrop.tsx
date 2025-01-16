"use client";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { uploadToS3 } from "@/lib/s3";
import { FaFilePdf } from "react-icons/fa6";

type Props = {}

const PDFDrop = (props: Props) => {
    const router = useRouter();

    const { mutate, isLoading } = useMutation({
      mutationFn: async ({keyOfFile,nameOfFile
      }: {
        keyOfFile: string; nameOfFile: string
      }) => {
        const response = await axios.post("/api/aboutPDFConversation", {keyOfFile,nameOfFile})
        return response.data;
      },
      onSuccess: ({aboutPDFConversation_id}) => 
      {
        toast({ title: "Success", description: "PDF conversation was created success!" });
        router.push(`/breakdown/${aboutPDFConversation_id}`);
      },
      onError: () => 
      {
        toast({title: "Error", description: "Error when creating PDF conversation", variant: "destructive"})
      }})
  
    const [uploading, setUploading] = React.useState(false);
  
    const { getRootProps, getInputProps } = useDropzone({
      accept: { "application/pdf": [".pdf"] },
      maxFiles: 1,
      onDrop: async (filesOk) => {
        const file = filesOk[0];

        if (file.size > 1024 * 1024 * 10) 
        {
          toast({ title: "Error", description: "The file is too large to upload!", variant: "destructive" })
          return
        }
  
        try 
        {
          setUploading(true);

          const data = await uploadToS3(file);

          if (!data?.keyOfFile || !data.nameOfFile) 
          {
            toast({ title: "Error", description: "An error occured", variant: "destructive" })
            return
          }
          
          mutate(data)
        } 
        catch (error) 
        {
          toast({ title: "Error", description: "Could not do the upload of your PDF", variant: "destructive" })
          console.error(error)
        } 
        finally 
        {
          setUploading(false)
        }}
    })

    return (
        <div className="bg-purple-50 
                        p-1 
                        rounded-2xl 
                        px-4 
                        py-4 
                        h-[300px]">
            <div {...getRootProps({className:"rounded-xl h-[270px] border-2 bg-purple-50 border-purple-200 flex-col border-dashed py-12 flex items-center cursor-pointer justify-center"})}>
                <input {...getInputProps()}/>

                {uploading || isLoading ? (
                <>
                    <p className="text-md 
                                  text-slate-400 
                                  mt-2">
                        Feeding info into our AI...
                    </p>

                    <Loader2 className="text-purple-500 
                                        w-10 
                                        animate-spin 
                                        h-10"/>
                </>
                ) : (
                <>
                    <p className="mb-5 
                                  text-slate-400 
                                  text-md">
                        Upload your file
                    </p>

                    <FaFilePdf className="text-purple-500 
                                          w-10 
                                          h-10"/>                  
                </>
                )}
            </div>
        </div>         
    )
}

export default PDFDrop;
