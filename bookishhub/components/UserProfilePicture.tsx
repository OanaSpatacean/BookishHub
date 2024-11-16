import Image from "next/image";
import React from "react";
import { User } from "next-auth";
import { Avatar, AvatarFallback } from "./ui/avatar";

type Props = {user: User}

const UserProfilePicture = ({user}:Props) => {
  return (
    <Avatar>
        {user.image ? (
            <div className='h-full 
                            w-full 
                            aspect-square 
                            relative'>
                <Image src={user.image} referrerPolicy='no-referrer' alt='user profile' fill/>
            </div>
        ) : (
            <AvatarFallback>
                <span className='sr-only'>
                    {user?.name}
                </span>
            </AvatarFallback>
        )
        }
    </Avatar>
  );
};

export default UserProfilePicture