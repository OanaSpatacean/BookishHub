'use client'
import { createUserSchema } from '@/app/form-validators/user';
import { Button } from '@/components/ui/button';
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
import bcrypt from 'bcryptjs';
import Link from 'next/link';

type Props = {};

type Input = z.infer<typeof createUserSchema>;

const Register = (props: Props) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false); 

    const form = useForm<Input>(
    {
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            points: 20,
            isAdmin: false,
        },
    });

    const { mutate: createUser } = useMutation(
    {
        mutationFn: async (data: Input) => 
        {
            if (!data.password) {
                throw new Error("Password is required");
            }

            const hashedPassword = await bcrypt.hash(data.password, 10);
            const response = await axios.post('/api/register', {
                ...data,
                password: hashedPassword, 
            });
            return response.data;
        },
        onSuccess: (newUser) => 
        {
            toast({ title: "Success", description: "Account created successfully" });
            form.reset();
            setIsLoading(false);    
            const encodedEmail = encodeURIComponent(newUser.email);
            router.push(`/await-verify?email=${encodedEmail}`);
        },
        onError: () => 
        {
            toast({ title: "Warning", description: "Failed to create account. Email address already in use.", variant: "destructive" });
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
                            mt-7
                            mb-7">
                <h1 className="sm:text-5xl 
                            text-left 
                            font-bold 
                            text-3xl 
                            underline 
                            decoration-4 
                            decoration-gray-600">
                    Register
                </h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreateSubmit)} className="space-y-6 
                                                                                      bg-white 
                                                                                      p-6 
                                                                                      rounded-md 
                                                                                      shadow-md 
                                                                                      w-full 
                                                                                      mt-8
                                                                                      dark:bg-gray-900">
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

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                <div className="relative">
                                    <Input
                                    placeholder="Password"
                                    type={showPassword ? 'text' : 'password'} 
                                    {...field}
                                    />
                                    <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 px-3 text-gray-600"
                                    >
                                    {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                </FormControl>
                            </FormItem>
                            )}
                        />

                        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Creating your account...' : 'Create your account'}
                        </Button>

                        <p className="text-sm text-center">
                            Already have an account?{' '}
                            <Link href="/login" className="text-blue-500 hover:underline">
                                Login here
                            </Link>
                        </p>
                    </form>
            </Form>
        </div>          
    )
}

export default Register;