"use client";
import { User } from '@prisma/client';
import Image from "next/image";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { z } from 'zod';
import { deleteUserSchema } from '@/app/form-validators/user';
import { useToast } from './ui/use-toast';
import { Avatar, AvatarFallback } from './ui/avatar';

type Input = z.infer<typeof deleteUserSchema>;

type Props = 
{ 
    user: User 
};

const UsersDisplayBox = ({ user }: Props) => {
    const { toast } = useToast();

    const { mutate: deleteUser, isLoading } = useMutation(
        {
        mutationFn: async (input: Input) => {
            const response = await axios.delete("/api/admin/edit_users", 
            {
                data: input,
            });
            return response.data;
        },
        onSuccess: () => 
        {
            toast({ title: "Success", description: "User deleted successfully." });
            window.location.reload();
        },
        onError: (error) => 
        {
            console.error(error);
            toast({ title: "Error", description: "An error occurred while deleting the user.", variant: "destructive" });
        }
    })

    return (
        <div className="rounded-lg 
                        border 
                        p-4 
                        flex">
            <div className="w-[120px] 
                            h-[120px] 
                            relative">
                <Avatar>
                    {user.image && (user.image.startsWith("http") || user.image.startsWith("https")) ? (
                    <Image
                        src={user.image}
                        referrerPolicy="no-referrer"
                        alt="user profile"
                        fill
                        sizes=""
                        className="w-full 
                                   h-full 
                                   rounded-lg 
                                   object-cover"
                    />
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
                          {user?.name ? user.name[0] : "U"}  
                        </div>
                      </AvatarFallback>
                    )}
                </Avatar>       
            </div>

            <div className="flex 
                            flex-grow 
                            justify-between
                            ml-4 
                            flex-col">
                <div className="items-start mb-2">
                    <h3 className="text-primary
                                   truncate 
                                   font-semibold 
                                   text-3xl">
                        {user.name || 'Anonymous'}
                    </h3>
                    <p className="text-secondary-foreground/70">
                        Email: {user.email || 'No email'}
                    </p>
                    <p className="text-secondary-foreground/70">
                        Points: {user.points}
                    </p>
                    <p className="text-secondary-foreground/70">
                        Role: {user.isAdmin ? 'Admin' : 'User'}
                    </p>
                </div>

                <div className="justify-end 
                                flex">
                    <div className="text-secondary-foreground/70">
                        <button onClick={() => deleteUser({ id: user.id })} 
                                className="underline   
                                           text-red-500 
                                           block 
                                           w-fit 
                                           disabled:opacity-50" 
                                disabled={isLoading}>
                            {isLoading ? "Deleting..." : "Delete User"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UsersDisplayBox;
