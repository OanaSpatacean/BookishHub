"use client";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Topic, Module, Lesson } from "@prisma/client";
import { Separator } from "./ui/separator";
import React from "react";
import TopicBox from "./TopicBox";
import { buttonVariants, Button } from "./ui/button";

type Props = {
    lesson: Lesson & {modules:(Module & {
        topics: Topic[];
      })[]
    }
}

const ApproveTopics = ({lesson}:Props) => {
    const topicRefs: Record<string, React.RefObject<>> = {};

    lesson.modules.forEach((module) => 
    {
        module.topics.forEach((topic) => 
        {
          //eslint-disable-next-line react-hooks/rules-of-hooks
          topicRefs[topic.uid] = React.useRef(null);
    })})
    
    return (
        <div className="mt-1 
                        w-full">
            {lesson.modules.map((module, moduleIndex) => (
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
                        {module.topics.map((topic, topicIndex) => (
                            <TopicBox key={topic.uid} topic={topic} topicIndex={topicIndex} ref={topicRefs[topic.uid]}/>
                        ))}
                    </div>
                </div>
            ))}
            <div className="justify-center 
                            mt-11 
                            items-center 
                            flex">
                <Separator className="flex-[1]" />
                <div className="mx-6 
                                items-center 
                                flex">
                    <Link href="/generate" className={`${buttonVariants({ variant: "secondary" })} bg-orange-400 text-white`}>                        
                        <ArrowLeft strokeWidth={5} className="mr-1 
                                                              h-3 
                                                              w-3"/>
                        <p className="font-semibold">Prev</p>
                    </Link>
                    <Button type="button" className="font-semibold 
                                                     ml-3 
                                                     bg-blue-400 '
                                                     text-white" onClick={() => {}}>
                        Next
                        <ArrowRight strokeWidth={5} className="ml-1 
                                                               h-3 
                                                               w-3"/>
                    </Button>
                </div>
                <Separator className="flex-[1]" />
            </div>
        </div>
    );
};

export default ApproveTopics;
