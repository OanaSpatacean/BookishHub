import LessonsDisplayBoxAdmin from "@/components/LessonDisplayBoxAdmin";
import { getAuthSession } from "@/lib/authentication";
import { databaseClient } from "@/lib/database";
import { ArrowRight, InfoIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {};

const EditLessons = async (props: Props) => {
    const session = await getAuthSession();

    if(!session?.user){ 
        return redirect('/');
    }
    
    const lessons = await databaseClient.lesson.findMany({
        include: 
        {
          modules: 
          {
            include: 
            {
              topics: true
            }
    }}})
    
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
                               decoration-gray-500">
                    Edit lessons designed by users
                </h1>

                <Link href="/design" className="mt-10
                                                inline-block 
                                                bg-gray-600 
                                                text-white 
                                                shadow-lg 
                                                hover:bg-gray-700 
                                                transition-colors 
                                                duration-200 
                                                rounded-lg 
                                                py-2
                                                px-7 
                                                flex 
                                                items-center 
                                                text-xl">
                    Click here to design yourself a new lesson for the users to explore
                    <ArrowRight strokeWidth={5} className="ml-[530px] 
                                                           h-9 
                                                           w-9"/>
                </Link>

                <div className="bg-secondary 
                                border-none 
                                p-4 
                                flex
                                mb-9
                                mt-10">
                    <div className="flex-shrink-0">
                        <InfoIcon className="text-green-500 
                                             h-10 
                                             w-10 
                                             bg-green-100 
                                             rounded-full 
                                             p-2 
                                             shadow-sm"/>
                    </div>

                    <div className="ml-5">
                        To provide users with valuable content, you have the option to add default lessons created by you. Click here to seamlessly add these lessons and offer valuable, pre-designed content to your users. You can continue to select which lessons to display on your platform and remove any lessons that are not suitable. </div>
                    </div>
            </div>

            <div className="max-w-7xl 
                            mx-auto  
                            py-3">
                {lessons.length === 0 ? (
                    <div className="flex items-center justify-center h-[30vh]">
                        <div className="text-gray-400 italic text-center flex items-center">
                                No lesson has been designed yet
                        </div>
                    </div>
                    ) : (
                        <div className="gap-4 
                                        flex-col flex">
                        {lessons.map((lesson) => (
                            <LessonsDisplayBoxAdmin key={lesson.id} lesson={lesson} />
                        ))}
                        </div>
                )}
            </div>
        </div>
    )
}

export default EditLessons;