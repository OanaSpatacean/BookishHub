import { NextResponse } from "next/server";

const sleep = async () => new Promise((res) => {
    setTimeout(res, 5000);
});

export async function POST(request: Request, response: Response) {
    try {
        await sleep();
        return NextResponse.json({message: "hello, world!"});
    } catch (error) {
    
    }
}
