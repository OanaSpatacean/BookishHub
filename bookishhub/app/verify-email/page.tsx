"use client"
import { useToast } from '@/components/ui/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyEmail() {
    const searchParams = useSearchParams();
    const [message, setMessage] = useState("Verifying...");
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        async function verify() {
            const token = searchParams.get("token");

            if (!token) 
            {
                setMessage("Invalid token.");
                return;
            }

            const res = await fetch(`/api/register/verify-email?token=${token}`);
            const data = await res.json();

            if (res.ok) 
            {
                toast({ title: "Success", description: "Email successfully verified! You can now log in." });
                setMessage("Success");
                setTimeout(() => {
                    router.push('/login');
                }, 1000);
            } 
            else 
            {
                toast({ title: "Warning", description: "Email verification failed." });
                setMessage(data.message || "Email verification failed.");
            }
        }

        verify();
    }, [searchParams]);

    return (
    <div className="flex 
                    flex-col 
                    items-center 
                    justify-center 
                    mt-[230px] 
                    px-2">
        <h1 className="font-semibold 
                        text-2xl 
                        text-center 
                        mb-9">
            <span className="text-blue-500 
                            font-bold">
                Account verified. Redirecting you to log in...
            </span>
        </h1>
    </div>
)}
