// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminSupabaseClient } from '@/lib/supabase'

const PLAN_CREDITS: Record<string, number> = {
  starter: 5,
  pro: 20,
  agency: 60,
  credits: 10,
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: any

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Stripe webhook error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminSupabaseClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const { userId, plan, type } = session.metadata || {}
      if (!userId) break

      if (type === 'credits') {
        const { data: user } = await supabase.from('users').select('credits').eq('id', userId).single()
        if (user) {
          await supabase.from('users').update({ credits: user.credits + 10, updated_at: new Date().toISOString() }).eq('id', userId)
        }
      } else {
        await supabase.from('users').update({
          plan: plan || 'starter',
          stripe_subscription_id: session.subscription,
          credits: PLAN_CREDITS[plan || 'starter'] || 5,
          updated_at: new Date().toISOString(),
        }).eq('id', userId)
      }
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object
      const subscriptionId = invoice.subscription
      if (!subscriptionId) break

      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const priceId = subscription.items.data[0]?.price.id

      let plan = 'starter'
      if (priceId === process.env.STRIPE_PRO_PRICE_ID) plan = 'pro'
      if (priceId === process.env.STRIPE_AGENCY_PRICE_ID) plan = 'agency'

      const { data: user } = await supabase.from('users').select('id').eq('stripe_subscription_id', subscriptionId).single()
      if (user) {
        await supabase.from('users').update({ credits: PLAN_CREDITS[plan] || 5, plan, updated_at: new Date().toISOString() }).eq('id', user.id)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object
      await supabase.from('users').update({ plan: 'free', stripe_subscription_id: null, updated_at: new Date().toISOString() }).eq('stripe_subscription_id', subscription.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
