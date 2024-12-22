"use client"
import { useRouter } from 'next/navigation';
import { Montserrat } from 'next/font/google';
import { Button } from './ui/button';
import React from 'react'

const font = Montserrat ({ subsets: ["cyrillic"] });

type Props = {}

const LogInButton = (props: Props) => {
    const router = useRouter(); 
    
    return (
        <Button variant='ghost' className={`${font.className} font-semibold text-lg uppercase`} onClick={() => {
                router.push('/login');
            }}>
            Log In
        </Button>
    );
};

export default LogInButton