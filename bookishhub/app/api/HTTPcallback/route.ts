import { NextResponse } from "next/server";
import { databaseClient } from "@/lib/database";
import Stripe from "stripe";
import { stripe } from "@/lib/payment";
import { headers } from "next/headers";

export async function POST(request: Request, response: Response) 
{
  let event: Stripe.Event;
  const signature = headers().get("Stripe-Signature") as string;
  const body = await request.text();

  try 
  {
        event = stripe.webhooks.constructEvent(signature,process.env.STRIPE_WEBHOOK_SECRET as string,body)
  } 
  catch(error) 
  {
    return new NextResponse("HTTP callback error", 
    { 
        status: 400 
  })}

  const session = event.data.object as Stripe.Checkout.Session;


  if(event.type === "invoice.payment_succeeded") 
  {
    const membership = await stripe.subscriptions.retrieve(session.subscription as string)

    await databaseClient.membership.update(
    {
      where: 
      {
        paymentMembershipId: membership.id
      },
      data: 
      {
        paymentCurrentPeriodEnding: new Date(membership.current_period_end*1000),
        paymentAmmountId: membership.items.data[0].price.id     
      }})}
    
  if(event.type === "checkout.session.completed") 
  {
    const membership = await stripe.subscriptions.retrieve(session.subscription as string)

    if (!session?.metadata?.userId) 
    {
      return new NextResponse("HTTP callback error, there is no user id", 
      { 
        status: 400 
    })}

    await databaseClient.membership.create(
    {
      data: 
      {
        paymentClientId: membership.customer as string,   
        paymentMembershipId: membership.id,       
        userId: session.metadata.userId,
        paymentCurrentPeriodEnding: new Date(membership.current_period_end*1000),
        paymentAmmountId: membership.items.data[0].price.id
      }})}

  return new NextResponse(null, 
    { 
        status: 200 
    })}