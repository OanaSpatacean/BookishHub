import { getAuthSession } from "@/lib/authentication";
import { redirect } from "next/navigation";
import { InfoIcon } from "lucide-react";

type Props = {};

const LanguagePage = async (props: Props) => {
    const session = await getAuthSession();

    if(!session?.user){ 
        return redirect('/');
    }
    
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
                Language check 
            </h1>

            <div className="bg-secondary 
                            border-none 
                            p-4 
                            flex 
                            mb-4 
                            mt-4">
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
                    You can check your language skills here! See how proficient you are in different levels. Choose the language you want to evaluate yourself in, and our AI will create a custom asessment based on your level. It's a great way to see your progress and identify areas for improvement. Let's begin!
                </div>
            </div>
        </div>
    )
}

export default LanguagePage;