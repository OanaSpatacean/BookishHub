import React from 'react';
import LessonsDisplayBox from '@/components/LessonsDisplayBox';
import Link from 'next/link';
import { ArrowRight, InfoIcon } from 'lucide-react';
import { databaseClient } from '@/lib/database';

type Props = {}

const LessonsDisplayPage = async (props: Props) => {

  const lessons = await databaseClient.lesson.findMany({
    include: 
    {
      modules: 
      {
        include: 
        {
          topics: true
        }
      }}})

  return (
    <div className="max-w-7xl 
                    mx-auto  
                    py-8">
      <div className="text-center 
                      mb-10">
            <h1 className="sm:text-5xl 
                           text-left 
                           font-bold 
                           text-3xl 
                           underline 
                           decoration-4 
                           decoration-blue-500">
                Your designed lessons
            </h1>

            <Link href="/design" className="mt-10
                                            inline-block 
                                            bg-blue-500 
                                            text-white 
                                            shadow-lg 
                                            hover:bg-blue-800 
                                            transition-colors 
                                            duration-200 
                                            rounded-lg 
                                            py-2
                                            px-7 
                                            flex 
                                            items-center 
                                            text-xl">
                Click here to design a brand new lesson
                <ArrowRight strokeWidth={5} className="ml-[780px] 
                                                       h-9 
                                                       w-9"/>
            </Link>
      </div>

      <div className="bg-secondary 
                      border-none 
                      p-4 
                      flex
                      mb-9">
          <div className="flex-shrink-0">
              <InfoIcon 
                  className="text-green-500 
                              h-10 
                              w-10 
                              bg-green-100 
                              rounded-full 
                              p-2 
                              shadow-sm" />
          </div>

          <div className="ml-5">
            Welcome to your personalized lesson library! Here, you will find all the lessons you have designed, giving you the opportunity to revisit and expand your knowledge whenever you wish. This library serves as a valuable resource for continuous improvement. To design a new lesson according to your needs, please click the button above and start designing your next lesson.                
          </div>
      </div>

      {lessons.length === 0 ? (
       <div className="flex items-center justify-center h-[30vh]">
       <div className="text-gray-400 italic text-center">
         You have not designed any lessons yet
       </div>
     </div>
      ) : (
        <div className="gap-4 
                        flex-col flex">
          {lessons.map((lesson) => (
            <LessonsDisplayBox key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
      </div>
)}

export default LessonsDisplayPage;
