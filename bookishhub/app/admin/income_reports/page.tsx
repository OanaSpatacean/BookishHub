import { getAuthSession } from '@/lib/authentication';
import { databaseClient } from '@/lib/database';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {};

const IncomeReports = async (props: Props) => {
    const session = await getAuthSession();

    if (!session?.user) { 
        return redirect('/');
    }

    const userMemberships = await databaseClient.membership.findMany({
    })
    
    const uniqueUserIds = [...new Set(userMemberships.map((conv) => conv.userId))];

    const users = await databaseClient.user.findMany({
        where: 
        {
            id: 
            {
                in: uniqueUserIds,
            }
        }
    })

    const userMembershipMap = users.map((user) => ({
        user,
        memberships: userMemberships.filter((conv) => conv.userId === user.id)
    }))

    return (
        <div>
            <div className="flex flex-col items-start mx-auto px-15 max-w-7xl mt-7">
                <h1 className="sm:text-5xl text-left font-bold text-3xl underline decoration-4 decoration-gray-600">
                    Income reports
                </h1>
                <div className="w-full 
                            py-3">
                    {!userMemberships || userMemberships.length === 0 ? (
                        <div className="flex 
                                        items-center 
                                        justify-center 
                                        h-[40vh]">
                            <div className="text-gray-400 
                                            italic 
                                            text-center 
                                            flex 
                                            items-center">
                                No membership has been made yet
                            </div>
                        </div>
                    ) : (
                        userMembershipMap.map(({ user, memberships }) => {
                            const paymentDate = memberships.length > 0 && memberships[0].paymentCurrentPeriodEnding 
                                                ? new Date(memberships[0].paymentCurrentPeriodEnding.setMonth(memberships[0].paymentCurrentPeriodEnding.getMonth() - 1)).toLocaleDateString() 
                                                : "[no membership date]";
                        
                            return (
                                <div key={user.id} className="w-full 
                                                              flex 
                                                              flex-col 
                                                              gap-5
                                                              mt-3">
                                    <h2 className="rounded-lg 
                                                   border 
                                                   p-4 
                                                   flex 
                                                   items-center 
                                                   bg-gray-50 
                                                   dark:bg-gray-900 
                                                   w-full 
                                                   text-lg
                                                   font-semibold">
                                        {"User " + user.name || "Unknown user"} paid 100 RON on {paymentDate} for platform membership
                                    </h2>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default IncomeReports;
