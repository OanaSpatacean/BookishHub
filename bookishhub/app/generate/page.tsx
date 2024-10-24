import GenerateLessonForm from '@/components/GenerateLessonForm';
import { redirect } from 'next/navigation';
import { InfoIcon } from 'lucide-react';
import React from 'react'
import { getAuthSession } from '@/lib/authentication';

type Props = {}

const GeneratePage = async (props: Props) => {
    const session = await getAuthSession();

    /*if(!session?.user){ //to remove comment after next-auth is configured
        return redirect('/captions');
    }*/

    return (
        <div className='flex 
                        flex-col 
                        items-start 
                        mx-auto 
                        px-15  
                        max-w-7xl
                        my-11'>
            <h1 className="sm:text-5xl 
                           text-left 
                           text-bold 
                           text-3xl">
                Generate your own personalized lesson
            </h1>
            <div className="bg-secondary 
                            mt-5 
                            border-none 
                            p-4 
                            flex">
                <InfoIcon className="text-green-400 
                                     h-12 
                                     mr-3 
                                     w-12" />
                <div>
                    Please enter the name of the lesson (specify the subject you'd like to cover). Additionally, provide a list of modules that detail the specific areas you wish to explore, and our AI will generate a comprehensive lesson plan tailored to your learning goals.
                </div>
            </div>
            <GenerateLessonForm />
        </div>
    );
};

export default GeneratePage;
