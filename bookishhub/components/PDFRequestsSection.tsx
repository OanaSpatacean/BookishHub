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
        const response = await axios.post<PDFRequest[]>("/api/PDFRequestsList", {aboutPDFConversationId})
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
        <div className="" id="PDFRequest-container">
            <div
                className="top-0 
                           mb-2 
                           sticky 
                           h-fit 
                           bg-white
                           dark:bg-gray-950">
                <h3 className="text-lg 
                               font-bold 
                               bg-purple-300
                               dark:bg-purple-800 
                               rounded-lg
                               pl-4">
                    PDF Conversation
                </h3>
            </div>

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
                                                     dark:bg-gray-950
                                                     ">
                <div className="flex 
                                items-center">
                    <Input placeholder="Make a request about your PDF to our AI..." onChange={handleInputChange} value={input} className="w-full dark:bg-gray-900"/>
                    <Button className="ml-2 
                                       bg-purple-500
                                       hover:bg-purple-800
                                                     dark:hover:bg-purple-800">
                        <FaArrowUp className="w-4 
                                              h-4" />
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default PDFRequestsSection;
