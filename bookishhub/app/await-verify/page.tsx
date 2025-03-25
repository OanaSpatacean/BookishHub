"use client"
import TypewriterTitleAwaitVerify from "@/components/ui/TypewriterTitleAwaitVerify";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AwaitVerify() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/");
        }, 14000);

        return () => clearTimeout(timer); 
    }, [router]);
    
    return (
    <div className="flex 
                    flex-col 
                    items-center 
                    justify-center 
                    mt-[260px] 
                    px-2">
        <h1 className="font-semibold 
                        text-2xl 
                        text-center 
                        mb-9">
            <span className="text-blue-500 
                            font-bold">
                <TypewriterTitleAwaitVerify/>
            </span>
        </h1>
    </div>
)}


