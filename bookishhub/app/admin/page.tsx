import { ArrowRight, InfoIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {};

const AdminPanel = async (props: Props) => {
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
                           decoration-yellow-600">Manage your application</h1>

            <Link href="/edit_users" className="mt-10
                                                inline-block 
                                                bg-yellow-600 
                                                text-white 
                                                shadow-lg 
                                                hover:bg-yellow-700 
                                                transition-colors 
                                                duration-200 
                                                rounded-lg 
                                                py-2
                                                px-7 
                                                flex 
                                                justify-between 
                                                items-center 
                                                text-xl 
                                                w-full">
                <span>Edit platform users</span>
                <ArrowRight strokeWidth={5} className="h-9 w-9" />
            </Link>

            <div className="bg-secondary 
                            border-none 
                            p-4 
                            flex
                            mt-9">
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
                    By proceeding to the "Edit platform users" section, you will access the user management interface. This feature allows you to view, edit, and manage all user accounts created on this platform.
                </div>
            </div>
        </div>
    )
}

export default AdminPanel;