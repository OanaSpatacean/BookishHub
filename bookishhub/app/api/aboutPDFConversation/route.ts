import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/authentication";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.redirect("/");
    }

  } catch (error) {
   
  }
}
