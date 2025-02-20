import Grammar from "@/components/Grammar";
import { getAuthSession } from "@/lib/authentication";
import { databaseClient } from "@/lib/database";
import { redirect } from "next/navigation";

type Props = 
{
    params:
    {
        languageId: string;
        sessionId: string;
    }
}

const SessionPageWriting = async ({ params }: Props) => {
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

    const grammarQuestions = await databaseClient.grammarQuestion.findMany({
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

            <Grammar language={language} languageSession={languageSession} questions={grammarQuestions} />
        </div>
    );
};

export default SessionPageWriting;
