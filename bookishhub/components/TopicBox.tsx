"use client"
import { useToast } from './ui/use-toast';
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
    handledTopics: Set<String>;
    setHandledTopics: React.Dispatch<React.SetStateAction<Set<String>>>;
};

const TopicBox = React.forwardRef<TopicBoxHandler, Props>(({topic, topicIndex, handledTopics, setHandledTopics}, ref) => {
    const {mutate: gatherTopicInformation, isLoading} = useMutation({
        mutationFn: async () => {
          const response = await axios.post("/api/topic/gatherInformation",
          {
            topicId: topic.id
          });
          return response.data;
    }});

    const { toast } = useToast();

    React.useImperativeHandle(ref, () => ({
        async startLoading() 
        {
            gatherTopicInformation(undefined, {
                    onSuccess: () => {
                        setSuccess(true);
                },
                onError: (error: any) => {
                    setSuccess(false);
                    console.error(error);
                    toast({title: "Warning", description: "At least one of the topics could not be handled.", variant: "destructive"});
                }
            })
        }
    }));
    
    const [success, setSuccess] = React.useState<boolean|null>(null);    

    const registerTopicId = React.useCallback(() => {
            setHandledTopics((prior) => 
            {
            const updatedSet = new Set(prior);
            updatedSet.add(topic.id);

            return updatedSet;
            })
        }, 
        [topic.id, setHandledTopics]
      );
  
    
    return (
        <div key={topic.id} 
             className={cn("justify-between rounded mt-2 flex px-4 py-2", 
             {
                "bg-secondary": success === null,
                "bg-yellow-500": success === false,
                "bg-blue-500": success === true,
            })}
        >   
            <h5>Topic {topicIndex+1}: {topic.topicName}</h5>        
        </div>
    );
});

TopicBox.displayName="TopicBox";

export default TopicBox;
