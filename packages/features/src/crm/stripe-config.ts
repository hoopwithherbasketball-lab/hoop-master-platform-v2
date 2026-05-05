export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_RgQ5KTnswo4SzU',
    priceId: 'price_1Qn3FjLbPj2OJiC0OMjnvqte',
    name: 'ALL STAR SHOWCASE',
    description: 'The participation fee is $26, which helps cover the cost of event logistics, and other exclusive opportunities.',
    price: 26.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prephoopsos_starter',
    priceId: 'price_1StV76LbPj2OJiC0USPi1IbN',
    name: 'PrepHoopsOS Starter',
    description: 'Perfect for individual teams getting organized. Includes team roster management, basic scheduling tools, email support, and 1 organization admin.',
    price: 19.00,
    currency: 'usd',
    mode: 'subscription'
  },
  {
    id: 'prephoopsos_pro',
    priceId: 'price_1StV8pLbPj2OJiC0jeBN2R5l',
    name: 'PrepHoopsOS Pro',
    description: 'Everything competitive programs need to scale. Unlimited teams and seasons, automated tournament registration, Stripe-enabled payments, and priority support.',
    price: 49.00,
    currency: 'usd',
    mode: 'subscription'
  },
  {
    id: 'prephoopsos_enterprise',
    priceId: 'price_1StVBPLbPj2OJiC0xOB3zutb',
    name: 'PrepHoopsOS Enterprise',
    description: 'Premium tools for league-wide operations. Multi-organization management, dedicated success manager, custom analytics dashboards, and SLA with onboarding support.',
    price: 149.00,
    currency: 'usd',
    mode: 'subscription'
  },
  {
    id: 'prephoopsos_lifetime',
    priceId: 'price_1StVCHLbPj2OJiC0X3901MsO',
    name: 'PrepHoopsOS Lifetime',
    description: 'One-time payment for lifetime access to PrepHoopsOS Pro features. Never pay again - includes all future updates and priority support forever.',
    price: 299.00,
    currency: 'usd',
    mode: 'payment'
  }
];

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}

export function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(price);
}