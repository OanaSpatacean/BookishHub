import AllConversationsListedAdmin from "@/components/AllConversationsListedAdmin";
import { getAuthSession } from "@/lib/authentication";
import { databaseClient } from "@/lib/database";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

type Props = 
{
    params: 
    {
        fileId: string;
    }
}

const EditPDFs = async ({ params: { fileId } }: Props) => {
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
                Edit file breakdowns
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
                    Here, you can view all existent textbooks on the platform, with all uploaded documents. Easily manage them and select a file if you wish to modify any requests within it.
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
                            No file has been uploaded yet on the platform
                        </div>
                    </div>
                ) : (
                    userConversationMap.map(({ user, conversations }) => (
                        <div key={user.id} className="mb-10">
                            <h2 className="text-2xl 
                                           font-semibold 
                                           mb-4">
                                Textbook of user {user.name || "unknown"}:
                            </h2>

                            {conversations.length > 0 ? (
                                <AllConversationsListedAdmin userPDFConversations={conversations} fileId={parseInt(fileId) || 0}/>
                            ) : (
                                <p className="text-gray-500 
                                              italic">
                                    No file has been uploaded yet by this user
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
