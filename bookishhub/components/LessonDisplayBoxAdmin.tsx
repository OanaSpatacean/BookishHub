"use client";
import { Topic, Module, Lesson } from '@prisma/client';
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { deleteLessonSchema } from '@/app/form-validators/lesson';
import { z } from 'zod';
import { useToast } from './ui/use-toast';

type Input = z.infer<typeof deleteLessonSchema>

type Props = {lesson:Lesson & {modules:(Module & {topics:Topic[]})[]}};

const LessonsDisplayBox = async ({ lesson }: Props) => {
    const { toast } = useToast();
    const router = useRouter();

    const { mutate: deleteLesson, isLoading } = useMutation({
        mutationFn: async (input: Input) => {
            const response = await axios.delete("/api/admin/edit_lessons", {
                data: input,
            });
            return response.data;
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Lesson deleted successfully." });
            window.location.reload();
        },
        onError: (error) => {
            console.error(error);
            toast({ title: "Error", description: "An error occurred while deleting the lesson.", variant: "destructive" });
        },
    });

    return (
        <div className="rounded-lg border p-4 flex">
            <Link href={`/lesson/${lesson.id}/0/0`} className="w-[120px] h-[120px] relative">
                <Image width={150}
                       height={150}
                       alt="lesson pic"
                       src={lesson.picture || ""}
                       className="w-full 
                                  h-full 
                                  rounded-lg 
                                  object-cover"/>
            </Link>

            <div className="flex 
                            flex-grow 
                            justify-between
                            ml-4 
                            flex-col">
                <Link className="items-start 
                                 mb-2 
                                 flex 
                                 justify-end" href={`/lesson/${lesson.id}/0/0`}>
                    <h3 className="text-primary
                                   truncate 
                                   font-semibold 
                                   text-3xl">
                        {lesson.lessonName}
                    </h3>
                </Link>

                <div className="justify-end 
                                flex">
                    <div className="text-secondary-foreground/70">
                        <button onClick={() => deleteLesson({ lessonId: lesson.id })} className="underline   
                                                                                                 text-red-500 
                                                                                                 block 
                                                                                                 w-fit 
                                                                                                 disabled:opacity-50" disabled={isLoading}>
                            {isLoading ? "Deleting..." : "Delete Lesson"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LessonsDisplayBox;
