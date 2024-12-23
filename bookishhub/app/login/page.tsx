'use client'
import { createUserSchema, loginSchema } from '@/app/form-validators/user';
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
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc'; 

type Props = {}
type Input = z.infer<typeof loginSchema>;

const Login = (props: Props) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false); 

    const form = useForm<Input>(
    {
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { mutate: login } = useMutation(
    {
        mutationFn: async (data: Input) => 
        {
            const response = await axios.post('/api/login', data);
            return response.data;
        },
        onSuccess: (newUser) => 
        {
            toast({ title: "Success", description: "You have logged in successfully" });
            form.reset();
            setIsLoading(false);
            router.push(`/`);
        },
        onError: () => 
        {
            toast({ title: "Warning", description: "Failed to log in", variant: "destructive" });
        }
    })

    const handleCreateSubmit = (data: Input) => 
    {
        console.log("Data being sent:", data);
        login(data);
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
                    Log in
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
                            {isLoading ? 'Logging into your account...' : 'Log in'}
                        </Button>

                        <div className="text-center">
                            <Button type="button" size="lg" variant="outline" className="flex 
                                                                                         items-center 
                                                                                         justify-center 
                                                                                         w-full 
                                                                                         mt-4 
                                                                                         dark:bg-white 
                                                                                         dark:text-black 
                                                                                         bg-gray-900 
                                                                                         text-white 
                                                                                         hover:text-white 
                                                                                         hover:bg-gray-800 
                                                                                         dark:hover:bg-gray-200" onClick={() => signIn('google')}>
                                <FcGoogle className="mr-2 
                                                     h-5 
                                                     w-5"/> 
                                Log in with your Google account
                            </Button>
                        </div>

                        <p className="text-sm text-center">
                            Don't have an account yet?{' '}
                            <Link href="/register" className="text-blue-500 hover:underline">
                                Register here
                            </Link>
                        </p>
                    </form>
            </Form>
        </div>              
    );
};

export default Login;
