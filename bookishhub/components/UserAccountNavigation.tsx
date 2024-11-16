"use client"
import { User } from 'next-auth'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import React from 'react'
import UserProfilePicture from './UserProfilePicture';
import { LogOut } from 'lucide-react'; 
import { signOut } from "next-auth/react";

type Props = {user: User}

const UserAccountNavigation = ({user}:Props) => {
    try {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger>
                        <UserProfilePicture user={user}/>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <div className='items-center 
                                    justify-start 
                                    flex 
                                    p-2 
                                    gap-2'>
                        <div className='space-y-1 
                                        flex-col 
                                        leading-none 
                                        flex'>
                            {user?.name && 
                                <p className='font-normal'>
                                    {user.name}
                                </p>
                            }
                            {user?.email && 
                                (<p className='truncate 
                                            text-secondary-foreground 
                                            text-sm 
                                            w-[200]'>
                                    {user.email}
                                </p>)
                            }
                        </div>
                    </div>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onSelect={() => {
                        signOut();
                    }} className='cursor-pointer 
                                text-black-600'>
                        Log Out
                        <LogOut className='h-4 
                                        w-4 
                                        m1-2'/>
                    </DropdownMenuItem> 
                </DropdownMenuContent>
            </DropdownMenu>
        );
    } catch (error) {
        console.error('Error UserAccountNavigation:', error);
    }
}

export default UserAccountNavigation