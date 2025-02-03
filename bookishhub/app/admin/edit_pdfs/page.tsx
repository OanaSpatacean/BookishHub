import AllConversationsListedAdmin from "@/components/AllConversationsListedAdmin";
import { getAuthSession } from "@/lib/authentication";
import { databaseClient } from '@/lib/database';
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

type Props = {
    params:
    {
        aboutPDFConversationId: string;
    }
};

const EditPDFs = async ({params: { aboutPDFConversationId } }: Props) => {
    const session = await getAuthSession();

    if(!session?.user){ 
        return redirect('/');
    }

    const userPDFConversations = await databaseClient.aboutPDFConversations.findMany({
        where: 
        { 
            userId: session.user.id 
        }
    })
    
    const currentConversation = await userPDFConversations.find(
        (aboutPDFConversation) => aboutPDFConversation.id === parseInt(aboutPDFConversationId)
    )
    
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
                                                shadow-sm"/>
                    </div>

                    <div className="ml-5">
                        Here, you can view all user-created conversations about PDFs content. Easily manage them and select a conversation if you wish to modify any requests within it.                
                    </div>
                </div>

                <div className="max-w-7xl 
                                mx-auto  
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
                        <div className="gap-4 
                                        flex-col flex">
                            <AllConversationsListedAdmin userPDFConversations={userPDFConversations} aboutPDFConversationId={currentConversation?.id ?? 0}/>
                        </div>
                )}
            </div>
        </div>
    )
}

export default EditPDFs;