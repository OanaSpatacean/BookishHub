import LanguagePageComponent from "@/components/LanguagePageComponent";
import { getAuthSession } from "@/lib/authentication";
import { databaseClient } from "@/lib/database";
import { redirect } from "next/navigation";

type Props = {
    params: 
    {
        languageId: string;
    }
}

const LanguageIdPage = async ({ params }: Props) => {
    const session = await getAuthSession();

    if (!session?.user) 
    {
        return redirect("/");
    }

    const { languageId } = params;

    const language = await databaseClient.language.findUnique({
        where: 
        { 
            id: parseInt(languageId) 
        }
    })

    const languageSessions = await databaseClient.languageSession.findMany({
        where: 
        { 
            languageId: parseInt(languageId) 
        }
    })

    return (
        <LanguagePageComponent language={language} languageSessions={languageSessions} languageId={languageId}/>
    )
}

export default LanguageIdPage
