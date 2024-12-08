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
                    bg-white 
                    p-6">
      <div className="mb-6">

        <h4 className="uppercase 
                       tracking-wider 
                       text-sm 
                       text-gray-500">
            Module {moduleId + 1} &bull; Topic {topicId + 1}
        </h4>

        <h1 className="sm:text-5xl 
                       text-left 
                       font-bold 
                       text-3xl 
                       underline 
                       decoration-4 
                       decoration-blue-500
                       mb-[30px]">
            {topic.topicName}
        </h1>
      </div>

      <iframe allowFullScreen src={`https://www.youtube.com/embed/${topic.videoId}`} className="border-gray-200 rounded-lg w-full shadow-lg border aspect-video" title="Video of the current topic"/>
      
      <div className="mt-8">
        <h3 className="font-semibold 
                       text-gray-800 
                       text-2xl ">
            Outline
        </h3>

        <p className="mt-4 
                      leading-relaxed 
                      text-gray-700">
            {topic.outline}
        </p>
      </div>
    </div>
  )
}

export default VideoOutline;
