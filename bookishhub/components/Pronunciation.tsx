'use client'
import { useState, useRef } from "react";
import { Language, LanguageSession } from "@prisma/client";
import { FiCheckCircle, FiXCircle, FiMic, FiMicOff } from "react-icons/fi";
import { Button } from "./ui/button";

type Props = {
  language: Language;
  languageSession: LanguageSession;
  pronunciationWords: 
  {
    id: string;
    word: string;
  }[]
}

const Pronunciation = ({ language, languageSession, pronunciationWords }: Props) => {
  const [recordings, setRecordings] = useState<{ [key: string]: Blob | null }>({});
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
  };

  const checkPronunciation = async (wordId: string, audioBlob: Blob) => {
    const correctWord = pronunciationWords.find((w) => w.id === wordId)?.word;

    const isCorrect = Math.random() > 0.5; 
    setFeedback((prev) => ({ ...prev, [wordId]: isCorrect }));
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
                                                                                               rounded">
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

              {recordings[pronunciationWord.id] && (
                <div className="mt-3">
                  <audio controls>
                    <source src={URL.createObjectURL(recordings[pronunciationWord.id]!)} type="audio/wav"/>
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Pronunciation;
