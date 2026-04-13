import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { createAdminSupabaseClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { plan, type } = await req.json()
    const supabase = createAdminSupabaseClient()
    
    // Get or create Stripe customer
    const { data: user } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('email', session.user.email)
      .single()

    let customerId = user?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        name: session.user.name || undefined,
        metadata: { userId: session.user.id },
      })
      customerId = customer.id
      
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('email', session.user.email)
    }

    const PRICE_IDS: Record<string, string> = {
      starter: process.env.STRIPE_STARTER_PRICE_ID || '',
      pro: process.env.STRIPE_PRO_PRICE_ID || '',
      agency: process.env.STRIPE_AGENCY_PRICE_ID || '',
      credits: process.env.STRIPE_CREDITS_PRICE_ID || '',
    }

    const priceId = PRICE_IDS[plan]
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: type === 'credits' ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/settings?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
      metadata: { 
        userId: session.user.id,
        plan,
        type,
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: checkoutSession.url })

  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
