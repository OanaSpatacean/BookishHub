"use client";
import React from "react";
import { useChat } from "ai/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PDFRequest, UserSystemEnum } from "@prisma/client";
import PDFRequestsListedAdmin from "./PDFRequestsListedAdmin";

type Props = 
{
    fileId: number;
}

type Request = {
    id: string;
    role: "user" | "system";
    content: string;
    createdAt: Date;
}

const PDFRequestsAdminPage = ({fileId}: Props) => {
    const { data, isLoading } = useQuery({
        queryKey: ["file", fileId],
        queryFn: async () => {
        const response = await axios.post<PDFRequest[]>("/api/PDFRequestsList", {fileId})
        return response.data;
    }});
    
    const transformedRequests: Request[] = (data || []).map((pdfRequest) => ({
        id: pdfRequest.id.toString(), 
        role: pdfRequest.role === UserSystemEnum.USER ? "user" : "system", 
        content: pdfRequest.content,
        createdAt: pdfRequest.createdAt,
        fileId,
      }));
    
      const { input, handleInputChange, handleSubmit, messages } = useChat({ api: "/api/PDFRequestResponse", body: { fileId }, initialMessages: transformedRequests });

      React.useEffect(() => {
        const PDFRequestContainer = document.getElementById("PDFRequest-container");

        if (PDFRequestContainer) 
        {
          PDFRequestContainer.scrollTo({
            top: PDFRequestContainer.scrollHeight,
            behavior: "smooth",
        })}

      }, [messages])

      const enrichedMessages = messages.map((msg) => ({
          id: Number(msg.id) || Date.now(), 
          content: msg.content,
          createdAt: msg.createdAt || new Date(),
          fileId: fileId,
          role: msg.role === "user" ? UserSystemEnum.USER : UserSystemEnum.SYSTEM,
      }));
      
    return (
        <div className="" id="PDFRequest-container">
            <PDFRequestsListedAdmin PDFRequests={enrichedMessages} isLoading={isLoading} />
        </div>
    )
}

export default PDFRequestsAdminPage;
