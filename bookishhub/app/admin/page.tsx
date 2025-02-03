import { getAuthSession } from '@/lib/authentication';
import { ArrowRight, InfoIcon } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {};

const AdminPanel = async (props: Props) => {
    const session = await getAuthSession();

    if(!session?.user){ 
        return redirect('/');
    }
    
    return (
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
                           decoration-gray-500">
                Manage your application
            </h1>

            <Link href="/admin/income_reports" className="mt-9
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
                <span>
                    Income reports
                </span>
                <ArrowRight strokeWidth={5} className="ml-[1050px] h-6 w-6" />
            </Link>

            <div className="bg-secondary 
                            border-none 
                            p-4 
                            flex
                            mt-7">
                <div className="flex-shrink-0">
                    <InfoIcon 
                        className="text-green-500 
                                   h-10 
                                   w-10 
                                   bg-green-100 
                                   rounded-full 
                                   p-2 
                                   shadow-sm"/>
                </div>

                <div className="ml-5">
                    Tap 'Income Reports' to see which users have paid for a membership, the date of their payment, and a summary of your total income for the current month and year.               
                </div>
            </div>

            <Link href="/admin/edit_users" className="mt-9
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
                <span>
                    Edit platform users
                </span>
                <ArrowRight strokeWidth={5} className="ml-[1030px] h-6 w-6" />
            </Link>

            <div className="bg-secondary 
                            border-none 
                            p-4 
                            flex
                            mt-7">
                <div className="flex-shrink-0">
                    <InfoIcon 
                        className="text-green-500 
                                   h-10 
                                   w-10 
                                   bg-green-100 
                                   rounded-full 
                                   p-2 
                                   shadow-sm"/>
                </div>

                <div className="ml-5">
                    By proceeding to the 'Edit platform users' section, you will access the user management interface. This feature allows you to view, edit, and manage all user accounts created on this platform.
                </div>
            </div>

            <Link href="/admin/edit_lessons" className="mt-9
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
                <span>
                    Edit designed lessons
                </span>
                <ArrowRight strokeWidth={5} className="ml-[1010px] h-6 w-6" />
            </Link>

            <div className="bg-secondary 
                            border-none 
                            p-4 
                            flex
                            mt-7">
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
                    Clicking 'Edit designed lessons' will take you to the lesson management section. Here, you can efficiently manage all lessons designed on this platform.                
                </div>
            </div>

            <Link href="/admin/edit_pdfs" className="mt-9
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
                <span>
                    Edit PDFs breakdowns 
                </span>
                <ArrowRight strokeWidth={5} className="ml-[1000px] h-6 w-6" />
            </Link>

            <div className="bg-secondary 
                            border-none 
                            p-4 
                            flex
                            mt-7">
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
                    Select 'Edit PDFs breakdowns' to access the management section of all PDFs uploaded by users, where you can seamlessly review and manage all PDF conversations and requests made on the platform.                </div>
                </div>
        </div>      
    )
}

export default AdminPanel;