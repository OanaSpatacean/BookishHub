import { getAuthSession } from '@/lib/authentication';
import { databaseClient } from '@/lib/database';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {};

const IncomeReports = async (props: Props) => {
    const session = await getAuthSession();

    if(!session?.user){ 
        return redirect('/');
    }

    const users = await databaseClient.user.findMany();
    
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
                    Income reports
                </h1>

            </div>
        </div>
    )
}

export default IncomeReports;