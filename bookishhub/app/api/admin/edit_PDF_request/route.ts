import { databaseClient } from "@/lib/database";
import { z } from "zod";
import { NextResponse } from "next/server";

const parseBody = z.object({ PDFRequestId: z.number() });
const parseUpdateBody = z.object({PDFRequestId: z.number(), content: z.string().min(1, "Content cannot be empty")});

export async function DELETE(request: Request) 
{
    try 
    {
        const body = await request.json();
        const parsedBody = parseBody.safeParse(body);

        if (!parsedBody.success) 
        {
            console.error("Validation error:", parsedBody.error);
            return NextResponse.json({ success: false, error: "Invalid request format" }, { status: 400 });
        }

        const PDFRequestId = Number(parsedBody.data.PDFRequestId); 

        const PDFRequest = await databaseClient.pDFRequest.findUnique({
            where: 
            { 
                id: PDFRequestId 
            }
        })

        if (!PDFRequest) 
        {
            return NextResponse.json(
                { success: false, error: "PDF request does not exist!" },
                { status: 404 }
            )
        }

        await databaseClient.pDFRequest.delete({ 
            where: 
            { 
                id: PDFRequestId 
            }
        })

        return NextResponse.json({
            success: true,
            message: "PDF request deleted successfully"
        })
    } 
    catch (error) 
    {
        console.error("Error processing delete PDF request:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try 
    {
        const body = await request.json();
        const parsedBody = parseUpdateBody.safeParse(body);

        if (!parsedBody.success) 
        {
            console.error("Validation error:", parsedBody.error);
            return NextResponse.json({ success: false, error: "Invalid request format" }, { status: 400 });
        }

        const { PDFRequestId, content } = parsedBody.data;

        const PDFRequest = await databaseClient.pDFRequest.findUnique({
            where: 
            {
                id: PDFRequestId 
            }
        })

        if (!PDFRequest) 
        {
            return NextResponse.json(
                { success: false, error: "PDF request does not exist!" },
                { status: 404 }
            )
        }

        await databaseClient.pDFRequest.update({
            where: { id: PDFRequestId },
            data: { content }
        })

        return NextResponse.json({
            success: true,
            message: "PDF request content updated successfully"
        })
    } 
    catch (error) 
    {
        console.error("Error processing update PDF request:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
