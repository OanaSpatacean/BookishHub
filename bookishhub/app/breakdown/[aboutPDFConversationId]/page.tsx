import { getAuthSession } from "@/lib/authentication";
import verifyMembership from "@/lib/membership";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
    params: {
        aboutPDFConversationId: string;
}}

const AboutPDFConversationPage = async ({ params: { aboutPDFConversationId } }: Props) => {
    const session = await getAuthSession();

    if(!session?.user){ 
        return redirect('/');
    }

    const havePowerAccount = verifyMembership();
    
    return (
        <div className="bg-purple-50 
                        p-1 
                        rounded-2xl 
                        px-4 
                        py-4 
                        h-[300px]">
            AboutPDFConversationPage
        </div>         
    )
}

export default AboutPDFConversationPage;
