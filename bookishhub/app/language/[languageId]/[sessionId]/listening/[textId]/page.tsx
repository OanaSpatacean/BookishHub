export const dynamic = 'force-dynamic';
import Listening from "@/components/Listening";
import { getAuthSession } from "@/lib/authentication";
import { databaseClient } from "@/lib/database";
import { redirect } from "next/navigation";

type Props = 
{
    params:
    {
        languageId: string;
        sessionId: string;
        textId: string;
    }
}

const SessionPageListening = async ({ params }: Props) => {
    const session = await getAuthSession();

    if (!session?.user) 
    {
        return redirect("/");
    }

    const { languageId, sessionId, textId } = params;

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

    const listeningExercises = await databaseClient.listeningExercise.findMany({
        where: 
        {
            sessionId: parseInt(sessionId),
        }
    })

    const text = await databaseClient.textWriting.findUnique({
        where: 
        {
          id: textId
        }
    })

    if (!text) 
    {
        return <div>Text not found</div>;
    }

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

            <Listening language={language} languageSession={languageSession} listeningExercises={listeningExercises} text={text}/>
        </div>
    );
};

export default SessionPageListening;
