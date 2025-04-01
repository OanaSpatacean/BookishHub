"use client"
import TypewriterTitleAwaitVerify from "@/components/ui/TypewriterTitleAwaitVerify";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AwaitVerify() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  async function handleResend() {
    if (!email) 
    {
      toast({ title: "Error", description: "Email not provided." });
      return;
    }

    setLoading(true);

    try 
    {
      const res = await fetch("/api/register/resend-verification-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      })

      if (res.ok) 
      {
        toast({ title: "Success", description: "Verification email sent again!" });
        setResent(true);
      } 
      else 
      {
        const data = await res.json();
        toast({ title: "Error", description: data.message || "Failed to resend email." });
      }
    } 
    catch (err) 
    {
      toast({ title: "Error", description: "Something went wrong." });
    } 
    finally 
    {
      setLoading(false);
    }
  }

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
          <TypewriterTitleAwaitVerify />
        </span>
      </h1>

      <p className="text-md text-center">
            Did not receive the verification email?{' '}
            <button onClick={handleResend} disabled={loading} className="text-blue-500 
                                                                         hover:text-blue-700 
                                                                         font-semibold
                                                                         underline">
                {loading ? "Sending..." : " Send again."}
            </button>
       </p>
    </div>
  );
}
