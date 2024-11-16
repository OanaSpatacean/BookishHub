"use client"
import { signIn } from 'next-auth/react';
import { Montserrat } from 'next/font/google';
import { Button } from './ui/button';
import React from 'react'

const font = Montserrat ({ subsets: ["cyrillic"] });

type Props = {}

const LogInButton = (props:Props) => {
    try {
        return (
            <Button variant='ghost' className={`${font.className} font-bold text-lg`} onClick={() =>{
                        signIn("google");
            }}>
                Log In
            </Button>
        );
    } catch (error) {
        console.error('Error LogInButton:', error);
    }
};

export default LogInButton