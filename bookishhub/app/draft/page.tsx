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
    </div>
  )
}

export default DraftAssist;