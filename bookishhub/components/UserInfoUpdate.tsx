import { Link } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { getAuthSession } from "@/lib/authentication";
import { redirect } from "next/navigation";

type Props = {};

const UserInfoUpdate = async (props: Props) => {
  const session = await getAuthSession();

  if(!session?.user){ 
      return redirect('/');
  }
    
  return (
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
                          font-semibold"> 
            Update account info
      </Button>                                                                  
  )
}

export default UserInfoUpdate;