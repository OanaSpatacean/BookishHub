"use client";
import React, { useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { ArrowLeft, ArrowRight, InfoIcon } from "lucide-react";
import { Language, LanguageSession } from "@prisma/client";
import Link from "next/link";

type Props = 
{
    language: Language,
    languageSession: LanguageSession,
    questions: 
    {
        id: string;
        phrase: string;
        answer: string;
        examplePhrase: string;
        exampleAnswer: string;
    }[]
}

const Rephrasing = ({ language, languageSession, questions }: Props) => {
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
        <div className="w-full">
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

                <div className="bg-gray-100 p-4 mb-8 rounded-lg">
                    <h2 className="text-lg font-semibold">Example:</h2>
                    <p> {questions[0]?.examplePhrase}</p>
                    <p> {questions[0]?.exampleAnswer}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {questions.map((question) => (
                        <div key={question.id} className={`relative rounded-lg p-4 dark:bg-gray-700 ${results[question.id] === true
                                                                                                                ? "border-4 border-green-500 dark:border-green-500 bg-gray-100"
                                                                                                                : results[question.id] === false
                                                                                                                ? "border-4 border-red-400 dark:border-red-400 bg-gray-100"
                                                                                                                : "border-4 border-gray-100 dark:border-gray-700 bg-gray-100"
                                                                                                        } mt-4`}>
                            <h2 className="text-gray-800 
                                        font-semibold 
                                        dark:text-gray-100 
                                        mb-2">
                                {question.phrase}
                            </h2>

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
                                                                mb-5 
                                                                font-semibold 
                                                                text-white 
                                                                text-md 
                                                                transition 
                                                                bg-gradient-to-r 
                                                                from-purple-500 
                                                                to-purple-900 
                                                                hover:from-purple-600 
                                                                hover:to-purple-800">
                        Check answers
                    </Button>
                </form>

                <div className="bg-secondary 
                                border-none 
                                p-4 
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

                    <div className="ml-5">
                        Want to review your answers?
                        Simply click the "Check answers" button above to see how well you did and to review your rephrased versions. Don't forget to follow the example provided, add punctuation accordingly and also the necessary diacritics.
                    </div>
                </div>
            </div>

            <div className="w-full mb-4">
                <Link href={`/language/${language.id}/${languageSession.id}/grammar`} className={`${buttonVariants({ className: "flex items-center font-semibold bg-purple-500 hover:bg-purple-800" })}`}>
                    <ArrowLeft strokeWidth={5} className="ml-1 
                                                            h-3 
                                                            w-3"/>
                    Return to the previous stage
                </Link>
            </div>
        </div>
    )
}

export default Rephrasing;
