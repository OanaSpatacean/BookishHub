import { getAuthSession } from "@/lib/authentication";
import { redirect } from "next/navigation";

type Props = {};

const EditPDFs = async (props: Props) => {
    const session = await getAuthSession();

    if(!session?.user){ 
        return redirect('/');
    }
    
    return (
        <div>
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
            </div>
        </div>
    )
}

export default EditPDFs;