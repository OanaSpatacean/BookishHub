import LanguageSessionDisplayBox from "@/components/LanguageSessionDisplayBox";
import { Button } from "@/components/ui/button";
import { getAuthSession } from "@/lib/authentication";
import { databaseClient } from "@/lib/database";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

type Props = {
    params:
    {
        languageId: string;
    }
}

const levels = ["Beginner", "Intermediate", "Advanced"];

const LanguageIdPage = async ({params}: Props) => {
    const session = await getAuthSession();

    if(!session?.user){ 
        return redirect('/');
    }
    
    const { languageId } = params; 

    const language = await databaseClient.language.findUnique({
        where: 
        { 
            id: parseInt(languageId)
        }
    });

    const languageSessions = await databaseClient.languageSession.findMany()
    
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
                Choose your level in {language.name}
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
                                         shadow-sm" />
                </div>

                <div className="ml-5">
                    <h2 className="font-semibold text-xl">
                        Select Your Proficiency Level in {language.name}
                    </h2>
                    <p className="mt-2">
                        To accurately assess your skills in <strong>{language.name}</strong>, please choose the level that best represents your current proficiency. 
                        This will help us tailor the evaluation to match your abilities and provide meaningful feedback.
                    </p>

                    <h3 className="mt-4 font-semibold">🔹 Beginner</h3>
                    <p className="mt-1">
                        At this level, you are just starting to learn <strong>{language.name}</strong>. You may know a few basic words and phrases 
                        but have limited ability to form sentences or understand spoken and written content. 
                        Your focus is on learning fundamental vocabulary, pronunciation, and simple sentence structures.
                    </p>

                    <h3 className="mt-4 font-semibold">🔹 Intermediate</h3>
                    <p className="mt-1">
                        You can communicate in <strong>{language.name}</strong> in everyday situations. You understand common phrases, 
                        express ideas with some fluency, and grasp the main points of conversations. 
                        However, you may still make grammatical mistakes and struggle with complex topics or fast-paced speech.
                    </p>

                    <h3 className="mt-4 font-semibold">🔹 Advanced</h3>
                    <p className="mt-1">
                        You have strong command over <strong>{language.name}</strong> and can speak, read, and write with confidence. 
                        You understand nuanced conversations, express thoughts clearly, and engage in discussions on various subjects. 
                        While you may still encounter occasional challenges, you can effectively communicate in professional and social settings.
                    </p>

                    <p className="mt-4 font-semibold">
                        Please select the level that best reflects your skills to proceed with your assessment. 🚀
                    </p>
                </div>
            </div>

            <div className="w-full bg-purple-50 p-6 shadow-md mt-2 mb-6 dark:bg-purple-900">
                <h2 className="text-xl font-bold mb-4">Select your level here</h2>
                <form>
                    {levels.map((level) => (
                        <label key={level} className="flex items-center mb-3">
                            <input 
                                type="radio" 
                                name="proficiency" 
                                value={level} 
                                className="mr-2"
                            />
                            {level}
                        </label>
                    ))}
                </form>
            </div>
            
            <Button size='lg' className='w-full
                                        inline-block 
                                        text-white 
                                        transition 
                                        bg-gradient-to-r 
                                        from-purple-500 
                                        to-purple-900 
                                        hover:from-purple-600 
                                        hover:to-purple-800 
                                        rounded-lg 
                                        py-2
                                        px-7 
                                        flex 
                                        items-center 
                                        text-md
                                        font-semibold
                                        mb-6' type='submit'>
                    Start a new language session
            </Button>

            <h1 className="sm:text-5xl 
                           text-left 
                           font-bold 
                           text-3xl 
                           underline 
                           decoration-4 
                           decoration-purple-500
                           mb-9
                           mt-9">
                All of your past language sessions
            </h1>

            <div className="max-w-7xl 
                            mx-auto  
                            py-3
                            w-full">
                <div className="gap-4 
                                flex-col 
                                flex">
                     {languageSessions.map((languageSession) => (
                        <LanguageSessionDisplayBox key={languageSession.id} language={language} languageSession={languageSession} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LanguageIdPage;