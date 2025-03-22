"use client"
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import React from 'react'

type Props = {}

const LogInButton = (props: Props) => {
    const router = useRouter(); 
    
    return (
        <Button variant='ghost' className={`font-semibold text-lg uppercase`} onClick={() => {
                router.push('/login');
            }}>
            Log In
        </Button>
    );
};

export default LogInButton