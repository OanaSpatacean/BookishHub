'use client'
import { useState, useEffect, useRef } from "react";
import { Language, LanguageSession, TextWriting } from "@prisma/client";
import { FiCheckCircle, FiXCircle, FiMic, FiMicOff } from "react-icons/fi";
import { Button, buttonVariants } from "./ui/button";
import { ArrowLeft, ArrowRight, InfoIcon, Loader2 } from "lucide-react";
import Link from "next/link";

type Props = {
  language: Language;
  languageSession: LanguageSession;
  pronunciationWords: 
  {
    id: string;
    word: string;
    recordingUrl?: string; 
  }[]
  text: TextWriting
}

const Pronunciation = ({ language, languageSession, pronunciationWords, text }: Props) => {
  const [recordings, setRecordings] = useState<{ [key: string]: Blob | string | null }>({});
  const [isRecording, setIsRecording] = useState<{ [key: string]: boolean }>({});
  const [feedback, setFeedback] = useState<{ [key: string]: boolean | null }>({});
  const mediaRecorderRef = useRef<{ [key: string]: MediaRecorder | null }>({});

  const handleStartRecording = async (wordId: string) => {
    setIsRecording((prev) => ({ ...prev, [wordId]: true }));

    try 
    {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current[wordId] = mediaRecorder;

      let chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => chunks.push(event.data);

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" });
        setRecordings((prev) => ({ ...prev, [wordId]: audioBlob }));
        setIsRecording((prev) => ({ ...prev, [wordId]: false }));

        await checkPronunciation(wordId, audioBlob);
      }

      mediaRecorder.start();
    } 
    catch (error) 
    {
      console.error("Error recording:", error);
      setIsRecording((prev) => ({ ...prev, [wordId]: false }));
    }
  }

  const handleStopRecording = (wordId: string) => {
    mediaRecorderRef.current[wordId]?.stop();
  }

  const checkPronunciation = async (wordId: string, audioBlob: Blob) => {
    const correctWord = pronunciationWords.find((w) => w.id === wordId)?.word;

    if (!correctWord) 
      return;

    const formData = new FormData();
    formData.append("file", audioBlob);
    formData.append("word", correctWord);
    formData.append("language", language.name);

    try 
    {
      const response = await fetch("/api/language/pronunciation/check_pronunciation", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setFeedback((prev) => ({ ...prev, [wordId]: result.isCorrect }));
    } 
    catch (error) 
    {
      console.error("Error checking pronunciation:", error);
      setFeedback((prev) => ({ ...prev, [wordId]: false }));
    }
  }

  useEffect(() => {
    const fetchRecordings = async () => {
      const response = await fetch(`/api/language/pronunciation/get_recordings?sessionId=${languageSession.id}`);
      const data = await response.json();
  
      if (Array.isArray(data)) 
      {
        setRecordings((prev) => {
          const updatedRecordings = { ...prev };
          data.forEach((record: { id: string; recordingUrl: string }) => {
            updatedRecordings[record.id] = record.recordingUrl; 
          });
  
          return updatedRecordings;
        })
      } 
      else 
      {
        console.error("Data is not an array:", data);
      }
    }
    fetchRecordings()
  }, [languageSession.id]);  
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
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
          Stage 4 - Pronunciation
        </h1>

        <div className="mt-4 
                        gap-6 
                        dark:bg-gray-800">
          {pronunciationWords.map((pronunciationWord) => (
            <div key={pronunciationWord.id} className="relative 
                                                       rounded-lg 
                                                       p-4 
                                                       dark:bg-gray-700 
                                                       border-4 
                                                       border-gray-100 
                                                       dark:border-gray-700 
                                                       bg-gray-100 
                                                       mt-4">
              <h2 className="text-gray-800 
                             font-semibold 
                             dark:text-gray-100">
                {pronunciationWord.word}
              </h2>

              <div className="mt-3 
                              flex 
                              items-center 
                              space-x-4">
                {!isRecording[pronunciationWord.id] ? (
                  <Button onClick={() => handleStartRecording(pronunciationWord.id)} className="flex 
                                                                                                items-center 
                                                                                                space-x-2 
                                                                                                bg-purple-500 
                                                                                                text-white 
                                                                                                px-4 
                                                                                                py-2 
                                                                                                rounded 
                                                                                                hover:bg-purple-800">
                    <FiMic className="w-5 
                                      h-5"/>
                    <span>
                      Record
                    </span>
                  </Button>
                ) : (
                  <Button onClick={() => handleStopRecording(pronunciationWord.id)} className="flex 
                                                                                               items-center 
                                                                                               space-x-2 
                                                                                               bg-red-500 
                                                                                               text-white 
                                                                                               px-4 
                                                                                               py-2 
                                                                                               rounded
                                                                                               hover:bg-red-800">
                    <FiMicOff className="w-5 
                                         h-5"/>
                    <span>
                      Stop
                    </span>
                  </Button>
                )}
              </div>

              <div className="mt-2">
                {feedback[pronunciationWord.id] === true && (
                  <p className="text-green-500 
                                flex 
                                items-center 
                                space-x-2">
                    <FiCheckCircle className="w-5 
                                              h-5"/>
                    <span>
                      Correct pronunciation!
                    </span>
                  </p>
                )}
                {feedback[pronunciationWord.id] === false && (
                  <p className="text-red-500 
                                flex 
                                items-center 
                                space-x-2">
                    <FiXCircle className="w-5 
                                          h-5"/>
                    <span>
                      Try again!
                    </span>
                  </p>
                )}
              </div>

              {pronunciationWord.recordingUrl && typeof pronunciationWord.recordingUrl === "string" && (
                <div className="mt-3">
                  <audio controls>
                    <source src={pronunciationWord.recordingUrl} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          ))}
        </div>
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
            Welcome! Here, you can practice your words pronunciation in {language.name}. Simply press the record button and say the specified words out loud as clearly as possible.
          </div>
        </div>

          <div className="w-full 
                            flex 
                            justify-between 
                            items-center 
                            mb-5">                
                <Link href={`/language/${language.id}/${languageSession.id}/writing/${text.id}`} className={`${buttonVariants({ className: "flex items-center font-semibold bg-purple-500 hover:bg-purple-800" })}`}>
                    <ArrowLeft strokeWidth={5} className="ml-1 
                                                            h-3 
                                                            w-3"/>
                    Return to the previous stage
                </Link>

                <Button size="lg" className="flex 
                                  items-center 
                                  font-semibold 
                                  bg-purple-500 
                                  hover:bg-purple-800" onClick={handleSubmit} disabled={isLoading}>
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

export default Pronunciation;
