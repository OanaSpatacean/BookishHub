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

const AccountInfo = () => {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    
    const form = useForm({
        resolver: zodResolver(updateAccountInfoSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            oldPassword: '',
            points: 20,
            isAdmin: false,
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (input) => {
            const response = await axios.put("/api/account_info", input);
            return response.data;
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Account updated successfully" });
            window.location.reload();
        },
        onError: (error) => {
            console.error(error);
            toast({ title: "Error", description: "Failed to update account", variant: "destructive" });
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async () => {
            await axios.delete("/api/user/delete");
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Account deleted" });
            router.push('/');
        },
        onError: (error) => {
            console.error(error);
            toast({ title: "Error", description: "Failed to delete account", variant: "destructive" })
        }
    })

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
                           decoration-gray-600">
                Update your account
            </h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(updateMutation.mutate)} className="space-y-6 
                                                                                     bg-white 
                                                                                     p-6 
                                                                                     rounded-md 
                                                                                     shadow-md 
                                                                                     w-full 
                                                                                     mt-8 
                                                                                     dark:bg-gray-900 
                                                                                     text-sm">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel className='font-bold'>
                                Name
                            </FormLabel>

                            <FormControl>
                                <Input placeholder="Update your name" {...field} />
                            </FormControl>
                        </FormItem>
                    )} />

                    <div className='font-bold'>
                        Change Password 
                        <Checkbox checked={changePassword} onCheckedChange={setChangePassword} className='ml-3'>
                        </Checkbox>
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
                        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update account'}
                        </Button>
                        
                        <Button type="button" size="lg" className="w-full 
                                                                   bg-red-600" onClick={() => deleteMutation.mutate()}>
                            Delete account
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default AccountInfo;
