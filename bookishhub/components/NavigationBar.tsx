import { getAuthSession } from '@/lib/authentication';
import UserAccountNavigation from './UserAccountNavigation';
import { DarkModeToggle } from './DarkModeToggle';
import React from 'react'
import LogInButton from './LogInButton';
import Link from 'next/link'

type Props = {}

const NavigationBar = async (props:Props) => {
    try {
        const session = await getAuthSession();

        if (!session) 
        {
            console.log('Session not found. User is not authenticated.');
        }

        console.log(session);

        return (
            <nav className='z-[10] 
                            h-[65px]  
                            bg-white 
                            top-0 
                            inset-x-0 
                            border-zinc-300 
                            dark:bg-gray-950 
                            border-b 
                            fixed'>
                <div className='justify-center 
                                items-center 
                                flex 
                                sm:justify-between 
                                mx-auto 
                                max-7-xl 
                                gap-2 
                                h-full 
                                px-8'>
                    <div className="items-center
                                    flex  
                                    gap-3">
                        <DarkModeToggle className='' />
                        <Link href='/all-lessons-displayed' className='items-center 
                                                          flex 
                                                          gap-2'>
                            <p className='px-4 
                                          py-2 
                                          text-2xl 
                                          font-semibold 
                                          bg-gradient-to-r 
                                          from-blue-500 
                                          to-blue-900 
                                          text-white 
                                          rounded-lg 
                                          shadow-md 
                                          transform 
                                          transition-all 
                                          duration-300 
                                          hover:scale-105 
                                          hover:shadow-lg 
                                          dark:bg-gradient-to-r 
                                          dark:from-blue-500 
                                          dark:to-blue-900 
                                          dark:text-white'>
                                BookishHub
                            </p>
                        </Link>
                    </div>
                    <div className='items-center 
                                    flex'>
                        {session?.user ? (
                            session.user.isAdmin ? ( 
                                <Link href='/admin' className='mr-5'>
                                    Admin Panel
                                </Link>
                            ) : (  
                                <>
                                    <Link href='/repo' className='mr-5'>
                                        Repo Insights
                                    </Link>
                                    <Link href='/breakdown' className='mr-5'>
                                        PDF Breakdown
                                    </Link>
                                    <Link href='/game' className='mr-5'>
                                        Game Zone
                                    </Link>
                                    <Link href='/all-lessons-displayed' className='mr-5'>
                                        Lesson Design
                                    </Link>
                                    <Link href='/draft' className='mr-5'>
                                        Draft Assist
                                    </Link>
                                    <Link href='/configurations' className='mr-5'>
                                        Configurations
                                    </Link>
                                </>
                            )
                        ) : (
                            <LogInButton />  
                        )}

                        <div className='items-center flex'>
                            {session?.user ? (
                                <UserAccountNavigation user={session.user} />
                            ) : null}  
                        </div>
                    </div>
                </div>
            </nav>
        );
    } catch (error) {
        console.error('Error NavigationBar:', error);
    }
};

export default NavigationBar;