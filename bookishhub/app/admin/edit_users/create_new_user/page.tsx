import React from 'react'

type Props = {};

const CreateNewUser = async (props: Props) => {
    
    return (
        <div>
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
                            decoration-gray-600">
                    Create new user
                </h1>
            </div>
        </div>
    )
}

export default CreateNewUser;