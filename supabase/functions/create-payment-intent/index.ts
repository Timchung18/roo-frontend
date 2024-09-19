// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// console.log("Hello from Functions!")

// Deno.serve(async (req) => {
//   const { name } = await req.json()
//   const data = {
//     message: `Hello ${name}!`,
//   }

//   return new Response(
//     JSON.stringify(data),
//     { headers: { "Content-Type": "application/json" } },
//   )
// })

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-payment-intent' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
// supabase/functions/create-payment-intent/index.ts
// import { serve } from "https://deno.land/x/sift@0.5.0/mod.ts";
import Stripe from "https://esm.sh/stripe@16.12.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), {
  apiVersion: "2022-11-15",
});

// List of allowed origins
const allowedOrigins = [
  "http://localhost:3000", // Local development origin
  "https://roo-frontend-mocha.vercel.app/", // Production site
];

Deno.serve(async (req) => {
  // const origin = req.headers.get("Origin");

  // Allow only requests from http://localhost:3000
  // const allowedOrigin = origin === "http://localhost:3000" ? origin : "";
  const origin = req.headers.get("Origin") || "";
  const isOriginAllowed = allowedOrigins.includes(origin);

  const corsHeaders = {
    "Access-Control-Allow-Origin": isOriginAllowed ? origin : "",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    // Handle CORS preflight requests
    return new Response(null, { headers: { ...corsHeaders }});
  }
  if (req.method === "POST") {
    try {
      const { amount, currency } = await req.json();

      // Create a payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
      });

      return new Response(
        JSON.stringify({ clientSecret: paymentIntent.client_secret }),
        { headers: 
          { "Content-Type": "application/json",
            ...corsHeaders,
          }
        }
      );
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { 
          "Content-Type": "application/json" , 
          ...corsHeaders,
        },
        status: 500,
      });
    }
  }

  return new Response("Method not allowed", { 
    status: 405,
    headers: {
      ...corsHeaders, // Spread the CORS headers
      "Content-Type": "text/plain",
    }, 
  });
});
