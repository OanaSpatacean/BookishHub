"use client"
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyEmail() {
    const searchParams = useSearchParams();
    const [message, setMessage] = useState("Verifying...");

    useEffect(() => {
        async function verify() {
            const token = searchParams.get("token");
            
            if (!token) 
            {
                setMessage("Invalid token.");
                return;
            }

            const res = await fetch(`/api/verify-email?token=${token}`);
            const data = await res.json();

            if (res.ok) 
            {
                setMessage("Email successfully verified! You can now log in.");
            } 
            else 
            {
                setMessage(data.message || "Verification failed.");
            }
        }

        verify();
    }, [searchParams]);

    return <div className="p-4 text-center">{message}</div>;
}
