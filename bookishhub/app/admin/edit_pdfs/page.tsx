import AllConversationsListedAdmin from "@/components/AllConversationsListedAdmin";
import { getAuthSession } from "@/lib/authentication";
import { databaseClient } from "@/lib/database";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

type Props = 
{
    params: 
    {
        aboutPDFConversationId: string;
    }
}

const EditPDFs = async ({ params: { aboutPDFConversationId } }: Props) => {
    const session = await getAuthSession();

    if (!session?.user) {
        return redirect("/");
    }

    const userPDFConversations = await databaseClient.aboutPDFConversations.findMany({
    })

    const uniqueUserIds = [...new Set(userPDFConversations.map((conv) => conv.userId))];

    const users = await databaseClient.user.findMany({
        where: 
        {
            id: 
            {
                in: uniqueUserIds,
            }
        }
    })

    const userConversationMap = users.map((user) => ({
        user,
        conversations: userPDFConversations.filter((conv) => conv.userId === user.id)
    }))

    const currentConversation = userPDFConversations.find(
        (aboutPDFConversation) => aboutPDFConversation.id === parseInt(aboutPDFConversationId)
    )

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
                Edit PDFs breakdowns
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
                                         shadow-sm" />
                </div>

                <div className="ml-5">
                    Here, you can view all user-created conversations about PDFs content. Easily manage them and select a conversation if you wish to modify any requests within it.
                </div>
            </div>

            <div className="w-full 
                            py-3">
                {!userPDFConversations || userPDFConversations.length === 0 ? (
                    <div className="flex 
                                    items-center 
                                    justify-center 
                                    h-[40vh]">
                        <div className="text-gray-400 
                                        italic 
                                        text-center 
                                        flex 
                                        items-center">
                            No conversation has been created yet
                        </div>
                    </div>
                ) : (
                    userConversationMap.map(({ user, conversations }) => (
                        <div key={user.id} className="mb-10">
                            <h2 className="text-2xl 
                                           font-semibold 
                                           mb-4">
                                User: {user.name || "unknown"}
                            </h2>

                            {conversations.length > 0 ? (
                                <AllConversationsListedAdmin userPDFConversations={conversations} aboutPDFConversationId={parseInt(aboutPDFConversationId) || 0}/>
                            ) : (
                                <p className="text-gray-500 
                                              italic">
                                    No conversation has been created yet by this user
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default EditPDFs;
