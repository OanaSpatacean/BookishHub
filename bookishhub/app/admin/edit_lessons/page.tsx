type Props = {};

const EditLessons = async (props: Props) => {
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
                           decoration-gray-500">
                Edit lessons designed by users
            </h1>
        </div>
    )
}

export default EditLessons;