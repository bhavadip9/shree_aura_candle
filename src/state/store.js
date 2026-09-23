import { useMemo } from 'react'
import { create } from 'zustand'
import { DEFAULT_CONFIG, priceBreakdown, summarizeConfig, getShape, getSize } from '../config/options.js'
import { buildLineItem } from '../shopify/cartAdapter.js'

const CART_KEY = 'shree_aura_cart_v1'
const DESIGNS_KEY = 'shree_aura_designs_v1'

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
const persist = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* private mode */ }
}

let toastId = 0

export const useStore = create((set, get) => ({
  // Live configuration
  config: { ...DEFAULT_CONFIG },
  setOption: (key, value) =>
    set((s) => ({ config: { ...s.config, [key]: value } })),
  setConfig: (config) => set({ config: { ...DEFAULT_CONFIG, ...config } }),
  resetConfig: () => {
    set({ config: { ...DEFAULT_CONFIG } })
    get().toast('Studio reset — back to the classic Ivory Jar')
  },

  // Cart (Shopify-shaped line items)
  cart: load(CART_KEY, []),
  cartOpen: false,
  setCartOpen: (open) => set({ cartOpen: open }),
  addToCart: (quantity = 1) => {
    const { config } = get()
    const item = buildLineItem(config, quantity)
    set((s) => {
      const cart = [...s.cart, item]
      persist(CART_KEY, cart)
      return { cart, cartOpen: true }
    })
    get().toast('Added to cart — your bespoke candle is saved')
  },
  updateQty: (uid, delta) =>
    set((s) => {
      const cart = s.cart
        .map((it) => (it.uid === uid ? { ...it, quantity: Math.max(0, it.quantity + delta) } : it))
        .filter((it) => it.quantity > 0)
      persist(CART_KEY, cart)
      return { cart }
    }),
  removeItem: (uid) =>
    set((s) => {
      const cart = s.cart.filter((it) => it.uid !== uid)
      persist(CART_KEY, cart)
      return { cart }
    }),
  clearCart: () => {
    persist(CART_KEY, [])
    set({ cart: [] })
  },

  // Saved designs
  designs: load(DESIGNS_KEY, []),
  saveDesign: () => {
    const { config, designs } = get()
    const entry = {
      id: Date.now(),
      name: 'Design ' + (designs.length + 1),
      createdAt: new Date().toISOString(),
      config: { ...config },
      summary: summarizeConfig(config),
      price: priceBreakdown(config).total,
    }
    const next = [...designs, entry]
    persist(DESIGNS_KEY, next)
    set({ designs: next })
    get().toast(entry.name + ' saved to your studio shelf')
    return entry
  },
  loadDesign: (id) => {
    const entry = get().designs.find((d) => d.id === id)
    if (entry) {
      get().setConfig(entry.config)
      get().toast(entry.name + ' loaded onto the candle')
    }
  },
  deleteDesign: (id) => {
    const next = get().designs.filter((d) => d.id !== id)
    persist(DESIGNS_KEY, next)
    set({ designs: next })
  },

  // Toasts
  toasts: [],
  toast: (message) => {
    const id = ++toastId
    set((s) => ({ toasts: [...s.toasts, { id, message }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 3200)
  },

  // Demo checkout (shows the Shopify order payload)
  checkoutOpen: false,
  setCheckoutOpen: (open) => set({ checkoutOpen: open }),
}))

// Memoized price selector — stable reference avoids zustand snapshot loops.
export const usePrice = () => {
  const config = useStore((s) => s.config)
  return useMemo(() => priceBreakdown(config), [config])
}

// Encode the design into a shareable URL (?d=...).
export function encodeDesign(config) {
  const json = JSON.stringify(config)
  return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeDesign(str) {
  try {
    const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(escape(atob(b64)))
    return JSON.parse(json)
  } catch {
    return null
  }
}

// Called once on app start: if the URL carries a shared design, apply it.
export function applySharedDesignFromURL() {
  const params = new URLSearchParams(window.location.search)
  const d = params.get('d')
  if (!d) return false
  const config = decodeDesign(d)
  if (!config) return false
  useStore.getState().setConfig(config)
  useStore.getState().toast('A shared design has been loaded onto your candle')
  return true
}

// Variant id a real Shopify theme would submit: base variant per shape, size as suffix.
export function shopifyVariantFor(config) {
  const shape = getShape(config.shape)
  const size = getSize(config.size)
  return { variantId: shape.shopifyVariantId, sku: 'LUM-' + shape.id.toUpperCase() + '-' + size.shopifyVariantSuffix }
}
