// @ts-nocheck
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 4900,
    credits: 5,
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
    features: [
      '5 credits/month',
      '1 clinic',
      'EN + DE languages',
      'Dark & Light themes',
      'ZIP export',
      'Email support',
    ],
  },
  pro: {
    name: 'Pro',
    price: 14900,
    credits: 20,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      '20 credits/month',
      '3 clinics',
      'All 10 languages',
      'Dark & Light themes',
      'ZIP export',
      'Priority support',
      'Custom domain guide',
      'Before/After watermarking',
    ],
  },
  agency: {
    name: 'Agency',
    price: 34900,
    credits: 60,
    priceId: process.env.STRIPE_AGENCY_PRICE_ID,
    features: [
      '60 credits/month',
      'Unlimited clinics',
      'All languages',
      'White-label export',
      'API access',
      'Dedicated support',
      'Custom templates',
    ],
  },
}

export const CREDIT_PACK = {
  name: '10 Credit Pack',
  price: 2900,
  credits: 10,
  priceId: process.env.STRIPE_CREDITS_PRICE_ID,
}
