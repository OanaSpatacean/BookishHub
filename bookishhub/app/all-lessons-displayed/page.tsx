import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
                                            font-semibold 
                                            shadow-lg 
                                            hover:bg-blue-800 
                                            transition-colors 
                                            duration-200 
                                            rounded-lg 
                                            py-3
                                            px-5 
                                            flex 
                                            items-center 
                                            text-xl">
                Design a brand new lesson
                <ArrowRight strokeWidth={5} className="ml-[850px] h-9 w-9"/>
            </Link>
      </div>

    </div>
)}

export default LessonsDisplayPage;
