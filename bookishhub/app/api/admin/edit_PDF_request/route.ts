import { databaseClient } from "@/lib/database";
import { ZodError, z } from "zod";
import { NextResponse } from "next/server";

const parseBody = z.object({ PDFRequestId: z.number() });

export async function DELETE(request: Request) {
    try 
    {
        const body = await request.json();
        const { PDFRequestId } = parseBody.parse(body);

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

        if (error instanceof ZodError) 
        {
            return new NextResponse("Incorrect body format", { status: 400 });
        }

        return new NextResponse("Internal server error", { status: 500 });
    }
}
