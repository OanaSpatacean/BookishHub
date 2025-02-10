"use client"
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { PDFRequest } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FaRegTrashAlt, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { MdOutlineDownloading } from "react-icons/md";

type Props = 
{
  PDFRequests: PDFRequest[];
  isLoading: boolean;
}

const PDFRequestsListedAdmin = ({PDFRequests,isLoading}: Props) => {
  const { toast } = useToast();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<{ [key: number]: string }>({});
  const [localRequests, setLocalRequests] = useState(PDFRequests); 

  useEffect(() => {
    console.log("Updating localRequests:", PDFRequests);
    if (PDFRequests?.length > 0) {
      setLocalRequests(PDFRequests);
    }
  }, [PDFRequests]);

  const { mutate: deletePDFRequest } = useMutation({
    mutationFn: async (input: { PDFRequestId: number }) => {
      setLoadingId(input.PDFRequestId);
      const response = await axios.delete("/api/admin/edit_PDF_request", {data: { PDFRequestId: Number(input.PDFRequestId) } });
      window.location.reload();
      return response.data;
    },
    onSuccess: () => {
      toast({
                title: "Success",
                description: "File request deleted successfully",
            });
            setLoadingId(null);
    },
    onError: (error) => {
      console.error("Error deleting file request:", error);
      toast({
                title: "Warning",
                description: "An error occurred while deleting the file request",
                variant: "destructive",
            });
      setLoadingId(null);
    }
  })

  const { mutate: updatePDFRequest } = useMutation({
    mutationFn: async (input: { PDFRequestId: number; content: string }) => {
      setLoadingId(input.PDFRequestId);
      const response = await axios.patch("/api/admin/edit_PDF_request", {
        PDFRequestId: Number(input.PDFRequestId),
        content: input.content,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast({ title: "Success", description: "File request updated successfully" });

      setLocalRequests((prev) =>
        prev.map((req) => (req.id === variables.PDFRequestId ? { ...req, content: variables.content } : req))
      )

      setLoadingId(null);
      setEditingId(null);
    },
    onError: (error) => {
      console.error("Error updating file request:", error);
      toast({ title: "Warning", description: "An error occurred while updating the file request", variant: "destructive" });
      setLoadingId(null);
    },
  });

  if (isLoading) {
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

  if (!localRequests || localRequests.length === 0) {
    return (
      <div className="text-center 
                      text-gray-500 
                      mt-[210px]
                      italic">
        <p>
                No requests made for this file 
            </p>
      </div>
    )
  }

  return (
    <div className="gap-2 
                    flex-col 
                    px-4 
                    flex 
                    mb-6">
      {localRequests.map((PDFRequest) => (
        <div key={PDFRequest.id} className={cn("flex", { "pl-10 justify-end": PDFRequest.role === "user", "pr-10 justify-start": PDFRequest.role === "system" })}>
          <div className={cn("px-3 py-1 text-sm shadow-md ring-1 rounded-lg", {
                             "bg-green-600 text-white": PDFRequest.role === "user",
                             "dark:bg-gray-500 dark:text-white": PDFRequest.role === "system",
          })}>
            {editingId === PDFRequest.id ? (
              <input type="text" value={editedContent[PDFRequest.id] ?? PDFRequest.content} onChange={(e) => setEditedContent({ ...editedContent, [PDFRequest.id]: e.target.value })} className="border 
                                                                                                                                                                                                 rounded 
                                                                                                                                                                                                 p-1 
                                                                                                                                                                                                 text-black 
                                                                                                                                                                                                 w-full"/>
            ) : (
              <p>
                {PDFRequest.content}
              </p>
            )}
          </div>

          <div className="flex 
                          justify-end 
                          ml-2 
                          space-x-2 
                          text-secondary-foreground/70">
            {editingId === PDFRequest.id ? (
              <>
                <button onClick={() => updatePDFRequest({ PDFRequestId: PDFRequest.id, content: editedContent[PDFRequest.id] ?? PDFRequest.content })} className="text-blue-500 
                                                                                                                                                                  underline 
                                                                                                                                                                  disabled:opacity-50" disabled={loadingId === PDFRequest.id}>
                  {loadingId === PDFRequest.id ? <MdOutlineDownloading /> : <FaSave />}
                </button>

                <button onClick={() => setEditingId(null)} className="text-gray-500 
                                                                      underline">
                  <FaTimes />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setEditingId(PDFRequest.id)} className="text-blue-500 
                                                                               underline">
                  <FaEdit />
                </button>
                <button onClick={() => deletePDFRequest({ PDFRequestId: PDFRequest.id })} className="text-red-500 
                                                                                                     underline 
                                                                                                     disabled:opacity-50" disabled={loadingId === PDFRequest.id}>
                  {loadingId === PDFRequest.id ? <MdOutlineDownloading /> : <FaRegTrashAlt />}
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default PDFRequestsListedAdmin;
