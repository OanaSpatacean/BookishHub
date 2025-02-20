"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

type Props = 
{
    questions: {
        id: string;
        phrase: string;
        answer: string;
    }[]
}

const Rephrasing = ({ questions }: Props) => {
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

    const [results, setResults] = useState<Record<string, boolean | null>>(
        () => questions.reduce((acc, question) => {
            acc[question.id] = null;
            return acc;
        }, {} as Record<string, boolean | null>)
    )

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const newAnswers: Record<string, string> = {};
        questions.forEach((question) => {
            newAnswers[question.id] = formData.get(question.id) as string;
        })

        setUserAnswers(newAnswers);

        const newResults = { ...results };
        questions.forEach((question) => {
            const userAnswer = newAnswers[question.id]?.trim().toLowerCase();
            const correctAnswer = question.answer.trim().toLowerCase();

            newResults[question.id] = userAnswer === correctAnswer;
        });

        setResults(newResults)
    }

    return (
        <div className="shadow-md 
                        rounded-lg 
                        p-6 
                        dark:bg-gray-800 
                        bg-white 
                        w-full 
                        mb-8">
            <h1 className="sm:text-3xl 
                           text-left 
                           font-bold 
                           text-3xl 
                           mb-8">
                Stage 2 - Rephrasing
            </h1>

            <form onSubmit={handleSubmit}>
                {questions.map((question) => (
                    <div key={question.id} className="border 
                                                      p-4 
                                                      rounded-lg 
                                                      mt-4 
                                                      relative">
                        <h2 className="text-gray-800 
                                       font-semibold 
                                       dark:text-gray-100 
                                       mb-2">
                            {question.phrase}
                        </h2>

                        <Label htmlFor={question.id}>Your rephrased version</Label>
                        <Input id={question.id} name={question.id} placeholder="Enter your rephrased version..." className="mt-2 
                                                                                                                            w-full"/>

                        {results[question.id] !== null && (
                            <div className="absolute 
                                            top-4 
                                            right-4">
                                {results[question.id] ? (
                                    <FiCheckCircle className="text-green-500 
                                                              w-6 
                                                              h-6"/>
                                ) : (
                                    <FiXCircle className="text-red-400 
                                                          w-6 
                                                          h-6" />
                                )}
                            </div>
                        )}
                    </div>
                ))}

                <Button type="submit" size="lg" className="mt-6 
                                                           w-full 
                                                           font-semibold">
                    Check answers
                </Button>
            </form>
        </div>
    );
};

export default Rephrasing;
