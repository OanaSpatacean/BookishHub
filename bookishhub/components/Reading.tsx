"use client";
import React, { useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { Label } from "./ui/label";
import { RadioGroupItem, RadioGroup } from "./ui/radio-group";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Language, LanguageSession, TextWriting } from "@prisma/client";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft, InfoIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  language: Language;
  languageSession: LanguageSession;
  readingText: {
    id: string;
    text: string;
  };
  readingQuestions: {
    id: string;
    question: string;
    answer: string;
    choices: string;
  }[];
  text: TextWriting;
}

const Reading = ({ language, languageSession, readingText, readingQuestions, text }: Props) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [questionState, setQuestionState] = useState<Record<string, boolean | null>>(
    () =>
      readingQuestions.reduce((state, question) => {
        state[question.id] = null;
        return state;
      }, {} as Record<string, boolean | null>)
  )

  React.useEffect(() => {
      const savedAnswers = localStorage.getItem("readingAnswers");
      if (savedAnswers) {
          setAnswers(JSON.parse(savedAnswers));
      }
  }, []);

  React.useEffect(() => {
      if (Object.keys(answers).length > 0) 
          {
          localStorage.setItem("readingAnswers", JSON.stringify(answers));
      }
  }, [answers]);

  const { toast } = useToast();
  const router = useRouter();

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const checkAnswer = () => {
    const updatedQuestionState = { ...questionState };

    readingQuestions.forEach((question) => {
      const givenAnswer = answers[question.id];

      if (!givenAnswer) 
          return;

      updatedQuestionState[question.id] = givenAnswer === question.answer;
    });

    setQuestionState(updatedQuestionState);
  }

  const { mutate: saveReadingAnswers } = useMutation({
    mutationFn: async ({ questionId, userAnswer }: { questionId: string; userAnswer: string }) => {
      await axios.post("/api/language/readingAnswers", {
        questionId,
        userAnswer
      })
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to save answer: " + error, variant: "destructive" });
    }
  })

  const handleSubmit = () => {
    toast({ title: "Done", description: "You've completed the reading exercise!" });
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
                       underline 
                       decoration-4 
                       decoration-purple-400 
                       mb-5">
          Stage 6 - Reading
        </h1>

        <p className="text-lg 
                      dark:text-gray-100 
                      mb-5">
            {readingText.text}
        </p>

        <div className="mt-4 
                        gap-6 
                        dark:bg-gray-800">
          {readingQuestions.map((question) => (
            <div key={question.id} className={`relative rounded-lg p-4 dark:bg-gray-700 ${questionState[question.id] === true
                                                                                            ? "border-4 border-green-500 dark:border-green-500 bg-gray-100"
                                                                                            : questionState[question.id] === false
                                                                                            ? "border-4 border-red-400 dark:border-red-400 bg-gray-100"
                                                                                            : "border-4 border-gray-100 dark:border-gray-700 bg-gray-100"
                                                                                        } mt-4`}>
              {questionState[question.id] !== null && (
                <div className="absolute 
                                top-2 
                                right-2">
                  {questionState[question.id] === true ? (
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

              <h2 className="text-gray-800 
                             font-semibold 
                             dark:text-gray-100">
                {question.question}
              </h2>

              <div className="mt-3 
                              dark:bg-gray-700">
                <RadioGroup onValueChange={(value) => handleAnswerChange(question.id, value)} value={answers[question.id] || ""}>
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

              {questionState[question.id] === false && (
                <p className="text-green-600 
                              mt-2 
                              font-semibold">
                  Correct answer: {question.answer}
                </p>
              )}
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
                In this section, you'll find a reading passage followed by a set of questions designed to test your comprehension. Read the text carefully, then answer the questions based on its content.        
                This is the last step in completing your language assessment, so take your time, read carefully, and give it your best effort!
              </div>
            </div>

              <div className="w-full 
                                flex 
                                justify-between 
                                items-center 
                                mb-5">                
                    <Link href={`/language/${language.id}/${languageSession.id}/listening//${text.id}`} className={`${buttonVariants({ className: "flex items-center font-semibold bg-purple-500 hover:bg-purple-800" })}`}>
                        <ArrowLeft strokeWidth={5} className="ml-1 
                                                                h-3 
                                                                w-3"/>
                        Return to the previous stage
                    </Link>

                    <Link href={`/language/${language.id}/`} className={`${buttonVariants({ className: "flex items-center font-semibold bg-purple-500 hover:bg-purple-800" })}`}>
                        You are done! Press here to review your existing language sessions or create a new language assessment
                        🏆
                    </Link>
          </div>
    </div>
  )
}

export default Reading;
