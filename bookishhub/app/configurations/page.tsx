import { getAuthSession } from "@/lib/authentication";
import { redirect } from "next/navigation";

type Props = {};

const Configurations = async (props: Props) => {
    const session = await getAuthSession();

    if(!session?.user){ 
        return redirect('/');
    }
    
    return (
        <div>
            Configurations start
        </div>
    )
}

export default Configurations;