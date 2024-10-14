
import { User } from 'next-auth'
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import React from 'react'
import { LogOut } from 'lucide-react'; //not sure if it's the right import, to be checked
import UserProfilePicture from './UserProfilePicture';

type Props = {user: User}

const UserAccountNavigation = ({user}:Props) => {
    function signOut() { //to be removed after next-auth configuration
        console.log('Next-auth not configured yet!');
    }

  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <Button>
                <UserProfilePicture user={user}/>
            </Button>
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
};

export default UserAccountNavigation