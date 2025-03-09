'use client'
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Language, LanguageSession, ListeningExercise } from "@prisma/client";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

type Props = 
{
    language: Language,
    languageSession: LanguageSession,
    listeningExercises: ListeningExercise[]
}

const Listening = ({ language, languageSession, listeningExercises }: Props) => {
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [results, setResults] = useState<Record<string, boolean | null>>({});

    useEffect(() => {
        const savedAnswers = localStorage.getItem("listeningAnswers");

        if (savedAnswers) 
        {
            setUserAnswers(JSON.parse(savedAnswers));
        }
    }, [])

    useEffect(() => {
        if (Object.keys(userAnswers).length > 0) 
        {
            localStorage.setItem("listeningAnswers", JSON.stringify(userAnswers));
        }
    }, [userAnswers])

    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const newAnswers: Record<string, string> = {};
        const newResults: Record<string, boolean | null> = {};

        listeningExercises.forEach((exercise) => {
            const userInput = formData.get(exercise.id) as string;
            newAnswers[exercise.id] = userInput ? userInput.trim() : "";
            
            if (!userInput) 
            {
                newResults[exercise.id] = null;
            } 
            else 
            {
                newResults[exercise.id] = userInput.toLowerCase() === exercise.correctText.trim().toLowerCase();
            }
        })
        
        setUserAnswers(newAnswers);
        setResults(newResults);
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
                    Stage 5 - Listening
                </h1>
                
                <form onSubmit={handleSubmit}>
                    {listeningExercises.map((exercise) => (
                        <div key={exercise.id} className={`relative rounded-lg p-4 dark:bg-gray-700 border-4 mt-4 ${
                            results[exercise.id] === true ? "border-green-500 bg-gray-100" :
                            results[exercise.id] === false ? "border-red-400 bg-gray-100" :
                            "border-gray-100 bg-gray-100"}`}>                            
                            <audio controls className="">
                                <source src={exercise.audioUrl} type="audio/wav" />
                                Your browser does not support the audio element.
                            </audio>
                            
                            <Input id={exercise.id} name={exercise.id} placeholder="Type what you hear..." value={userAnswers[exercise.id] || ""} onChange={(e) => setUserAnswers(prev => ({ ...prev, [exercise.id]: e.target.value }))} className="mt-2 
                                                                                                                                                                                                                                                    w-full"/>        
                            {results[exercise.id] !== null && (
                                <div className="absolute 
                                                top-4 
                                                right-4">
                                    {results[exercise.id] ? (
                                        <FiCheckCircle className="text-green-500 
                                                                  w-6 
                                                                  h-6"/>
                                    ) : (
                                        <FiXCircle className="text-red-400 
                                                              w-6 
                                                              h-6"/>
                                    )}
                                </div>
                            )}

                            {results[exercise.id] === false && (
                                <p className="text-green-600 
                                              mt-2 
                                              font-semibold">
                                    Correct answer: {exercise.correctText}
                                </p>
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
            </div>
        </div>
    )
}

export default Listening;