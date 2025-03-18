import EditAssessmentsClient from "@/components/EditAssessmentsClient";
import { getAuthSession } from "@/lib/authentication";
import { databaseClient } from "@/lib/database";
import { redirect } from "next/navigation";

const EditAssessments = async () => {
    const session = await getAuthSession();

    if (!session?.user) 
    {
        return redirect("/");
    }

    const userLanguageSessions = await databaseClient.languageSession.findMany({
        include: { 
            language: true 
        }
    })

    const uniqueUserIds = [...new Set(userLanguageSessions.map((session) => session.userId))];

    const users = await databaseClient.user.findMany({
        where: 
        { id: 
            { 
                in: uniqueUserIds 
            } 
        }
    })

    const userSessionMap = users.map((user) => ({
        user,
        sessions: userLanguageSessions.filter((session) => session.userId === user.id)
    }))

    return <EditAssessmentsClient userSessionMap={userSessionMap} />;
};

export default EditAssessments;
