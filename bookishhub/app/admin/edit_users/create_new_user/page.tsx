'use client'
import { createUserSchema } from '@/app/form-validators/user';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { z } from 'zod';
import axios  from 'axios';
import { useForm } from 'react-hook-form';

type Props = {};

type Input = z.infer<typeof createUserSchema>;

const CreateNewUser = (props: Props) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<Input>(
    {
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            name: '',
            email: '',
            image: '',
            points: 10,
            isAdmin: false,
        },
    });

    const { mutate: createUser } = useMutation(
    {
        mutationFn: async (data: Input) => 
        {
            const response = await axios.post("/api/admin/edit_users", data);
            return response.data;
        },
        onSuccess: (newUser) => 
        {
            toast({ title: "Success", description: "User created successfully" });
            form.reset();
            setIsLoading(false);
            router.push(`/admin/edit_users`);
        },
        onError: () => 
        {
            toast({ title: "Warning", description: "Failed to create user", variant: "destructive" });
        }
    })

    const handleCreateSubmit = (data: Input) => 
    {
        console.log("Data being sent:", data);
        createUser(data);
    };
    
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
                            decoration-gray-600">
                    Create new user
                </h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreateSubmit)} className="space-y-6 
                                                                                      bg-white 
                                                                                      p-6 
                                                                                      rounded-md 
                                                                                      shadow-md 
                                                                                      w-full 
                                                                                      mt-6">
                        <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="User name" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}/>

                        <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email address" type="email" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}/>

                        <FormField control={form.control} name="image" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile Image URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://image-url.com" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}/>

                        <FormField control={form.control} name="points" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Points</FormLabel>
                                    <FormControl>
                                    <Input
                                        placeholder="0"
                                        type="number"
                                        min="0"  
                                        {...field}
                                        onChange={(e) => {
                                            const value = Number(e.target.value);
                                            field.onChange(value < 0 ? 0 : value); 
                                        }}
                                    />
                                    </FormControl>
                                </FormItem>
                            )}/>

                        <FormField control={form.control} name="isAdmin" render={({ field }) => (
                                <FormItem className="flex 
                                                     items-center 
                                                     space-x-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel>Admin</FormLabel>
                                </FormItem>
                            )}/>

                        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Creating user...' : 'Create user'}
                        </Button>
                    </form>
            </Form>
        </div>          
    )
}

export default CreateNewUser;