import DesignLessonForm from '@/components/DesignLessonForm';
import { redirect } from 'next/navigation';
import { InfoIcon } from 'lucide-react';
import React from 'react'
import { getAuthSession } from '@/lib/authentication';
import verifyMembership from '@/lib/membership';

type Props = {}

const DesignPage = async (props: Props) => {
    const session = await getAuthSession();

    if(!session?.user){ 
        return redirect('/');
    }

    const havePowerAccount = verifyMembership();

    return (
        <div className='flex 
                        flex-col 
                        items-start 
                        mx-auto 
                        px-15  
                        max-w-7xl
                        mt-7'>
            <h1 className="sm:text-5xl 
                           text-left 
                           font-bold 
                           text-3xl 
                           underline 
                           decoration-4 
                           decoration-blue-500">
                Design your own personalized lesson
            </h1>
            
            <DesignLessonForm session={session} havePowerAccount={havePowerAccount}/>

            <div className="bg-secondary 
                            border-none 
                            p-4 
                            flex">
                <div className="flex-shrink-0">
                    <InfoIcon 
                        className="text-green-500 
                                h-10 
                                w-10 
                                bg-green-100 
                                rounded-full 
                                p-2 
                                shadow-sm" />
                </div>

                <div className="ml-5">
                    Please enter the name of the lesson (specify the subject you'd like to cover). Moreover, provide a list of modules that detail the specific areas you wish to explore, and our AI will design a comprehensive lesson plan tailored to your learning goals. Please ensure that all fields are completed. Remove any unnecessary fields, or feel free to add additional ones as needed.
                </div>
            </div>
        </div>
    );
};

export default DesignPage;
