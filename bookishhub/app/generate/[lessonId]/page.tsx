import React from 'react'
import { Info } from 'lucide-react';
import { redirect } from 'next/navigation';
import ApproveTopics from '@/components/ApproveTopics';
import { getAuthSession } from '@/lib/authentication';
import { databaseClient } from '@/lib/database';

type Props = {
    params: {
      lessonId: string;
    };
  };

const GenerateTopics = async ({params:{lessonId}}:Props) => {
    const session = await getAuthSession();

    if (!session?.user) {
        return redirect("/captions");
    }
    const lesson = await databaseClient.lesson.findUnique({
        where: {
          id: lessonId,
        },
        include: {
            modules: {
                include: {
                    topics: true,
                }
            }
        }
    });

    if (!lesson) {
        return redirect("/generate");
    }

    return (
        <div className="flex 
                        flex-col 
                        items-start 
                        mx-auto 
                        px-15  
                        max-w-7xl
                        my-11">
            <h5 className=" text-seconday-foreground/70 
                            uppercase 
                            text-sm">
                Name of the lesson
            </h5>
            <h1 className="font-bold 
                           text-6xl ">
                {lesson.lessonName}
            </h1>
            <div className="border-none 
                            bg-secondary 
                            mt-6 
                            p-5 
                            flex">
                <Info className="text-green-500 
                                 h-12 
                                 w-12 
                                 mr-3"/>
                <div>Topics have been created for each of your modules. Please review them and then press the button to approve and proceed. On the next page, you will find your own personalized lesson generated as requested. Enjoy your customized learning experience!</div>
            </div>
            <ApproveTopics lesson={lesson}/>
        </div>
    );
};

export default GenerateTopics;
