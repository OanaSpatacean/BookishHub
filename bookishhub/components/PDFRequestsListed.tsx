import { PDFRequest } from "@prisma/client";
import React from "react";

type Props = 
{
    PDFRequests: PDFRequest[];
    isLoading: boolean;
}

const PDFRequestsListed = ({PDFRequests, isLoading}: Props) => {
    
    return (
        <div className="h-screen flex">

        </div>
    )
}

export default PDFRequestsListed;
