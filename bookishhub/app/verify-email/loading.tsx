import React from "react";
import { Loader2 } from "lucide-react";

type Props = {};

const LoadPage = (props: Props) => {
  return (
    <div className="-translate-y-1/2 
                    absolute 
                    -translate-x-1/2 
                    left-1/2 
                    top-1/2">
      <Loader2 className="w-10 
                          h-10 
                          animate-spin"/>
    </div>
  )
}

export default LoadPage;