'use client'
import React, { useState, useEffect } from "react";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Language, LanguageSession, ListeningExercise, TextWriting } from "@prisma/client";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, InfoIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

type Props = 
{
    language: Language,
    languageSession: LanguageSession,
    listeningExercises: ListeningExercise[],
    text: TextWriting
}

const Listening = ({ language, languageSession, listeningExercises, text }: Props) => {
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

    const { mutate: createReading, isLoading } = useMutation({
        mutationFn: async () => {
            const response = await axios.post("/api/language/reading/create_reading", {
            languageId: String(language.id),
            languageSessionId: String(languageSession.id),
            level: String(languageSession.level),
            });
            return response.data;
        },
        onSuccess: (data) => {
          toast({ title: "Success", description: "Welcome to stage 6! Congratulations! You've made it to the final one!" });
          router.push(`/language/${language.id}/${languageSession.id}/reading/${text.id}`);
        },
        onError: (error) => {
          toast({ title: "Error", description: "An error occurred: " + error, variant: "destructive" });
        }
    })

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
                            {results[exercise.id] !== undefined && results[exercise.id] !== null && (
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
            <div className="bg-secondary 
                        border-none 
                        p-4 
                        flex
                        dark:bg-gray-900
                        mb-5">
              <div className="flex-shrink-0">
                <InfoIcon className="text-green-500 
                                    h-10 
                                    w-10 
                                    bg-green-100 
                                    rounded-full 
                                    p-2 
                                    shadow-sm" />
              </div>

              <div className="ml-5">
                In this section, you will listen to audios generated by our AI. Each clip contains a word or short phrase in {language.name}. Your task is to carefully listen and type exactly what you hear.
                This exercise will help improve your listening comprehension and spelling skills. Don’t worry if you make mistakes—practice makes perfect!
                Click Play ▶️ to start, and enter your answer in the provided field. Good luck!              
              </div>
            </div>

              <div className="w-full 
                                flex 
                                justify-between 
                                items-center 
                                mb-5">                
                    <Link href={`/language/${language.id}/${languageSession.id}/pronunciation//${text.id}`} className={`${buttonVariants({ className: "flex items-center font-semibold bg-purple-500 hover:bg-purple-800" })}`}>
                        <ArrowLeft strokeWidth={5} className="ml-1 
                                                                h-3 
                                                                w-3"/>
                        Return to the previous stage
                    </Link>

                    <Button size="lg" className="flex 
                                      items-center 
                                      font-semibold 
                                      bg-purple-500 
                                      hover:bg-purple-800" onClick={() => createReading()} disabled={isLoading}>
                      {isLoading 
                                    ? <>
                          <Loader2 className="animate-spin 
                                              mr-2 
                                              h-5 
                                              w-5" />
                          Loading...
                        </>
                      : <>
                          Go to the next stage
                          <ArrowRight strokeWidth={5} className="ml-1 
                                                                  h-3 
                                                                  w-3"/>
                        </>
                      }
                    </Button>
          </div>
        </div>
    )
}

export default Listening;