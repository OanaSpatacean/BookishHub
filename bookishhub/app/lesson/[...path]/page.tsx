import QueriesBoxes from '@/components/QueriesBoxes';
import VideoOutline from '@/components/VideoOutline';
import React from 'react';
import { databaseClient } from '@/lib/database';
import { redirect } from 'next/navigation';
import LessonGuide from '@/components/LessonGuide';

type Props = 
{
  params: 
  {
    path: string[]
  }
}

const LessonPage = async ({params:{path} }:Props) => 
{
  const [lessonId, moduleId, topicId] = path;

  const lesson = await databaseClient.lesson.findUnique({
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
              queries: true,
    }}}}}})

  if (!lesson) 
  {
    return redirect('/captions');
  }

  const moduleIndex = parseInt(moduleId);
  const module = lesson.modules[moduleIndex];

  const topicIndex = parseInt(topicId);
  const topic = module.topics[topicIndex];

  if (!module || !topic) 
  {
    return redirect('/captions');
  }

  return (
    <div className="bg-gray-100 
                    min-h-screen">
      <div className="max-w-7xl 
                      mx-auto 
                      px-4 
                      py-8">
        <div className="grid 
                        grid-cols-12 
                        gap-6">
          <div className="col-span-9">
              <VideoOutline module={module} moduleId={moduleIndex} topic={topic} topicId={topicIndex}/>

               <div className="grid 
                               grid-cols-1 
                               gap-6 
                               mt-8">
                    <QueriesBoxes topic={topic}/>
                </div>
          </div>

          <div className="col-span-3">
              <LessonGuide lesson={lesson} topicId={topic.id} />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
