import Users from '@/components/Users';
import { getAuthSession } from '@/lib/authentication';
import { ArrowRight, InfoIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {};

const EditUsers = async (props: Props) => {
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
                           decoration-yellow-600">Edit platform users</h1>

        </div>
    )
}

export default EditUsers;