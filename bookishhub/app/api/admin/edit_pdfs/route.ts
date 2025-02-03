import { databaseClient } from "@/lib/database";
import { ZodError, z } from "zod";
import { NextResponse } from "next/server";

const parseBody = z.object({ PDFConversationId: z.number() });

export async function DELETE(request: Request) {
    try 
    {
        const body = await request.json();
        const { PDFConversationId } = parseBody.parse(body);

        const pdfConversation = await databaseClient.aboutPDFConversations.findUnique({
            where: 
            {
                id: PDFConversationId,
            },
            include: 
            {
                PDFRequests: true
            }
        })

        if (!pdfConversation) 
        {
            return NextResponse.json(
                { success: false, error: "PDF conversation does not exist!" },
                { status: 404 }
            )
        }

        if (pdfConversation.PDFRequests.length > 0) {
            await databaseClient.pDFRequest.deleteMany({
                where: 
                {
                    id: 
                    {
                        in: pdfConversation.PDFRequests.map((request) => request.id)
                    }
                }
            })
        }

        await databaseClient.aboutPDFConversations.delete({
            where: 
            {
                id: PDFConversationId,
            }
        })

        return NextResponse.json({
            success: true,
            message: "PDF conversation and related requests deleted successfully"
        })
    } 
    catch (error) 
    {
        console.error("Error processing delete PDFconversation:", error);

        if (error instanceof ZodError) 
        {
            return new NextResponse("Incorrect body format", { status: 400 });
        }

        return new NextResponse("Internal server error", { status: 500 });
    }
}
