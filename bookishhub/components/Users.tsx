"use client";
import { User } from '@prisma/client';
import Image from "next/image";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { z } from 'zod';
import { deleteUserSchema, updateUserSchema } from '@/app/form-validators/user';
import { useToast } from './ui/use-toast';
import { Avatar, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Checkbox } from './ui/checkbox';

type Input = z.infer<typeof deleteUserSchema>;
type Input2 = z.infer<typeof updateUserSchema>;

type Props = 
{ 
    user: User 
};

const UsersDisplayBox = ({ user }: Props) => {
    const { toast } = useToast();
    const [name, setName] = useState(user.name || "");
    const [points, setPoints] = useState(user.points || 0);
    const [isAdmin, setIsAdmin] = useState(user.isAdmin || false);

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
            toast({ title: "Warning", description: "An error occurred while deleting the user.", variant: "destructive" });
        }
    })

    const { mutate: updateUser, isLoading: isUpdating } = useMutation(
    {
        mutationFn: async (input: Input2) => 
        {
            const response = await axios.put("/api/admin/edit_users", input);
            return response.data;
        },
        onSuccess: () => 
        {
            toast({ title: "Success", description: "User updated successfully." });
            window.location.reload();
        },
        onError: (error) => 
        {
            console.error(error);
            toast({ title: "Warning", description: "An error occurred while updating the user.", variant: "destructive" });
        },
    });

    return (
        <div className="rounded-lg 
                        border 
                        p-3 
                        flex
                        bg-gray-50
                        dark:bg-gray-900">
            <div className="w-[120px] 
                            h-[120px] 
                            relative">
                <Avatar>
                    {user.image && (user.image.startsWith("http") || user.image.startsWith("https")) ? (
                    <Image src={user.image} referrerPolicy="no-referrer" alt="user profile" fill sizes="" className="w-full 
                                                                                                                     h-full 
                                                                                                                     rounded-lg 
                                                                                                                     object-cover"/>
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="underline 
                                           text-blue-500 
                                           block 
                                           w-fit 
                                           disabled:opacity-50 
                                           mr-8"
                                disabled={isLoading}
                            >
                                Update user
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="p-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block 
                                                      text-sm 
                                                      font-medium">
                                        Name
                                    </label>

                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border 
                                                                                                                         rounded 
                                                                                                                         p-2 
                                                                                                                         w-full"/>
                                </div>

                                <div>
                                    <label className="block 
                                                      text-sm 
                                                      font-medium">
                                        Points
                                    </label>

                                    <input type="number" value={points} onChange={(e) => { const value = Number(e.target.value);
                                                                                           setPoints(value < 0 ? 0 : value);
                                                                                         }} className="border 
                                                                                                       rounded 
                                                                                                       p-2
                                                                                                       w-full"/>                                                                                                                                                                                                    
                                </div>

                                <div className="flex 
                                                items-center 
                                                space-x-2">
                                    <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)}/>

                                    <label className="text-sm">
                                        Admin
                                    </label>
                                </div>

                                <button
                                    className="bg-blue-500 
                                               text-white 
                                               rounded 
                                               p-2 
                                               w-full 
                                               hover:bg-blue-600" onClick={() => {
                                                                                    updateUser({
                                                                                        id: user.id,
                                                                                        name, 
                                                                                        points,
                                                                                        isAdmin,
                                                                                    });
                                                                                  }} disabled={isUpdating}>
                                    {isUpdating ? "Updating..." : "Done"}
                                </button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="text-secondary-foreground/70">
                        <button onClick={() => deleteUser({ id: user.id })} className="underline   
                                                                                       text-red-500 
                                                                                       block 
                                                                                       w-fit 
                                                                                       disabled:opacity-50" disabled={isLoading}>
                            {isLoading ? "Deleting..." : "Delete user"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UsersDisplayBox;
