import React from 'react';
import { Topic, Module, Lesson } from '@prisma/client';
import { cn } from '@/lib/utils';
import { Separator } from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';

type Props = 
{
    lesson:Lesson & {modules:(Module & {topics:Topic[]})[]}
    topicId: string
}

const LessonGuide = async ({lesson,topicId}:Props) => 
{
    return (
        <div className="w-[400px] 
                        absolute 
                        rounded-r-3xl 
                        p-6 
                        bg-secondary 
                        -translate-y-1/2 
                        top-[520px] 
                        dark:bg-gray-900
                        pr-[80px]">
            <h1 className="font-bold 
                           text-5xl">
                {lesson.lessonName}
            </h1>

            {lesson.modules.map((module,moduleIndex) => (
                <div className="mt-6" key={module.id}>
                    <h2 className="text-secondary-foreground/60 
                                   uppercase 
                                   text-sm">
                        Module {moduleIndex + 1}
                    </h2>

                    <h2 className="font-bold 
                                   text-2xl">
                        {module.moduleName}
                    </h2>

                    <div className="mt-3">
                        {module.topics.map((topic, topicIndex) => (
                            <div key={topic.id} className="mt-2">
                                <Link href={`/lesson/${lesson.id}/${moduleIndex}/${topicIndex}`} className={cn("hover:text-primary text-secondary-foreground/60",
                                                                                                                {
                                                                                                                    "font-bold text-blue-500":topic.id === topicId
                                                                                                                })}>
                                    {topic.topicName}
                                </Link>
                            </div>
                        ))}
                    </div>

                    {moduleIndex < lesson.modules.length - 1 && (
                        <Separator className="bg-gray-500   
                                              w-full 
                                              mt-4 h-[1px]"/>
                    )}
                </div>
            ))}
        </div>
    )
}

export default LessonGuide;
