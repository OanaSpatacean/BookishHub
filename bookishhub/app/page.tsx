export const dynamic = 'force-dynamic';
import TypewriterTitleFileBreakdown from "@/components/ui/TypewriterTitleFileBreakdown";
import TypewriterTitleLanguageCheck from "@/components/ui/TypewriterTitleLanguageCheck";
import TypewriterTitleLessonDesign from "@/components/ui/TypewriterTitleLessonDesign";
import { Button } from "@/components/ui/button";
import { getAuthSession } from "@/lib/authentication";
import Link from "next/link";

export default async function Home() {
  const session = await getAuthSession();

  return (
    <div className="flex 
                    flex-col 
                    items-center 
                    justify-center 
                    mt-[120px] 
                    px-2">
      <h1 className="font-semibold 
                     text-7xl 
                     text-center 
                     mb-9">
        <span className="text-blue-500 
                         font-bold">
            BookishHub
        </span>
        {" "}
        an AI generative
        {" "}
        <span className="text-blue-500 
                         font-bold">
          tool
        </span>
      </h1>

      <div className="mt-4 
                      min-h-[40px] 
                      text-2xl 
                      font-semibold 
                      text-center 
                      text-slate-700 
                      mb-9">
        <TypewriterTitleFileBreakdown />
        <TypewriterTitleLessonDesign />
        <TypewriterTitleLanguageCheck />
      </div>

      <div className="mt-8 w-full flex justify-center">
        {!session?.user ? (
          <Link href="/login" className="w-full">
            <Button size="lg" className="w-full 
                                         text-white 
                                         transition 
                                         bg-gradient-to-r 
                                         from-blue-500 
                                         to-blue-900 
                                         hover:from-blue-600 
                                         hover:to-blue-800 
                                         rounded-lg 
                                         py-2 
                                         px-7 
                                         text-md 
                                         font-semibold">
              Log in to start
            </Button>
          </Link>
        ) : (
          <div className="w-full space-y-4">
            {session.user.isAdmin ? (
              <Link href="/admin" className="w-full">
                <Button size="lg" className="w-full 
                                            text-white 
                                            dark:text-black
                                            transition 
                                            bg-gradient-to-r 
                                            from-grey-500 
                                            to-grey-900 
                                            hover:from-grey-600 
                                            hover:to-grey-800 
                                            rounded-lg 
                                            py-2 
                                            px-7 
                                            text-md 
                                            font-semibold
                                            mb-4">
                  Admin panel
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/breakdown" className="w-full">
                  <Button size="lg" className="w-full 
                                              text-white 
                                              transition 
                                              bg-gradient-to-r 
                                              from-green-500 
                                              to-green-900 
                                              hover:from-green-600 
                                              hover:to-green-800 
                                              rounded-lg 
                                              py-2 
                                              px-7 
                                              text-md 
                                              font-semibold
                                              mb-4">
                    File breakdown
                  </Button>
                </Link>

                <Link href="/library" className="w-full">
                  <Button size="lg" className="w-full 
                                              text-white 
                                              transition 
                                              bg-gradient-to-r 
                                              from-blue-500 
                                              to-blue-900 
                                              hover:from-blue-600 
                                              hover:to-blue-800 
                                              rounded-lg 
                                              py-2 
                                              px-7 
                                              text-md 
                                              font-semibold
                                              mb-4">
                    Lesson design
                  </Button>
                </Link>

                <Link href="/language" className="w-full">
                  <Button size="lg" className="w-full 
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
                                              text-md 
                                              font-semibold
                                              mb-4">
                    Language check
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}