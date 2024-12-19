import { getAuthSession } from "@/lib/authentication";
import { redirect } from "next/navigation";
import verifyMembership from "@/lib/membership";

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
                <p className="text-secondary-foreground/70 text-3xl">
                    You have a Power BookishHub account!
                </p>
            ) : (
                <p className="text-secondary-foreground/70 text-3xl">
                    You don't have a Power BookishHub account!
                </p>
            )}
        </div>
    )
}

export default Configurations;