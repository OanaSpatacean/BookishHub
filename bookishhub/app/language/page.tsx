import { getAuthSession } from "@/lib/authentication";
import { redirect } from "next/navigation";
import { InfoIcon } from "lucide-react";
import { databaseClient } from "@/lib/database";
import LanguageDisplayBox from "@/components/LanguageDisplayBox";

type Props = {
    params:
    {
        languageId: string;
    }
}

const LanguagePage = async (props: Props) => {
    const session = await getAuthSession();

    if(!session?.user){ 
        return redirect('/');
    }

    const languages = await databaseClient.language.findMany()
    
    return (
        <div className="flex 
                        flex-col 
                        items-start 
                        mx-auto 
                        px-15  
                        max-w-7xl
                        mt-7">
            <h1 className="sm:text-5xl 
                           text-left 
                           font-bold 
                           text-3xl 
                           underline 
                           decoration-4 
                           decoration-purple-500
                           mb-5">
                Language check 
            </h1>

            <div className="bg-secondary 
                border-none 
                p-4 
                flex 
                mb-4 
                mt-4">
                <div className="flex-shrink-0">
                    <InfoIcon className="text-green-500 
                                        h-10 
                                        w-10 
                                        bg-green-100 
                                        rounded-full 
                                        p-2 
                                        shadow-sm"/>
                </div>

                <div className="ml-5">
                            <h2 className="font-semibold 
                                        text-xl">
                                Your language check journey
                            </h2>

                            <p className="mt-2">
                                To master <strong>the language you are interested in</strong>, you will go through <strong>six essential stages</strong>. 
                                Each stage is designed to enhance specific skills, ensuring a well-rounded learning experience. 
                                Completing all stages will give you a comprehensive evaluation of your language proficiency.
                            </p>

                            <h3 className="mt-4 font-semibold">
                                🔹 Stage 1: Grammar
                            </h3>

                            <p className="mt-1">
                                Master the fundamental rules of <strong>your chosen language</strong>. 
                                This stage will test your knowledge of sentence structure, verb conjugations, and grammar accuracy. 
                            </p>

                            <h3 className="mt-4 font-semibold">
                                🔹 Stage 2: Rephrasing
                            </h3>

                            <p className="mt-1">
                                Improve your ability to express ideas in different ways. 
                                You will learn to restructure sentences while maintaining their original meaning, 
                                enhancing both flexibility and clarity in your speech and writing.
                            </p>

                            <h3 className="mt-4 font-semibold">
                                🔹 Stage 3: Writing
                            </h3>

                            <p className="mt-1">
                                Develop your writing skills by constructing coherent and grammatically correct sentences. 
                                AI-powered assistance will help refine your writing style and provide real-time feedback.
                            </p>

                            <h3 className="mt-4 font-semibold">
                                🔹 Stage 4: Pronunciation
                            </h3>

                            <p className="mt-1">
                                Work on your speaking skills by practicing pronunciation and intonation. 
                                This stage will help you sound more natural and improve verbal communication.
                            </p>

                            <h3 className="mt-4 font-semibold">
                                🔹 Stage 5: Listening
                            </h3>

                            <p className="mt-1">
                                Train your ear to understand spoken language. 
                                This stage will involve comprehension exercises using audio clips to improve your listening skills.
                            </p>

                            <h3 className="mt-4 font-semibold">
                                🔹 Stage 6: Reading
                            </h3>

                            <p className="mt-1">
                                Enhance your ability to read and comprehend written texts. 
                                You will engage with passages, answer questions, and extract key information to build reading fluency.
                            </p>

                            <p className="mt-4 font-semibold">
                                To complete your assessment, you must go through each of these six stages. 🚀 
                            </p>

                            <p className="mt-2">
                                You will always have access to your past sessions and previous answers. 
                                Reviewing your mistakes and improvements will help you progress faster and gain confidence in the language you want.
                            </p>

                            <p className="mt-8"></p>

                            <h3 className="mt-2 font-semibold">
                                Here are all the supported languages on our platform. Choose the language you want to evaluate yourself in, and our AI will create a custom asessment based on your level. It's a great way to see your progress and identify areas for improvement. Let's begin!
                            </h3>
                    </div>
            </div>

            <div className="max-w-7xl 
                            mx-auto  
                            py-3
                            w-full">
                <div className="gap-4 
                                flex-col 
                                flex">
                    {languages.map((language) => (
                        <LanguageDisplayBox key={language.id} language={language} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LanguagePage;