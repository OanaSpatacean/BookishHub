"use client";
import axios from "axios"
import React from "react";
import { Button } from "./ui/button";

type Props = 
{
    isPowerAccount: boolean
}

const CreateMembership = ({isPowerAccount}:Props) => {
    const [loading, setLoading] = React.useState(false);

    const handleSubscribe = async () => 
    {
        setLoading(true);

        try 
        {
            const response = await axios.get("/api/payment");
            window.location.href = response.data.url;
        } 
        catch (error) 
        {
            console.log("There was a payment error");
        } 
        finally 
        {
            setLoading(false);
        }
    }
    
    return (
        <Button onClick={handleSubscribe} disabled={loading} className="text-white 
                                                                        transition 
                                                                        bg-gradient-to-r 
                                                                        from-blue-500 
                                                                        to-blue-900 
                                                                        hover:from-blue-600 
                                                                        hover:to-blue-800 
                                                                        w-full 
                                                                        mb-6 
                                                                        text-md 
                                                                        font-semibold">
            {
                isPowerAccount ? 
                "Get your monthly membership" 
                : 
                "Get more points"
            }
        </Button>
  )
}

export default CreateMembership;