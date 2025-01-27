
"use client";
import axios from "axios";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import React from "react";

type Props = {
  havePowerAccount:any
}

const MembershipFees = ({havePowerAccount}:Props) => {
  const [loading, setLoading] = React.useState(false);
  const { data } = useSession();

  const handleMembership = async () => 
  {
    setLoading(true);

    try 
    {
      const response = await axios.get("/api/payment");
      window.location.href = response.data.url;
    } 
    catch (error) 
    {
      console.log("Membership fee error", error);
    } 
    finally 
    {
      setLoading(false);
    }
  }
  
  return (
    <div className="rounded-md 
                    bg-secondary 
                    flex-col 
                    flex
                    mx-auto 
                    p-4 
                    mt-4 
                    w-full 
                    mb-7 
                    items-center">
      {!havePowerAccount ? (
      <>                   
        <Button className="text-white 
                          transition 
                          bg-gradient-to-r 
                          from-gray-500 
                          to-gray-900 
                          hover:from-gray-600 
                          hover:to-gray-800 
                          w-full 
                          mb-6 
                          text-md 
                          font-semibold 
                          mt-3" onClick={handleMembership} disabled={loading}>
          <span className="mr-2">⭐</span>
          Get more points
          <span className="ml-2">⭐</span>
        </Button>

        {data?.user?.points !== undefined && data?.user?.points > 0 ? data.user.points : 0} out of 20 points left to use
      </>
        ) : (
          <p className="text-center text-gray-800 text-md font-medium dark:text-white">
            We are thrilled to have you in our&nbsp;
            <span className="font-bold text-black">BookishHub Power&nbsp;</span> 
              community! As a valued member, you gain access to exclusive resources, insights, and tools tailored to enhance your experience. With unlimited lesson designs and pdf breakdowns at your fingertips, you'll have the freedom to bring your ideas to life without limits. 
          </p>
        )}
    </div>
  )
}

export default MembershipFees
