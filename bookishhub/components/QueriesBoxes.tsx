"use client";
import React from 'react';
import { Button } from './ui/button';
import { Query, Topic } from '@prisma/client';
import { Label } from './ui/label';
import { RadioGroupItem, RadioGroup } from './ui/radio-group';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

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
                    dark:bg-gray-800 
                    bg-white
                    ml-[-40px]">
      <h1 className="sm:text-5xl 
                     text-left 
                     font-bold 
                     text-3xl 
                     underline 
                     decoration-4 
                     decoration-blue-500
                     mb-8">
        Notion Verification
      </h1>

      <div className="mt-4 
                      grid 
                      grid-cols-1 
                      md:grid-cols-2 
                      lg:grid-cols-3 
                      gap-6 
                      dark:bg-gray-800">
        {topic.queries.map((query) => (
          <div className={`relative rounded-lg p-4 dark:bg-gray-700 ${   queryState[query.id] === true
                                                                          ? 'border-4 border-blue-500 dark:border-blue-500 bg-gray-100'
                                                                          : queryState[query.id] === false
                                                                          ? 'border-4 border-yellow-400 dark:border-yellow-400 bg-gray-100'
                                                                          : 'border-4 border-gray-100 dark:border-gray-700 bg-gray-100'
                                                                      }`}key={query.id}>

            {queryState[query.id] !== null && (
            <div className="absolute top-2 right-2">
              {queryState[query.id] === true ? (
                <FiCheckCircle className="text-blue-500 
                                          w-6 
                                          h-6"/>
              ) : (
                <FiXCircle className="text-yellow-400 
                                      w-6 
                                      h-6" />
              )}
            </div>
            )}

            <h2 className="text-gray-800 
                           font-semibold 
                           dark:text-gray-100">
              {query.query}
            </h2>

            <div className="mt-3 
                            dark:bg-gray-700">
              <RadioGroup onValueChange={(value: any) => {setSolutions((prev) => ({
                                                            ...prev,
                                                            [query.id]: value,
                                                          }))}}>

                {JSON.parse(query.choices).map((option: string, index: number) => (
                  <div key={index} className="flex 
                                              items-center 
                                              space-x-2">
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
                                                            w-full
                                                            mb-5
                                                            font-semibold
                                                            text-white
                                                            text-md 
                                                            transition 
                                                            bg-gradient-to-r 
                                                            from-blue-500 
                                                            to-blue-900 
                                                            hover:from-blue-600 
                                                            hover:to-blue-800">
        Verify solutions
      </Button>
    </div>
  )
}

export default QueriesBoxes;
