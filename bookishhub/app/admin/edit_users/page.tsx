import UsersDisplayBox from '@/components/Users';
import { getAuthSession } from '@/lib/authentication';
import { databaseClient } from '@/lib/database';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {};

const EditUsers = async (props: Props) => {
    const session = await getAuthSession();
    const users = await databaseClient.user.findMany();

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
                           decoration-gray-600">
                Edit platform users
            </h1>

            {users.map((user) => (
                <UsersDisplayBox key={user.id} user={user} />
            ))}
        </div>
    )
}

export default EditUsers;