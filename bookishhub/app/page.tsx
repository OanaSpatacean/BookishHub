import TypewriterTitleFileBreakdown from "@/components/ui/TypewriterTitleFileBreakdown";
import TypewriterTitleLessonDesign from "@/components/ui/TypewriterTitleLessonDesign";
import TypewriterTitleLanguageCheck from "@/components/ui/TypewriterTitleLanguageCheck";
import { Button } from "@/components/ui/button";
import { getAuthSession } from "@/lib/authentication";
import Link from "next/link";

export default async function Home() {
  const session = await getAuthSession();

  if (!session) 
  {
    console.log("Session not found. User is not authenticated.");
  }

  return (
    <div className="flex 
                    flex-col 
                    items-center 
                    justify-center 
                    mt-[150px] 
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

      <div className="mt-8 
                      w-full
                      flex 
                      justify-center">
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
      </div>
    </div>
  );
}
