import Grammar from "@/components/Grammar";
import Listening from "@/components/Listening";
import Pronunciation from "@/components/Pronunciation";
import Reading from "@/components/Reading";
import Rephrasing from "@/components/Rephrasing";
import Writing from "@/components/Writing";
import { buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/authentication";
import { databaseClient } from "@/lib/database";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = 
{
    params:
    {
        languageId: string;
        sessionId: string;
    }
}

const SessionPage = async ({ params }: Props) => {
    const session = await getAuthSession();

    if (!session?.user) 
    {
        return redirect("/");
    }

    const { languageId, sessionId } = params;

    const language = await databaseClient.language.findUnique({
        where: 
        {
            id: parseInt(languageId),
        }
    })

    if (!language) 
    {
        return <div>Language not found</div>;
    }

    const languageSession = await databaseClient.languageSession.findUnique({
        where: 
        {
            id: parseInt(sessionId),
        }
    })

    if (!languageSession) 
    {
        return <div>Session not found</div>;
    }

    const rephrasingQuestions = await databaseClient.rephrasingQuestion.findMany({
        where: 
        {
            sessionId: parseInt(sessionId),
        }
    })

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
                Session {languageSession.id} - {languageSession.level} level - {language.name}
            </h1>

            <Rephrasing language={language} languageSession={languageSession} questions={rephrasingQuestions} />
        </div>
    );
};

export default SessionPage;
