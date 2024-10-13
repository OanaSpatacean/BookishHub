import React from 'react'
import Link from 'next/link'
import LogInButton from './LogInButton';
import { getAuthSession } from '@/lib/authentication';

type Props = {}

const NavigationBar = async (props:Props) => {
    const session = await getAuthSession();
    console.log(session);
    return (
        <nav className='z-[10] h-fit bg-white top-0 inset-x-0 border-zinc-300 dark:bg-gray-950 border-b fixed'>
            <div className='justify-center items-center flex sm:justify-between mx-auto max-7-xl gap-2 h-full px-8'>
                <Link href='/captions' className='items-center hidden gap-2 sm:flex'>
                    <p className='px-2 py-1 font-bold text-xl hover:-translate-y-[2px] transition-all md:block border-black border-r-4 border-b-4 border-2 rounded-lg dark:border-white'>
                        BookishHub
                    </p>
                </Link>
                <div className='items-center flex'>
                    {session?.user && (
                        <>
                            <Link href='/generate' className='mr-3'>Generate Lesson</Link>
                            <Link href='/captions' className='mr-3'>Captions</Link>
                            <Link href='/configurations' className='mr-3'>Configurations</Link>
                        </>
                    )}
                    <div className='items-center flex'>
                        {session?.user ?
                            <p>Logged In</p> :
                        <LogInButton/>}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar