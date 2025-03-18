import { getAuthSession } from "@/lib/authentication";
import { databaseClient } from "@/lib/database";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

type Props = {};

const EditAssessments = async (props:Props) => {
    const session = await getAuthSession();

    if (!session?.user) 
    {
        return redirect("/");
    }

    const userLanguageSessions = await databaseClient.languageSession.findMany({
        include: 
        {
            language: true
        }
    })

    const uniqueUserIds = [...new Set(userLanguageSessions.map((session) => session.userId))];

    const users = await databaseClient.user.findMany({
        where: 
        {
            id: 
            {
                in: uniqueUserIds,
            }
        }
    })

    const userSessionMap = users.map((user) => ({
        user,
        sessions: userLanguageSessions.filter((session) => session.userId === user.id)
    }))

    return (
        <div className="flex 
                        flex-col 
                        items-start 
                        w-full 
                        px-4 
                        max-w-none 
                        mt-7">
            <h1 className="sm:text-5xl 
                           text-left 
                           font-bold 
                           text-3xl 
                           underline 
                           decoration-4 
                           decoration-gray-500">
                Edit language assessments
            </h1>

            <div className="bg-secondary 
                            border-none 
                            p-4 
                            flex 
                            mb-7 
                            mt-7">
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
                    Here, you can view all the language sessions created by the users on the platform. Easily manage them and modify session details as needed.
                </div>
            </div>

            <div className="w-full 
                            py-3">
                {!userLanguageSessions || userLanguageSessions.length === 0 ? (
                    <div className="flex 
                                    items-center 
                                    justify-center 
                                    h-[40vh]">
                        <div className="text-gray-400 
                                        italic 
                                        text-center 
                                        flex 
                                        items-center">
                            No language sessions have been created yet on the platform.
                        </div>
                    </div>
                ) : (
                    userSessionMap.map(({ user, sessions }) => (
                        <div key={user.id} className="mb-10">
                            <h2 className="text-2xl 
                                           font-semibold 
                                           mb-4">
                                Language sessions of user {user.name || "unknown"}:
                            </h2>

                            {sessions.length > 0 ? (
                                <ul className="space-y-4">
                                    {sessions.map((session) => (
                                        <li key={session.id} className="p-4 
                                                                        border 
                                                                        rounded-lg 
                                                                        bg-gray-100 
                                                                        shadow-sm">
                                            <p>
                                                <strong>
                                                    Language: 
                                                </strong>
                                                {" "} 
                                                {session.language.name}
                                            </p>
                                            <p>
                                                <strong>
                                                    Level: 
                                                </strong>
                                                {" "} 
                                                {session.level}
                                            </p>
                                            <p>
                                                <strong>
                                                    Created On:
                                                </strong>
                                                {" "}
                                                {new Date(session.createdAt).toLocaleDateString()}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 
                                              italic">
                                    No language sessions have been created by this user.
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EditAssessments;
