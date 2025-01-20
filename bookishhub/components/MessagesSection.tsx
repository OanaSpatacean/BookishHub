"use client";
import React from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { FaArrowUp } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PDFRequest, UserSystemEnum } from "@prisma/client";
import PDFRequestsListed from "./PDFRequestsListed";

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
        const response = await axios.post<PDFRequest[]>("/api/PDFRequestList", {aboutPDFConversationId})
        return response.data;
    }});
    
    const transformedMessages: Message[] = (data || []).map((pdfRequest) => ({
        id: pdfRequest.id.toString(), 
        role: pdfRequest.role === UserSystemEnum.USER ? "user" : "system", 
        content: pdfRequest.content,
        createdAt: pdfRequest.createdAt,
      }));
    
      const { input, handleInputChange, handleSubmit, messages } = useChat({ api: "/api/PDFRequestResponse", body: { aboutPDFConversationId }, initialMessages: transformedMessages});

      React.useEffect(() => {
        const PDFRequestContainer = document.getElementById("PDFRequest-container");

        if (PDFRequestContainer) 
        {
          PDFRequestContainer.scrollTo({
            top: PDFRequestContainer.scrollHeight,
            behavior: "smooth",
        })}

      }, [messages])
      
    return (
        <div className="h-screen" id="PDFRequest-container">
            <div className="top-0 
                            sticky 
                            p-2 
                            h-fit
                            bg-white 
                            inset-x-0">
                <h3 className="text-xl 
                               font-bold">
                    PDF Conversation
                </h3>
            </div>
    
            <PDFRequestsListed PDFRequests={messages} isLoading={isLoading} />

            <form onSubmit={handleSubmit} className="bottom-0 
                                                     sticky 
                                                     px-2 
                                                     bg-white 
                                                     inset-x-0">

                <div className="flex">
                    <Input placeholder="Make a request about your PDF to our AI..." onChange={handleInputChange} value={input} className="w-full"/>
                    
                    <Button className="ml-2 
                                       bg-purple-500">
                        <FaArrowUp className="w-4 
                                              h-4"/>
                    </Button>
                </div>

            </form>
        </div>
    )
}

export default PDFRequestsSection;
