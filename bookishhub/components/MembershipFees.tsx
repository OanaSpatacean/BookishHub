
"use client";
import { Button } from "./ui/button";
import { Progress } from "@radix-ui/react-progress";
import React from "react";

type Props = {}

const MembershipFees = (props:Props) => {

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

      <Button className="text-white 
                         transition 
                         bg-gradient-to-r 
                         from-blue-500 
                         to-blue-900 
                         hover:from-blue-600 
                         hover:to-blue-800 
                         w-full 
                         mb-6 
                         text-md 
                         font-semibold 
                         mt-3" onClick={handleMembership} disabled={loading}>
        <span className="mr-2">⭐</span>
        Get more designs
        <span className="ml-2">⭐</span>
      </Button>

      {data?.user.points} out of 20 designs left to be made without charge

      <Progress value={data?.user.points ? (data.user.points / 10) * 100 : 0} className="mt-1"/>
    </div>
  )
}

export default MembershipFees
