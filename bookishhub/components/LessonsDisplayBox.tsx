import { Topic, Module, Lesson } from '@prisma/client';
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {lesson:Lesson & {modules:(Module & {topics:Topic[]})[]}}

const LessonsDisplayBox = ({ lesson }: Props) => {
  return (
    <div className="rounded-lg 
                    border 
                    p-3 
                    flex
                    bg-gray-50
                    dark:bg-gray-900">
      <Link  href={`/lesson/${lesson.id}/0/0`} className="relative">
        <Image width={150} height={150} alt="lesson pic" src={lesson.picture || ""} className="w-sm h-full rounded-lg object-cover"/>
      </Link>

      <div className="flex 
                      flex-grow 
                      justify-between
                      mr-[100px] 
                      flex-col">
        <Link className="items-start 
                         mb-2 
                         flex 
                         justify-end" href={`/lesson/${lesson.id}/0/0`}>

          <h3 className="text-primary '
                         truncate 
                         font-semibold 
                         text-4xl">
            {lesson.lessonName}
          </h3>
        </Link>

        <div className="justify-end 
                        flex">
          <div className="text-secondary-foreground/70">

            <h4 className="text-md">
                Modules:
            </h4>

            <div>
              {lesson.modules.map((module, moduleId) => {
                return (
                  <Link key={module.id} className="underline 
                                                   text-blue-500 
                                                   block 
                                                   w-fit" href={`/lesson/${lesson.id}/${moduleId}/0`}>
                    {module.moduleName}
                  </Link>
                )})}
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

export default LessonsDisplayBox;
