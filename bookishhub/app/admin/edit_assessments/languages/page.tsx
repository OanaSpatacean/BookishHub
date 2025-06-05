export const dynamic = 'force-dynamic';
import EditLanguagesClient from "@/components/EditLanguagesClient";
import { getAuthSession } from "@/lib/authentication";
import { redirect } from "next/navigation";

const EditLanguagesPage = async () => {
    const session = await getAuthSession();

    if (!session?.user) 
    {
        return redirect("/");
    }

    return <EditLanguagesClient />
}

export default EditLanguagesPage;
