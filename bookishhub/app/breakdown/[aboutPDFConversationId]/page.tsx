import AllConversationsListed from "@/components/AllConversationsListed";
import { getAuthSession } from "@/lib/authentication";
import { databaseClient } from "@/lib/database";
import verifyMembership from "@/lib/membership";
import { redirect } from "next/navigation";
import React from "react";

type Props = 
{
    params:
    {
        aboutPDFConversationId: string;
    }
}

const AboutPDFConversationPage = async ({ params: { aboutPDFConversationId } }: Props) => {
    const session = await getAuthSession();

    if(!session?.user)
    { 
        return redirect('/');
    }

    const havePowerAccount = verifyMembership();

    const userPDFConversations = await databaseClient.aboutPDFConversations.findMany({
        where: 
        { 
            userId: session.user.id 
        }
    })

    if (!userPDFConversations || userPDFConversations.length === 0) 
    {
        return redirect("/breakdown");
    }
    
    const currentConversation = userPDFConversations.find(
        (aboutPDFConversation) => aboutPDFConversation.id === parseInt(aboutPDFConversationId)
    )

    if (!currentConversation) 
    {
    return redirect("/breakdown");
    }
    
    return (
        <div className="h-screen 
                        flex">
            <div className="h-screen 
                            w-full 
                            flex">
                <div className="max-w-xs 
                                h-screen 
                                flex-[1]">
                    <AllConversationsListed userPDFConversations={userPDFConversations} aboutPDFConversationId={currentConversation.id} havePowerAccount={havePowerAccount} />
                </div>

            </div>
        </div>  
    )
}

export default AboutPDFConversationPage;
