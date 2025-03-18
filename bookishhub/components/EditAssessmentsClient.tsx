"use client";
import { ArrowRight, InfoIcon } from "lucide-react";
import Link from "next/link";

type UserSession = 
{
    user: 
    { 
        id: string; 
        name: string | null 
    };
    sessions: 
    { 
        id: string; 
        level: string; 
        createdAt: string; 
        language: 
        { 
            name: string 
        } 
    }[]
}

type Props = 
{ 
    userSessionMap: UserSession[] 
}

const EditAssessmentsClient = ({ userSessionMap }: Props) => {
    return (
        <div className="flex 
                        flex-col 
                        items-start 
                        w-full 
                        px-4
                        max-w-none 
                        mt-7">
            <h1 className="sm:text-5xl 
                           text-left 
                           font-bold 
                           text-3xl 
                           underline 
                           decoration-4 
                           decoration-gray-500">
                Edit language assessments
            </h1>

            <Link href="/admin/edit_assessments/languages" className="mt-7 
                                                                      inline-block 
                                                                      text-white 
                                                                      transition 
                                                                      bg-gradient-to-r 
                                                                      from-gray-500 
                                                                      to-gray-900 
                                                                      hover:from-gray-600 
                                                                      hover:to-gray-800 
                                                                      rounded-lg 
                                                                      py-2 
                                                                      px-7 
                                                                      flex 
                                                                      items-center 
                                                                      text-md 
                                                                      font-semibold 
                                                                      w-full">
                Click here to manage the languages available on the website
                <ArrowRight strokeWidth={5} className="ml-auto 
                                                       h-6 
                                                       w-6"/>
            </Link>

            <div className="bg-secondary 
                            border-none 
                            p-4 flex 
                            mb-7 
                            mt-7">
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
                    Here, you can view all the language sessions created by the users on the platform. You have the
                    option to remove them from the user profile if necessary. Also, press the button above to manage
                    which languages are displayed and available for use.
                </div>
            </div>

            <div className="w-full 
                            py-3">
                {userSessionMap.length === 0 ? (
                    <div className="flex 
                                    items-center 
                                    justify-center 
                                    h-[40vh]">
                        <div className="text-gray-400 
                                        italic 
                                        text-center 
                                        flex 
                                        items-center">
                            No language sessions have been created yet on the platform.
                        </div>
                    </div>
                ) : (
                    userSessionMap.map(({ user, sessions }) => (
                        <div key={user.id} className="mb-10">
                            <h2 className="text-2xl 
                                           font-semibold 
                                           mb-4">
                                Language sessions of user {user.name || "unknown"}:
                            </h2>

                            {sessions.length > 0 ? (
                                <ul className="space-y-4">
                                    {sessions.map((session) => (
                                        <li key={session.id} className="p-4 
                                                                        border 
                                                                        rounded-lg 
                                                                        bg-gray-100 
                                                                        shadow-sm">
                                            <p className="ml-8 
                                                          mb-2">
                                                <strong>
                                                    Language:
                                                </strong> 
                                                {" "}
                                                {session.language.name}
                                            </p>
                                            <p className="ml-8 
                                                          mb-2">
                                                <strong>
                                                    Level:
                                                </strong> 
                                                {" "}
                                                {session.level}
                                            </p>
                                            <p className="ml-8">
                                                <strong>
                                                    Created On:
                                                </strong> 
                                                {" "}
                                                {new Date(session.createdAt).toLocaleDateString()}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 
                                              italic">
                                    No language sessions have been created by this user
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default EditAssessmentsClient;
