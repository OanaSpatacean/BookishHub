import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";

type Props = {};

const DraftAssist = (props: Props) => {
  return (
    <div className="flex 
                        flex-col 
                        items-start 
                        mx-auto 
                        px-15  
                        max-w-7xl
                        mt-7">
            <h1 className="sm:text-5xl 
                           text-left 
                           font-bold 
                           text-3xl 
                           underline 
                           decoration-4 
                           decoration-purple-500
                           mb-5">
                Draft assist 
            </h1>

            <Button size='lg' className='mt-6 
                                                 w-full
                                                 inline-block 
                                                 text-white 
                                                 transition 
                                                 bg-gradient-to-r 
                                                 from-purple-500 
                                                 to-purple-900 
                                                 hover:from-purple-600 
                                                 hover:to-purple-800 
                                                 rounded-lg 
                                                 py-2
                                                 px-7 
                                                 flex 
                                                 items-center 
                                                 text-md
                                                 font-semibold' type='submit'>
                    <Plus className="w-full 
                                  mr-2 
                                  h-4" />
                    Create new draft
            </Button>
    </div>
  )
}

export default DraftAssist;