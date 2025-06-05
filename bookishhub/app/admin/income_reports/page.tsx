export const dynamic = 'force-dynamic';
import { getAuthSession } from '@/lib/authentication';
import { databaseClient } from '@/lib/database';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {};

const IncomeReports = async (props: Props) => {
    const session = await getAuthSession();

    if (!session?.user) { 
        return redirect('/');
    }

    const userMemberships = await databaseClient.membership.findMany();

    const monthlyIncome: Record<string, number> = {};
    let yearlyTotal = 0;

    userMemberships.forEach((membership) => {
        if (membership.paymentCurrentPeriodEnding) {
            const paymentDate = new Date(membership.paymentCurrentPeriodEnding);
            const monthYear = `${paymentDate.toLocaleString('default', { month: 'long' })} ${paymentDate.getFullYear()}`;

            if (!monthlyIncome[monthYear]) {
                monthlyIncome[monthYear] = 0;
            }

            monthlyIncome[monthYear] += 100; 
            yearlyTotal += 100; 
        }
    });

    const uniqueUserIds = [...new Set(userMemberships.map((membership) => membership.userId))];

    const users = await databaseClient.user.findMany({
        where: { id: { in: uniqueUserIds } }
    });

    const userMembershipMap = userMemberships.map((membership) => {
        const user = users.find((u) => u.id === membership.userId) || { id: "unknown", name: "unknown" };
        const isMembershipActive = membership.paymentCurrentPeriodEnding
            ? new Date(membership.paymentCurrentPeriodEnding) > new Date()
            : false;
    
        return {
            user,
            membership,
            isMembershipActive
        }
    });

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
                    Income Reports
                </h1>

                <div className="w-full 
                                py-5">
                    <h2 className="text-2xl 
                                   font-semibold mb-3">
                        Monthly Income
                    </h2>

                    <ul className="list-disc 
                                   pl-5">
                        {Object.entries(monthlyIncome).map(([month, total]) => (
                            <li key={month} className="text-lg">
                                <strong>
                                    {month}:
                                </strong> 
                                {" "} {total} RON {" "}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="w-full 
                                py-3">
                    <h2 className="text-2xl 
                                   font-semibold">
                        Yearly Total: 
                        <strong>
                            {" "} {yearlyTotal} RON
                        </strong>
                    </h2>
                </div>

                <div className="w-full 
                                py-3">
                    {userMembershipMap.length === 0 ? (
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
                        userMembershipMap.map(({ user, membership, isMembershipActive }) => {
                            const paymentDate = membership.paymentCurrentPeriodEnding
                                ? new Date(membership.paymentCurrentPeriodEnding).toLocaleDateString()
                                : "[no membership date]";

                            return (
                                <div key={membership.id} className="w-full 
                                                                    flex 
                                                                    flex-col 
                                                                    gap-5 
                                                                    mt-3">
                                    <h2 className={`rounded-lg border p-4 flex items-center w-full text-lg font-semibold 
                                                    ${isMembershipActive ? "bg-green-50 dark:bg-green-900" : "bg-red-50 dark:bg-red-900"}`}>
                                        {"User " + (user?.name ?? "unknown ")} 

                                        {isMembershipActive 
                                            ? ` has an active membership until ${paymentDate}` 
                                            : ` no longer has an active membership (expired on ${paymentDate})`}
                                    </h2>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

export default IncomeReports;
