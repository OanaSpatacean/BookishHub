import { NextResponse } from "next/server";
import { databaseClient } from "@/lib/database";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

async function resendVerificationEmail(email: string, token: string) 
{
  const confirmationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;

  const msg = {
    to: email,
    from: "oana.spatacean6a@gmail.com", 
    subject: "BookishHub - Confirm your email - resent",
    html: `<p>You requested to resend the verification email. Click <a href="${confirmationUrl}">here</a> to verify your email. You need to verify your email address to continue using your BookishHub account.</p>`,
  }

  await sgMail.send(msg);
}

export async function POST(request: Request) {
  try 
  {
    const { email } = await request.json();

    if (!email) 
    {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    const user = await databaseClient.user.findUnique({
      where: 
      { 
        email 
      }
    })

    if (!user) 
    {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    if (user.emailVerified) 
    {
      return NextResponse.json({ message: "Email is already verified." }, { status: 400 });
    }

    await databaseClient.verificationToken.deleteMany({
      where: 
      { 
        email 
      }
    })

    const newToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); 

    await databaseClient.verificationToken.create({
      data: 
      {
        email,
        token: newToken,
        expiresAt
      }
    })

    await resendVerificationEmail(email, newToken);

    return NextResponse.json({ message: "Verification email resent successfully." });
  } 
  catch (error) 
  {
    console.error("Error resending verification email:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
