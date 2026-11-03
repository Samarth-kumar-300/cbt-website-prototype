export function pricingJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'CognitiveBotics',
    applicationCategory: 'HealthApplication',
    offers: {
      '@type': 'Offer',
      price: '2000',
      priceCurrency: 'INR',
      description: 'Basic plan, per user per month, up to 5 users. Taxes excluded.',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '2000',
        priceCurrency: 'INR',
        billingDuration: 'P1M',
        referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitText: 'user' },
      },
    },
  };
}
