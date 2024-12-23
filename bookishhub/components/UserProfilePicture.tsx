import Image from "next/image";
import React from "react";
import { User } from "next-auth";
import { Avatar, AvatarFallback } from "./ui/avatar";

type Props = { user: User };

const UserProfilePicture = ({user}: Props) => {
    try {
        return (
            <Avatar>
                {user.image && (user.image.startsWith("http") || user.image.startsWith("https")) ? (
                    <div className="h-full 
                                    w-full 
                                    aspect-square 
                                    relative">
                        <Image src={user.image} referrerPolicy="no-referrer" alt="user profile" fill sizes="" className="w-full 
                                                                                                                         h-full 
                                                                                                                         rounded-lg 
                                                                                                                         object-cover"/>
                    </div>
                ) : (
                    <AvatarFallback>
                        <div className="flex 
                                        items-center 
                                        justify-center
                                        w-full 
                                        h-full 
                                        bg-gray-500 
                                        rounded-lg 
                                        text-center 
                                        text-white 
                                        font-semibold">
                            <span className="sr-only">
                                {user?.name}
                            </span>

                            {user?.name ? user.name[0].toUpperCase() : "U"}
                        </div>
                    </AvatarFallback>
                )}
            </Avatar>
        );
    } 
    catch (error) {
        console.error("Error UserProfilePicture:", error);
    }
};

export default UserProfilePicture;
