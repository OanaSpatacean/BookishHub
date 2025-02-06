'use client';
import { updateAccountInfoSchema } from '@/app/form-validators/user';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { signOut } from "next-auth/react";

const AccountInfo = () => {
    const { toast } = useToast();
    const router = useRouter();
    const [changePassword, setChangePassword] = useState(false);
    
    const form = useForm({
        resolver: zodResolver(updateAccountInfoSchema),
        defaultValues: {
            name: '',
            password: '',
        }
    })

    const { mutate: deleteAccount, isLoading: isDeleting } = useMutation(
        async () => {
            await axios.delete("/api/account_info");
            signOut();
        },
        {
            onSuccess: () => {
                toast({ title: "Success", description: "Account deleted successfully. We are sorry to see you go!" });
                router.push('/');
            },
            onError: (error) => {
                console.error(error);
                toast({ title: "Warning", description: "An error occurred while deleting the account", variant: "destructive" });
            }
        })

    const { mutate: updateAccount, isLoading: isUpdating } = useMutation(
        async (input) => {
            await axios.put("/api/account_info", input);
        },
        {
            onSuccess: () => 
            {
                toast({ title: "Success", description: "Account updated successfully" });
                router.push('/configurations');
            },
            onError: (error) => 
            {
                console.error(error);
                toast({ title: "Warning", description: "An error occurred while updating the account", variant: "destructive" });
            },
        });

    return (
        <div className="flex 
                        flex-col 
                        items-start 
                        mx-auto 
                        px-15 
                        max-w-7xl 
                        mt-7 
                        mb-7">
            <h1 className="sm:text-5xl 
                           text-left 
                           font-bold 
                           text-3xl 
                           underline 
                           decoration-4 
                           decoration-gray-600
                           mb-[15px]">
                Update your account
            </h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(updateAccount)} className="space-y-6 bg-white p-6 rounded-md shadow-md w-full mt-8 dark:bg-gray-900 text-sm">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel className='font-bold'>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Update your name" {...field} />
                            </FormControl>
                        </FormItem>
                    )} />

                    <div className='font-bold'>
                        Change Password 
                        <Checkbox checked={changePassword} onCheckedChange={setChangePassword} className='ml-3' />
                    </div>

                    {changePassword && (
                        <>
                        <FormField control={form.control} name="oldPassword" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Old password
                                    </FormLabel>

                                    <FormControl>
                                        <Input type="password" placeholder="Enter old password" {...field} required />
                                    </FormControl>
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="password" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        New password
                                    </FormLabel>

                                    <FormControl>
                                        <Input type="password" placeholder="Enter new password" {...field} required />
                                    </FormControl>
                                </FormItem>
                            )} />
                        </>
                    )}

                    <div className="flex 
                                    space-x-4">
                        <Button type="submit" size="lg" className="w-full" disabled={isUpdating}>
                            {isUpdating ? 'Updating...' : 'Update account'}
                        </Button>
                        
                        <Button type="button" size="lg" className="w-full 
                                                                   bg-red-600" onClick={() => deleteAccount()} disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete account'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default AccountInfo;
