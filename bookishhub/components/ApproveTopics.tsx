"use client";
import { ArrowRight, ArrowLeft, InfoIcon } from "lucide-react";
import Link from "next/link";
import { Topic, Module, Lesson } from "@prisma/client";
import React from "react";
import TopicBox, { TopicBoxHandler } from "./TopicBox";
import { buttonVariants, Button } from "./ui/button";

type Props = {
    lesson: Lesson & {modules:(Module & {
        topics: Topic[];
      })[]
    }
}

const ApproveTopics = ({lesson}:Props) => {
    const topicRefs: Record<string, React.RefObject<TopicBoxHandler>> = {};
    const [loading, setLoading] = React.useState(false);
    const [handledTopics, setHandledTopics] = React.useState<Set<String>>(new Set());

    lesson.modules.forEach((module) => 
    {
        module.topics.forEach((topic) => 
        {
          //eslint-disable-next-line react-hooks/rules-of-hooks
          topicRefs[topic.id] = React.useRef(null);
    })})

    console.log(topicRefs);

    const topicsNumber = React.useMemo(() => {
            return lesson.modules.reduce((number, module) => {return number + module.topics.length}, 0)
        },
        [lesson.modules]
    );
    
    return (
        <div className="mt-5 w-full">
            <div className="grid 
                            grid-cols-1 
                            sm:grid-cols-2 
                            gap-5">
                {lesson.modules.map((module, moduleIndex) => (
                    <div className="mt-5 
                                    px-4 
                                    py-5 
                                    border-4 
                                    relative" key={module.id}>
                        <div className="grid 
                                        grid-cols-1 
                                        sm:grid-cols-2 
                                        gap-9">
                            <h3 className="font-bold 
                                           text-3xl">
                                {module.moduleName}
                            </h3>
                        </div>
                    
                        <h2
                            className="text-sm 
                                       uppercase 
                                       absolute 
                                       top-2 
                                       right-2 
                                       font-bold
                                       text-gray-500">
                            Module {moduleIndex + 1}
                        </h2>

                        <div className="mt-3">
                            {module.topics.map((topic, topicIndex) => (
                                <TopicBox key={topic.id} topic={topic} topicIndex={topicIndex} ref={topicRefs[topic.id]} handledTopics={handledTopics} setHandledTopics={setHandledTopics}/>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-none 
                            bg-secondary 
                            mt-10
                            p-5 
                            flex">
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
                <div className="ml-5">Please review the recommended topics and then press the button to approve and proceed. Wait a few seconds until all the topics are being handled. On the next page, you will find your own personalized lesson designed as requested. Enjoy your customized learning experience!</div>
            </div>
            
            <div className="flex 
                            justify-between 
                            mt-[15px] 
                            items-center 
                            mb-[15px] 
                            px-6">
                <Link href="/design" className={`${buttonVariants({ variant: "secondary" })} bg-red-500 text-black flex items-center`}>
                    <ArrowLeft strokeWidth={5} className="mr-1 
                                                          h-3 
                                                          w-3"/>
                    <p className="font-semibold">Prev</p>
                </Link>
                {handledTopics.size === topicsNumber ? 
                (
                    <Link href={`/lesson/${lesson.id}/0/0`} className={`${buttonVariants({ className: "flex items-center font-semibold hover:bg-blue-800" })}`}>
                        Next
                        <ArrowRight strokeWidth={5} className="ml-1 
                                                               h-3 
                                                               w-3"/>
                    </Link>
                ) 
                : 
                (
                    <Button disabled={loading} type="button" className="font-semibold 
                                                                        bg-blue-500 
                                                                        text-white
                                                                        flex 
                                                                        items-center
                                                                        hover:bg-blue-800" onClick={() => {                        
                        setLoading(true);
                        Object.values(topicRefs).forEach((ref) => { 
                            ref.current?.startLoading();
                        });
                    }}>
                        Start processing the topics
                        <ArrowRight strokeWidth={5} className="ml-1 
                                                               h-3 
                                                               w-3"/>                    
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ApproveTopics;
