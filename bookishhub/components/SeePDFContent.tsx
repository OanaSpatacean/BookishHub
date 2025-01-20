import React from "react";

type Props = 
{
    pdfURL: string
}

const SeePDFContent = async ({pdfURL}: Props) => {
    return (
        <iframe src={`${pdfURL}`} className="w-full h-full"></iframe>
    )
}

export default SeePDFContent;
