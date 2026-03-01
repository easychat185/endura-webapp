import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServerClient } from "@supabase/ssr";

// Use service role key for webhook (no user session)
function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const tier = session.metadata?.tier;

      if (userId && tier) {
        await supabase
          .from("profiles")
          .update({ tier, updated_at: new Date().toISOString() })
          .eq("id", userId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;

      // Look up user by Stripe customer email
      const customer = await getStripe().customers.retrieve(customerId);
      if ("email" in customer && customer.email) {
        // Determine tier from price
        const priceId = subscription.items.data[0]?.price?.id;
        let tier = "free";
        if (priceId === process.env.STRIPE_PRO_PRICE_ID) tier = "pro";
        else if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID)
          tier = "premium";

        // Find the user by email through auth (using service role)
        const { data: users } = await supabase.auth.admin.listUsers();
        const user = users?.users?.find((u) => u.email === customer.email);
        if (user) {
          await supabase
            .from("profiles")
            .update({ tier, updated_at: new Date().toISOString() })
            .eq("id", user.id);
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;

      const customer = await getStripe().customers.retrieve(customerId);
      if ("email" in customer && customer.email) {
        const { data: users } = await supabase.auth.admin.listUsers();
        const user = users?.users?.find((u) => u.email === customer.email);
        if (user) {
          await supabase
            .from("profiles")
            .update({ tier: "free", updated_at: new Date().toISOString() })
            .eq("id", user.id);
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
