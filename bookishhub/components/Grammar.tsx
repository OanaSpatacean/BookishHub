"use client";
import React from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { RadioGroupItem, RadioGroup } from "./ui/radio-group";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { InfoIcon } from "lucide-react";

type Props = 
{
    questions: 
    {
        id: string;
        question: string;
        answer: string;
        choices: string; 
    }[]
}

const Grammar = ({ questions }: Props) => {
    const [answers, setAnswers] = React.useState<Record<string, string>>({});

    const [questionState, setQuestionState] = React.useState<Record<string, boolean | null>>(
        () =>
        questions.reduce((state, question) => {
            state[question.id] = null;
            return state;
        }, {} as Record<string, boolean | null>)
    );

    React.useEffect(() => {
        const savedAnswers = localStorage.getItem("grammarAnswers");
        if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
        }
    }, []);

    React.useEffect(() => {
        if (Object.keys(answers).length > 0) 
        {
            localStorage.setItem("grammarAnswers", JSON.stringify(answers));
        }
    }, [answers]);

    const checkAnswer = React.useCallback(() => {
        const updatedQuestionState = { ...questionState };

        questions.forEach((question) => {
        const givenAnswer = answers[question.id];

        if (!givenAnswer) 
            return;

        updatedQuestionState[question.id] = givenAnswer === question.answer
        })

        setQuestionState(updatedQuestionState)
    }, [answers, questionState, questions])

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
                           underline 
                           decoration-4 
                           decoration-purple-400 
                           mb-8">
                Grammar 
            </h1>

            <div className="mt-4 
                            gap-6 
                            dark:bg-gray-800">
                {questions.map((question) => (
                    <div key={question.id} className={`relative rounded-lg p-4 dark:bg-gray-700 ${questionState[question.id] === true
                                                                                                    ? "border-4 border-purple-500 dark:border-purple-500 bg-gray-100"
                                                                                                    : questionState[question.id] === false
                                                                                                    ? "border-4 border-yellow-400 dark:border-yellow-400 bg-gray-100"
                                                                                                    : "border-4 border-gray-100 dark:border-gray-700 bg-gray-100"
                                                                                                } mt-4`}>
                        {questionState[question.id] !== null && (
                            <div className="absolute top-2 right-2">
                                {questionState[question.id] === true ? (
                                    <FiCheckCircle className="text-purple-500 
                                                              w-6 
                                                              h-6" />
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
                            {question.question}
                        </h2>

                        <div className="mt-3 
                                        dark:bg-gray-700">
                            <RadioGroup onValueChange={(value) =>   setAnswers((prev) => ({
                                                                        ...prev,
                                                                        [question.id]: value,
                                                                    }))}>
                                {JSON.parse(question.choices).map((option: string, index: number) => (
                                    <div key={index} className="flex 
                                                                items-center 
                                                                space-x-2">
                                        <RadioGroupItem value={option} id={question.id + index.toString()} className="rounded-full 
                                                                                                                      h-5 
                                                                                                                      w-5 
                                                                                                                      border-gray-400 
                                                                                                                      border"/>
                                        <Label htmlFor={question.id + index.toString()}>
                                            {option}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    </div>
                ))}
            </div>

            <Button onClick={checkAnswer} size="lg" className="mt-6 
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
                    Simply click the "Check answers" button above to see how well you did and to review your choices.
                </div>
            </div>
        </div>
    );
};

export default Grammar;
