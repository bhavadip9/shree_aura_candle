// Shopify cart adapter.
//
// Every customized candle becomes a Shopify-style line item built from
// `id` (the product variant id, one per shape like a real store),
// `quantity`, and `properties` — the customization, exactly how Shopify
// line item properties appear to the merchant on the order page.
//
// On a real Shopify storefront, addToShopifyCart() POSTs this payload to
// /cart/add.js. In this standalone studio it powers the local cart drawer
// and the demo checkout, which renders the exact order payload a merchant
// would receive.

import { priceBreakdown, summarizeConfig, getShape, getSize } from '../config/options.js'

let uidCounter = 0

export function buildLineItem(config, quantity = 1) {
  const shape = getShape(config.shape)
  const size = getSize(config.size)
  const price = priceBreakdown(config)
  const summary = summarizeConfig(config)

  return {
    uid: 'line-' + Date.now() + '-' + ++uidCounter,

    // Shopify fields
    id: shape.shopifyVariantId,
    sku: 'SAC-' + shape.id.toUpperCase() + '-' + size.shopifyVariantSuffix,
    quantity,
    properties: {
      ...summary,
      'Custom text style': config.text
        ? [config.textFont, config.textSize, config.textAlign, config.textColor].join(' · ')
        : '—',
      'Customization cost': (price.customization >= 0 ? '+₹' : '-₹') + Math.abs(price.customization).toLocaleString('en-IN'),
      'Unit price': '₹' + price.total.toLocaleString('en-IN'),
    },

    // Local display fields
    title: 'Bespoke ' + shape.name + ' Candle',
    unitPrice: price.total,
    config: { ...config },
    summary,
  }
}

// Exact payload a Shopify theme would send to /cart/add.js
export function toShopifyPayload(items) {
  return {
    items: items.map((it) => ({
      id: it.id,
      quantity: it.quantity,
      sku: it.sku,
      properties: it.properties,
    })),
  }
}

// Order-level metadata (what the merchant sees), incl. cart attributes.
export function toOrderDraft(items) {
  const subtotal = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0)
  return {
    order: {
      line_items: items.map((it) => ({
        variant_id: it.id,
        sku: it.sku,
        title: it.title,
        quantity: it.quantity,
        price: it.unitPrice.toFixed(2),
        properties: it.properties,
      })),
      total_price: subtotal.toFixed(2),
      currency: 'INR',
      note_attributes: [
        { name: 'candle_studio', value: 'Customized with Shree Aura 3D configurator' },
        { name: 'designs', value: String(items.length) + ' bespoke candle(s)' },
      ],
    },
  }
}

// Real storefront hook — used automatically when Shopify globals exist.
export async function addToShopifyCart(items) {
  const payload = toShopifyPayload(items)
  if (typeof window !== 'undefined' && window.Shopify && window.fetch) {
    const res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return res.json()
  }
  // Standalone studio: return the payload for the demo checkout.
  return { ok: true, payload }
}

export const cartSubtotal = (items) =>
  items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0)
