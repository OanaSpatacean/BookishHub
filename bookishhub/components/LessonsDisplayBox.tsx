import { Topic, Module, Lesson } from '@prisma/client';
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {lesson:Lesson & {modules:(Module & {topics:Topic[]})[]}}

const LessonsDisplayBox = async ({ lesson }: Props) => {
  return (
    <div className="rounded-lg 
                    border 
                    p-4 
                    flex">
      <Link  href={`/lesson/${lesson.id}/0/0`} className="w-[120px] h-[120px] relative">
        <Image width={150} height={150} alt="lesson pic" src={lesson.picture || ""} className="w-full h-full rounded-lg object-cover"/>
      </Link>

      <div className="flex flex-grow justify-between ml-4 flex-col">
        <Link className="items-start 
                         mb-2 
                         flex 
                         justify-end" href={`/lesson/${lesson.id}/0/0`}>

          <h3 className="text-primary '
                         truncate 
                         font-semibold 
                         text-3xl">
            {lesson.lessonName}
          </h3>
        </Link>

        <div className="justify-end 
                        flex">
          <div className="text-secondary-foreground/70">

            <h4 className="text-sm">
                Modules
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
