export const dynamic = 'force-dynamic';
import UsersDisplayBox from '@/components/Users';
import { getAuthSession } from '@/lib/authentication';
import { databaseClient } from '@/lib/database';
import { ArrowRight, InfoIcon } from 'lucide-react';
import Link from "next/link";
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {};

const getUsersWithMembership = async () => {
    const users = await databaseClient.user.findMany();

    const usersWithMembership = await Promise.all(
        users.map(async (user) => {
            const membership = await databaseClient.membership.findUnique({
                where: 
                {
                    userId: user.id 
                },
                select: 
                { 
                    paymentCurrentPeriodEnding: true 
                }
            })

            return {
                ...user,
                isPowerAccount: membership?.paymentCurrentPeriodEnding
                    ? new Date(membership.paymentCurrentPeriodEnding) > new Date()
                    : false
            }
        })
    )

    return usersWithMembership;
}

const EditUsers = async (props: Props) => {
    const session = await getAuthSession();

    if(!session?.user){ 
        return redirect('/');
    }

    const users = await getUsersWithMembership();
    
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

                <Link href="/admin/edit_users/create_new_user" className="mt-9
                                                                        inline-block 
                                                                        text-white 
                                                                        transition 
                                                                        bg-gradient-to-r 
                                                                        from-gray-500 
                                                                        to-gray-900 
                                                                        hover:from-gray-600 
                                                                        hover:to-gray-800 
                                                                        rounded-lg 
                                                                        py-2
                                                                        px-7 
                                                                        flex 
                                                                        items-center 
                                                                        text-md
                                                                        font-semibold
                                                                        w-full">
                    Click here to create a new user
                    <ArrowRight strokeWidth={5} className="ml-[920px] 
                                                           h-6 
                                                           w-6"/>
                </Link>

                <div className="bg-secondary 
                                border-none 
                                p-4 
                                flex
                                mb-7
                                mt-7">
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

                <div className="w-full 
                                max-w-none 
                                mx-auto 
                                py-3">      
                    <div className="gap-4 
                                    flex-col 
                                    flex
                                    ">
                        {users.map((user) => (
                            <UsersDisplayBox key={user.id} user={user} isPowerAccount={user.isPowerAccount}/>
                        ))}
                    </div>
                </div>

                <div className="mt-8"></div>
            </div>
        </div>
    )
}

export default EditUsers;