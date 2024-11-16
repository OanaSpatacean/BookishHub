"use client"
import { signIn } from 'next-auth/react';
import { Montserrat } from 'next/font/google';
import { Button } from './ui/button';
import React from 'react'
import { cn } from '@/lib/utils';

const font = Montserrat ({ subsets: ["cyrillic"] });

type Props = {}

const LogInButton = (props:Props) => {

    return (
        <Button variant='ghost' className={font.className} onClick={() =>{
            signIn("google");
        }}>
            Log In
        </Button>
    );
};

export default LogInButton