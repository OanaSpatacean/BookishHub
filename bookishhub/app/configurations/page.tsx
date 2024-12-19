import CreateMembership from "@/components/CreateMembership";
import { getAuthSession } from "@/lib/authentication";
import { redirect } from "next/navigation";
import verifyMembership from "@/lib/membership";
import { InfoIcon } from "lucide-react";

type Props = {};

const Configurations = async (props: Props) => {
    const session = await getAuthSession();

    if(!session?.user){ 
        return redirect('/');
    }
    
    const isPowerAccount = await verifyMembership();

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
                           decoration-blue-500
                           mb-5">
                Configurations 
            </h1>

            {isPowerAccount ? (
                <p className="text-secondary-foreground/50 text-3xl text-center mt-4">
                    You have a Power BookishHub account!
                </p>
            ) : (
                <p className="text-secondary-foreground/50 text-3xl text-center mt-4">
                    You don't have a Power BookishHub account!
                </p>
            )}

<div className="bg-secondary 
                border-none 
                p-4 
                flex
                mt-7
                mb-8">
                <div className="flex-shrink-0">
                    <InfoIcon 
                        className="text-green-500 
                                   h-10 
                                   w-10 
                                   bg-green-100 
                                   rounded-full 
                                   p-2 
                                   shadow-sm"/>
                </div>

                <div className="ml-5">
                Welcome to BookishHub! We're excited to help you unlock the full potential of your membership experience.

If you don’t already have a membership, you can easily join by pressing the button below. Becoming a member grants you access to a wide range of exclusive features, including custom tools, advanced resources, and priority support to help you achieve your goals with ease and efficiency.

Already have a membership? Fantastic! As a valued member, you’ll become part of the Power BookishHub community, an exclusive group of individuals who enjoy enhanced benefits and premium access to everything BookishHub has to offer. You can also take your membership further by unlocking additional design options, giving you even more flexibility and creative possibilities.

Whether you’re starting a new membership or upgrading an existing one, everything you need is just a click away. Press the button below to join the Power BookishHub community or access even more design options to elevate your experience.                </div>
            </div>
            
            <CreateMembership isPowerAccount={isPowerAccount} />
        </div>
    )
}

export default Configurations;