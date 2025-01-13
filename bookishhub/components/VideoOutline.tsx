import { Topic, Module } from '@prisma/client';
import React from 'react';

type Props = 
{
  module: Module;
  moduleId: number;
  topic: Topic;
  topicId: number;
}

const VideoOutline = ({module,moduleId,topic,topicId}:Props) => 
{
  return (
    <div className="shadow-md 
                    rounded-lg
                    dark:bg-gray-800 
                    bg-white 
                    p-6
                    ml-[-40px]">
      <div className="mb-6">

        <h1 className="sm:text-5xl 
                       text-left 
                       font-bold 
                       text-3xl 
                       underline 
                       decoration-4 
                       decoration-blue-500
                       mb-[10px]">
            {topic.topicName}
        </h1>

        <h4 className="uppercase 
                       tracking-wider 
                       text-sm 
                       text-gray-500
                       mb-[30px]
                       font-bold">
            Currently reading Module {moduleId + 1} . Topic {topicId + 1}
        </h4>
      </div>

      <div className="mt-8
                      mb-8">
        <h3 className="font-bold 
                      text-gray-800 
                      dark:text-white 
                      text-2xl">
          Outline
        </h3>

        <p className="mt-4 
                      leading-relaxed 
                      text-gray-700 
                      dark:text-gray-300">
          {topic.outline}
        </p>
      </div>

      <iframe allowFullScreen src={`https://www.youtube.com/embed/${topic.videoId}`} className="border-gray-200 
                                                                                                rounded-lg 
                                                                                                w-full 
                                                                                                shadow-lg 
                                                                                                border 
                                                                                                aspect-video
                                                                                                mb-5" title="Video of the current topic"/>
      
    </div>
  )
}

export default VideoOutline;
