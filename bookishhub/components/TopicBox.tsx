"use client"
import { cn } from '@/lib/utils';
import React from 'react'
import { useMutation } from '@tanstack/react-query';
import axios from "axios";
import { Topic, Module, Lesson  } from '@prisma/client';

export type TopicBoxHandler = 
{
    startLoading: () => 
        void;
};

type Props = {
    topic:  Topic;
    topicIndex: number;
};

const TopicBox = React.forwardRef<TopicBoxHandler, Props>(({topic, topicIndex}, ref) => {
    const {mutate: gatherTopicInformation, isLoading} = useMutation({
        mutationFn: async () => {
          const response = await axios.post("/api/topic/gatherInformation",
          {
            topicId: topic.uid
          });
          return response.data;
    }});

    React.useImperativeHandle(ref, () => ({
        async startLoading() 
        {
            gatherTopicInformation(undefined, {
                onSuccess: () => {
                  console.log('succeeded');
            }});
        }
    }));
    
    const [success, setSuccess] = React.useState<boolean|null>(null);    
    
    return (
        <div key={topic.uid} 
             className={cn("justify-between rounded mt-2 flex px-4 py-2", 
             {
                "bg-secondary": success === null,
                "bg-orange-500": success === false,
                "bg-blue-400": success === true,
            })}
        >   
            <h5>Topic {topicIndex+1}: {topic.topicName}</h5>        
        </div>
    );
});

TopicBox.displayName="TopicBox";

export default TopicBox;
