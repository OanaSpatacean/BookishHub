import { getAuthSession } from "@/lib/authentication";
import { databaseClient } from "@/lib/database";
import { ArrowRight, InfoIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {};

const EditLanguages = async (props:Props) => {
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
                Manage languages available on the website
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
                    On this page, you can manage all the languages available for use on the platform. Add what language you want for the user to explore or edit the existing ones that are already displayed.
                </div>
            </div>

        
        </div>
    );
};

export default EditLanguages;
