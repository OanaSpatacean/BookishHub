"use client";
import React from 'react';
import { Button } from './ui/button';
import { Query, Topic } from '@prisma/client';
import { Label } from './ui/label';
import { RadioGroupItem, RadioGroup } from './ui/radio-group';

type Props = 
{
  topic:Topic & {queries:Query[]}
}

const QueriesBoxes = ({topic}:Props) => {
    const [solutions, setSolutions] = React.useState<Record<string, string>>({});

    
    const [queryState, setQueryState] = React.useState<Record<string, boolean | null>>(() =>
      topic.queries.reduce((state, query) => {
        state[query.id] = null;
        return state;
      }, {} as Record<string, boolean | null>))
  

    const verifySolution = React.useCallback(() => {
      const updatedQueryState = { ...queryState };
  
      topic.queries.forEach((query) => {
        const givenSolution = solutions[query.id];

        if (!givenSolution) 
          return;
  
        updatedQueryState[query.id] = givenSolution === query.solution})
  
    
      setQueryState(updatedQueryState)}, [solutions, queryState, topic.queries])
  
    return (
      <div className="shadow-md 
                      rounded-lg 
                      p-6 
                      bg-white">
        <h1 className="sm:text-5xl 
                       text-left 
                       font-bold 
                       text-3xl 
                       underline 
                       decoration-4 
                       decoration-blue-500">
            Notion Verification
        </h1>

        <div className="mt-4 space-y-6">
          {topic.queries.map((query) => (
            <div className={`rounded-lg p-4 ${  queryState[query.id] === true
                                                ? 'bg-blue-500 border border-blue-300'
                                                : queryState[query.id] === false
                                                ? 'bg-yellow-400 border border-yellow-300'
                                                : 'bg-gray-50 border border-gray-200'}`} key={query.id}>

              <h2 className="text-gray-800 
                             font-semibold">
                    {query.query}
              </h2>

              <div className="mt-3">
                <RadioGroup onValueChange={(value: any) => {setSolutions((prev) => ({
                                                            ...prev,
                                                            [query.id]: value,
                                                            }))}}>
                                                                
                  {JSON.parse(query.choices).map((option: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={query.id + index.toString()} className="rounded-full 
                                                                                                 h-5 
                                                                                                 w-5 
                                                                                                 border-gray-400 
                                                                                                 border"/>

                        <Label htmlFor={query.id + index.toString()}>
                            {option}
                        </Label>
                    </div>))}
                </RadioGroup>
              </div>
            </div>))}
        </div>

        <Button onClick={verifySolution} size="lg" className="mt-6 
                                                              w-full">
            Verify solutions
        </Button>
      </div>
    )
  }

export default QueriesBoxes;
