"use client"
import { Montserrat } from 'next/font/google';
import { Button } from './ui/button';
import React from 'react'
import { cn } from '@/lib/utils';

const font = Montserrat ({ subsets: ["cyrillic"] });

type Props = {}

const LogInButton = (props:Props) => {
    function signIn(arg0: string) { //to be removed after next-auth configuration
        console.log('Next-auth not configured yet!');
    }

    return (
        <Button variant='ghost' className={font.className} onClick={() =>{
            signIn("google");
        }}>
            Log In
        </Button>
    );
};

export default LogInButton