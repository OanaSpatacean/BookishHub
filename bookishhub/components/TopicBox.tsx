"use client"
import { cn } from '@/lib/utils';
import React from 'react'
import { Topic, Module, Lesson  } from '@prisma/client';

type Props = {
    topic:  Topic;
    topicIndex: number;
};

const TopicBox = ({topic, topicIndex}:Props) => {
    const [success, setSuccess] = React.useState<boolean|null>(null);    
    
    return (
        <div key={topic.uid} 
             className={cn("justify-between rounded mt-2 flex px-4 py-2", 
             {
                "bg-secondary": success === null,
                "bg-orange-600": success === false,
                "bg-blue-600": success === true,
            })}
        >   
            <h5>Topic {topicIndex+1}: {topic.topicName}</h5>        
        </div>
    );
};

export default TopicBox;
