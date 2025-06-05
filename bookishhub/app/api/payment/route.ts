export const dynamic = 'force-dynamic';
import { databaseClient } from "@/lib/database";
import {stripe} from "@/lib/payment";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/authentication";

export async function GET(){
  try 
  {
      const session = await getAuthSession();

      if (!session?.user) 
      {
        return new NextResponse("You are not logged in", { status: 401 });
      }

      const membership = await databaseClient.membership.findUnique(
        {
        where:
        {
          userId: session.user.id,
      }})

      if (membership != null && membership.paymentClientId != null) 
      {
        const payment_session = await stripe.billingPortal.sessions.create(
          {
            return_url: configurationsEndpoint,
            customer: membership.paymentClientId   
          })

        return NextResponse.json({ url: payment_session.url });
      }

      const payment_session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        customer_email: session.user.email ?? "",
        success_url: configurationsEndpoint,
        cancel_url: configurationsEndpoint, 
        billing_address_collection: "auto",
        mode: "subscription",
        metadata: 
        {
          userId: session.user.id
        },
        line_items: 
        [
          {
            quantity: 1,
            price_data: 
            {
              recurring: 
              {
                interval: "month"
              },
              product_data: 
              {
                name: "BookishHub Power",
                description: "Create as many file breakdowns, lesson designs and language test sessions as you need!"
              },
              currency: "RON",  
              unit_amount: 10000,        
            }  
          }
        ]
      })

      return NextResponse.json({url: payment_session.url });
  } 
  catch (error) 
  {
      console.log("There was a payment error", error);
      return new NextResponse("Internal server error", { status: 500 });
  }
}

const configurationsEndpoint = process.env.NEXTAUTH_URL + "/configurations";
