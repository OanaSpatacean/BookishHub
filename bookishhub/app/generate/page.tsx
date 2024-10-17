import { redirect } from 'next/navigation';
import React from 'react'
import { getAuthSession } from '@/lib/authentication';

type Props = {}

const GeneratePage = async (props:Props) => {
    const session = await getAuthSession();

    /*if(!session?.user){ //to remove comment after next-auth is configured
        return redirect('/captions');
    }*/

    return (
        <div className='items-start 
                        px-8 
                        max-w-xl 
                        flex 
                        mx-auto 
                        sm:px-8 
                        flex-col 
                        my-16'>
            <h1>Generate
            </h1>
        </div>
    );
};

export default GeneratePage