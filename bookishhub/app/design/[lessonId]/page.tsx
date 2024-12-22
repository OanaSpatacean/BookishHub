import React from 'react'
import { redirect } from 'next/navigation';
import ApproveTopics from '@/components/ApproveTopics';
import { getAuthSession } from '@/lib/authentication';
import { databaseClient } from '@/lib/database';

type Props = {
    params: {
      lessonId: string;
    };
  };

const DesignTopics = async ({params:{lessonId}}:Props) => {
    const session = await getAuthSession();

    if (!session?.user) {
        return redirect("/");
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
        return redirect("/design");
    }

    return (
        <div className="flex 
                        flex-col 
                        items-start 
                        mx-auto 
                        px-15  
                        max-w-7xl
                        mt-7">
            
            <h1 className="font-bold 
                           text-5xl 
                           underline 
                           decoration-4 
                           decoration-blue-500">
                {lesson.lessonName}
            </h1>

            <h5 className=" text-seconday-foreground/70 
                            uppercase 
                            text-sm 
                            mt-3">
                Name of the lesson
            </h5>
            
            <ApproveTopics lesson={lesson}/> 
        </div>
    );
};

export default DesignTopics;
