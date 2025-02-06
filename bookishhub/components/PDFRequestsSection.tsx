"use client";
import React, { useEffect } from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { FaArrowUp, FaSpinner } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PDFRequest, UserSystemEnum } from "@prisma/client";
import PDFRequestsListed from "./PDFRequestsListed";
import { Loader2 } from "lucide-react";

type Props = 
{
    aboutPDFConversationId: number;
}

type Message = {
    id: string;
    role: "user" | "system";
    content: string;
    createdAt: Date;
}

const PDFRequestsSection = ({aboutPDFConversationId}: Props) => {
    const { data, isLoading } = useQuery({
        queryKey: ["aboutPDFConversation", aboutPDFConversationId],
        queryFn: async () => {
        const response = await axios.post<PDFRequest[]>("/api/PDFRequestsList", {aboutPDFConversationId})
        return response.data;
    }});
    
    const transformedMessages: Message[] = (data || []).map((pdfRequest) => ({
        id: pdfRequest.id.toString(), 
        role: pdfRequest.role === UserSystemEnum.USER ? "user" : "system", 
        content: pdfRequest.content,
        createdAt: pdfRequest.createdAt,
        aboutPDFConversationId,
      }));
    
      const { input, handleInputChange, handleSubmit, messages, isLoading: isChatLoading } = useChat({ api: "/api/PDFRequestResponse", body: { aboutPDFConversationId }, initialMessages: transformedMessages});

      useEffect(() => {
        if (messages.length > 0) {
            const PDFRequestContainer = document.getElementById("PDFRequest-container");
            if (PDFRequestContainer) {
                PDFRequestContainer.scrollTo({
                    top: PDFRequestContainer.scrollHeight,
                    behavior: "smooth",
                });
            }
        }
    }, [messages, isChatLoading]); 
    
      
    return (
        <div className="h-[200px] overflow-y-auto" id="PDFRequest-container">
            <PDFRequestsListed PDFRequests={messages} isLoading={isLoading} />

            <form onSubmit={handleSubmit} className="absolute 
                                                     bottom-1 
                                                     mt-1 
                                                     w-full 
                                                     max-w-5xl 
                                                     mx-auto 
                                                     px-4 
                                                     bg-white 
                                                     shadow-md 
                                                     rounded-lg
                                                     dark:bg-gray-950">
                <div className="flex 
                                items-center">
                    <Input placeholder="Make a request about your PDF to our AI..." onChange={handleInputChange} value={input} className="w-full dark:bg-gray-900"/>
                    <Button className="ml-2 
                                       bg-green-500
                                       hover:bg-green-800
                                       dark:hover:bg-green-800">
                        <FaArrowUp className="w-4 
                                              h-4" />
                    </Button>
                </div>
            </form>

            {isChatLoading && (
                <div className="mb-5 ml-5">
                    <Loader2 className="h-8 
                                        animate-spin 
                                        w-6"/>
                </div>               
            )}
        </div>
    )
}

export default PDFRequestsSection;
