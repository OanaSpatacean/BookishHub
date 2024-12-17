import UsersDisplayBox from '@/components/Users';
import { getAuthSession } from '@/lib/authentication';
import { databaseClient } from '@/lib/database';
import { ArrowRight, InfoIcon, Link } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {};

const CreateNewUser = async (props: Props) => {
    const session = await getAuthSession();
    const users = await databaseClient.user.findMany();

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
                            decoration-gray-600">
                    Edit platform users
                </h1>

                <Link href="/admin/edit_users/create_new_user" className="mt-10
                                                                          inline-block 
                                                                          bg-gray-600 
                                                                          text-white 
                                                                          shadow-lg 
                                                                          hover:bg-gray-700 
                                                                          transition-colors 
                                                                          duration-200 
                                                                          rounded-lg 
                                                                          py-4
                                                                          px-70
                                                                          flex 
                                                                          items-center 
                                                                          text-xl">
                        Click here to create a new user
                        <ArrowRight strokeWidth={5} className="ml-[780px] 
                                                               h-9 
                                                               w-9"/>
                </Link>

                <div className="bg-secondary 
                                border-none 
                                p-4 
                                flex
                                mb-9
                                mt-10">
                        <div className="flex-shrink-0">
                            <InfoIcon className="text-green-500 
                                                h-10 
                                                w-10 
                                                bg-green-100 
                                                rounded-full 
                                                p-2 
                                                shadow-sm"/>
                        </div>

                        <div className="ml-5">
                            By clicking the button above, you have the option to create a new user. This feature is particularly useful if you wish to add collaborators to your platform. Feel free to use it to expand your team and manage access efficiently.
                        </div>
                    </div>
                        
                <div className="gap-4 
                                flex-col 
                                flex">
                    {users.map((user) => (
                        <UsersDisplayBox key={user.id} user={user} />
                    ))}
                </div>

                <div className="mt-8"></div>
            </div>
        </div>
    )
}

export default CreateNewUser;