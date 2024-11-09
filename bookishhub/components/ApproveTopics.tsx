"use client";
import React from 'react'
import TopicBox from './TopicBox';
import { Topic, Module, Lesson  } from '@prisma/client';

type Props = {
    lesson: Lesson & {modules:(Module & {
        topics: Topic[];
      })[]
    }
}

const ApproveTopics = ({lesson}:Props) => {
    return (
        <div className="mt-1 
                        w-full">
            {lesson.modules.map((module, moduleIndex) => {
                return (
                    <div className="mt-7" key={module.uid} >
                        <h2 className="text-secondary-foreground/70 
                                       text-sm 
                                       uppercase">
                            Module {moduleIndex + 1}
                        </h2>
                        <h3 className="font-bold 
                                       text-3xl ">
                            {module.moduleName}
                        </h3>
                        <div className="mt-3">
                            {module.topics.map((topic, topicIndex) => {
                                return (
                                    <TopicBox key={topic.uid} topic={topic} topicIndex={topicIndex}/>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ApproveTopics;
