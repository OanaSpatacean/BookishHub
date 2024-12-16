import { databaseClient } from "@/lib/database";
import { ZodError, z } from "zod";
import { NextResponse } from "next/server";

const parseBody = z.object({ lessonId: z.string() });

export async function DELETE(request: Request, response: Response) 
{
    try 
    {
        const body = await request.json();
        const { lessonId } = parseBody.parse(body);

        const lesson = await databaseClient.lesson.findUnique(
        {
            where: 
            { 
                id: lessonId 
            },
            include: 
            { 
                modules: 
                { 
                    include: 
                    { 
                        topics: 
                        { 
                            include: 
                            { 
                                queries: true 
                            } 
                        } 
                    } 
                } 
            },
        });

        if (!lesson) 
        {
            return NextResponse.json(
                { 
                    success: false, error: "Lesson does not exist!" 
                }, 
                { 
                    status: 404 
                }
            );
        }

        const queriesToDelete = lesson.modules.flatMap(module =>
            module.topics.flatMap(topic => topic.queries)
        );

        if (queriesToDelete.length > 0) 
        {
            await databaseClient.query.deleteMany(
            {
                where: 
                { 
                    id: 
                    { 
                        in: queriesToDelete.map(query => query.id) 
                    } 
                }
            });
        }

        const topicsToDelete = lesson.modules.flatMap(module => module.topics);

        if (topicsToDelete.length > 0) 
        {
            await databaseClient.topic.deleteMany(
            {
                where: 
                { 
                    id: 
                    { 
                        in: topicsToDelete.map(topic => topic.id) 
                    } 
                }
            });
        }

        if (lesson.modules.length > 0) 
        {
            await databaseClient.module.deleteMany(
            {
                where: 
                { 
                    id: 
                    { 
                    in: lesson.modules.map(module => module.id) 
                    } 
                }
            });
        }

        await databaseClient.lesson.delete(
        {
            where: 
            { 
                id: lessonId 
            }
        });

        return NextResponse.json(
            { 
                success: true, message: "Lesson, modules, topics and queries deleted successfully" 
            }
        );
    } 
    catch (error) 
    {
        console.error("Error processing delete request:", error);

        if (error instanceof ZodError) 
        {
            return new NextResponse("Incorrect body format", { status: 400 });
        }
        return new NextResponse("Internal server error", { status: 500 });
    }
}
