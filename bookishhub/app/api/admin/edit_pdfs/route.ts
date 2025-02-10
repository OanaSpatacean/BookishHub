import { databaseClient } from "@/lib/database";
import { ZodError, z } from "zod";
import { NextResponse } from "next/server";

const parseBody = z.object({ PDFFileId: z.number() });

export async function DELETE(request: Request) {
    try 
    {
        const body = await request.json();
        const { PDFFileId } = parseBody.parse(body);

        const pdfFile = await databaseClient.files.findUnique({
            where: 
            {
                id: PDFFileId,
            },
            include: 
            {
                PDFRequests: true
            }
        })

        if (!pdfFile) 
        {
            return NextResponse.json(
                { success: false, error: "File does not exist!" },
                { status: 404 }
            )
        }

        if (pdfFile.PDFRequests.length > 0) {
            await databaseClient.pDFRequest.deleteMany({
                where: 
                {
                    id: 
                    {
                        in: pdfFile.PDFRequests.map((request) => request.id)
                    }
                }
            })
        }

        await databaseClient.files.delete({
            where: 
            {
                id: PDFFileId,
            }
        })

        return NextResponse.json({
            success: true,
            message: "File and related requests deleted successfully"
        })
    } 
    catch (error) 
    {
        console.error("Error processing delete file:", error);

        if (error instanceof ZodError) 
        {
            return new NextResponse("Incorrect body format", { status: 400 });
        }

        return new NextResponse("Internal server error", { status: 500 });
    }
}
