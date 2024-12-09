"use client"
import { Loader2 } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { cn } from '@/lib/utils';
import React from 'react'
import { useMutation } from '@tanstack/react-query';
import axios from "axios";
import { Topic, Module, Lesson  } from '@prisma/client';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

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
            if (topic.videoId) 
            {
                registerTopicId();
                return;
            }

            gatherTopicInformation(undefined, {
                    onSuccess: () => {
                        setSuccess(true);
                        registerTopicId();
                },
                onError: (error: any) => {
                    setSuccess(false);
                    console.error(error);
                    toast({title: "Warning", description: "At least one of the topics could not be handled.", variant: "destructive"});
                    registerTopicId();
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
  
    React.useEffect(() => {
        if (topic.videoId) {
          setSuccess(true);
          registerTopicId;
        }
      }, [topic, registerTopicId]);
    
    return (
        <div key={topic.id} 
            className={cn("relative justify-between rounded mt-2 flex px-4 py-2", 
            {
                "bg-gray-200 dark:bg-gray-800": success === null, 
                "border-4 border-yellow-400 bg-gray-200 dark:bg-gray-800": success === false, 
                "border-4 border-blue-500 bg-gray-200 dark:bg-gray-800": success === true, 
            })}>
  
            {success !== null && (
                <div className="absolute 
                                top-2 
                                right-2">
                {success === true ? (
                    <FiCheckCircle className="text-blue-500 
                                            w-6 
                                            h-6"/>
                ) : (
                    <FiXCircle className="text-yellow-400 
                                        w-6 
                                        h-6"/>
                )}
                </div>
            )}
  
            <h5>
                Topic {topicIndex+1}: {topic.topicName}
            </h5> 
            
            {
                isLoading 
                && 
                <Loader2 className="animate-spin"/>
            }      
        </div>
    );
});

TopicBox.displayName="TopicBox";

export default TopicBox;
