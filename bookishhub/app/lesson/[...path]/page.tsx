import QueriesBoxes from '@/components/QueriesBoxes';
import VideoOutline from '@/components/VideoOutline';
import React from 'react';
import { databaseClient } from '@/lib/database';
import { redirect } from 'next/navigation';
import LessonGuide from '@/components/LessonGuide';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link'; 

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
    return redirect('/lessonsLibrary');
  }

  const moduleIndex = parseInt(moduleId);
  const module = lesson.modules[moduleIndex];

  const topicIndex = parseInt(topicId);
  const topic = module?.topics[topicIndex];

  const priorTopic = module?.topics[topicIndex - 1];
  let upcomingTopic = module?.topics[topicIndex + 1];

  let upcomingModuleIndex = moduleIndex;
  let upcomingTopicIndex = topicIndex + 1;

  if (!upcomingTopic && moduleIndex + 1 < lesson.modules.length) 
  {
    upcomingModuleIndex = moduleIndex + 1;
    upcomingTopicIndex = 0;
    upcomingTopic = lesson.modules[upcomingModuleIndex]?.topics[0];
  }

  if (!module || !topic) {
    return redirect('/lessonsLibrary');
  }

  return (
    <div className="bg-gray-100 
                    dark:bg-gray-900
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

          <div className="relative pb-8 mb-[15px]">
            {(moduleIndex > 0 || topicIndex > 0) && (
              <Link href={topicIndex > 0
                          ? `/lesson/${lesson.id}/${moduleIndex}/${topicIndex - 1}`
                          : `/lesson/${lesson.id}/${moduleIndex - 1}/${lesson.modules[moduleIndex - 1].topics.length - 1}`
                          } className="absolute 
                                       left-[2px] 
                                       bottom-[-35px] 
                                       top-[25px] 
                                       bg-blue-500 
                                       text-white 
                                       font-semibold 
                                       shadow-lg 
                                       hover:bg-blue-800
                                       transition-colors 
                                       duration-200 
                                       rounded-lg 
                                       py-2 
                                       px-6 
                                       flex 
                                       items-center  
                                       truncate">
                <div className="flex 
                                items-center 
                                text-sm">
                  <ArrowLeft strokeWidth={5} className="ml-[-8px]
                                                        mr-2
                                                        h-4 
                                                        w-4"/>
                    {topicIndex > 0
                      ? `Module ${moduleIndex + 1} . Topic ${topicIndex}: ${priorTopic?.topicName}`
                      : `Module ${moduleIndex} . Topic ${lesson.modules[moduleIndex - 1].topics.length}: 
                        ${lesson.modules[moduleIndex - 1].topics[lesson.modules[moduleIndex - 1].topics.length - 1].topicName}`}
                </div>
              </Link>
            )}

            {upcomingTopic && (
              <Link href={`/lesson/${lesson.id}/${upcomingModuleIndex}/${upcomingTopicIndex}`} className="absolute 
                                                                                                  right-[-1170px] 
                                                                                                  bottom-[-35px] 
                                                                                                  top-[25px] 
                                                                                                  bg-blue-500 
                                                                                                  text-white 
                                                                                                  font-semibold 
                                                                                                  shadow-lg 
                                                                                                  hover:bg-blue-800 
                                                                                                  transition-colors 
                                                                                                  duration-200 
                                                                                                  rounded-lg 
                                                                                                  py-2 
                                                                                                  px-6 
                                                                                                  flex 
                                                                                                  items-center                                                                                                
                                                                                                  truncate">
                <div className="flex 
                                items-center 
                                text-sm">
                  {`Module ${upcomingModuleIndex + 1} . Topic ${upcomingTopicIndex + 1}: ${upcomingTopic.topicName} `}
                  <ArrowRight strokeWidth={5} className="ml-1 
                                                         h-4 
                                                         w-4"/>
                </div>
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default LessonPage;
