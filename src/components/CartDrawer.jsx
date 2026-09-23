import { useState } from 'react'
import { useStore } from '../state/store.js'
import { formatINR, getWaxHex } from '../config/options.js'
import { cartSubtotal, toOrderDraft } from '../shopify/cartAdapter.js'

function CartItem({ item }) {
  const updateQty = useStore((s) => s.updateQty)
  const removeItem = useStore((s) => s.removeItem)
  return (
    <li className="cart-item">
      <div className="cart-item-top">
        <span className="cart-wax-dot" style={{ background: getWaxHex(item.config) }} aria-hidden="true" />
        <div className="cart-item-title">
          <strong>{item.title}</strong>
          <span className="cart-item-price">
            {formatINR(item.unitPrice)} <em>· {item.sku}</em>
          </span>
        </div>
        <button type="button" className="cart-remove" aria-label="Remove item" onClick={() => removeItem(item.uid)}>
          ×
        </button>
      </div>
      <dl className="cart-props">
        {Object.entries(item.properties).map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="qty-row">
        <button type="button" onClick={() => updateQty(item.uid, -1)} aria-label="Decrease quantity">−</button>
        <span>{item.quantity}</span>
        <button type="button" onClick={() => updateQty(item.uid, 1)} aria-label="Increase quantity">+</button>
      </div>
    </li>
  )
}

export default function CartDrawer() {
  const cart = useStore((s) => s.cart)
  const cartOpen = useStore((s) => s.cartOpen)
  const setCartOpen = useStore((s) => s.setCartOpen)
  const checkoutOpen = useStore((s) => s.checkoutOpen)
  const setCheckoutOpen = useStore((s) => s.setCheckoutOpen)
  const clearCart = useStore((s) => s.clearCart)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const subtotal = cartSubtotal(cart)
  const orderDraft = toOrderDraft(cart)

  const placeOrder = () => {
    setOrderPlaced(true)
    clearCart()
  }

  return (
    <>
      <div className={'cart-overlay' + (cartOpen ? ' open' : '')} onClick={() => setCartOpen(false)} />
      <aside className={'cart-drawer' + (cartOpen ? ' open' : '')} aria-hidden={!cartOpen}>
        <header className="cart-header">
          <h2>Your Basket</h2>
          <button type="button" className="cart-close" aria-label="Close cart" onClick={() => setCartOpen(false)}>
            ×
          </button>
        </header>
        {cart.length === 0 ? (
          <div className="cart-empty">
            <p>Your basket is empty.</p>
            <p className="cart-empty-sub">Design a candle and it will appear here with all its details.</p>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {cart.map((item) => (
                <CartItem key={item.uid} item={item} />
              ))}
            </ul>
            <footer className="cart-footer">
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <strong>{formatINR(subtotal)}</strong>
              </div>
              <button
                type="button"
                className="primary-btn wide"
                onClick={() => {
                  setCartOpen(false)
                  setCheckoutOpen(true)
                }}
              >
                Checkout
              </button>
            </footer>
          </>
        )}
      </aside>

      {checkoutOpen && (
        <div className="modal-overlay" onClick={() => setCheckoutOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button type="button" className="cart-close" aria-label="Close" onClick={() => setCheckoutOpen(false)}>
              ×
            </button>
            {!orderPlaced ? (
              <>
                <h3>Order Review</h3>
                <p className="modal-sub">
                  This is the exact payload sent to Shopify — every customisation travels with the
                  order as line-item properties, so the merchant sees precisely what to pour.
                </p>
                <pre className="order-json">{JSON.stringify(orderDraft, null, 2)}</pre>
                <button type="button" className="primary-btn wide" onClick={placeOrder}>
                  Place Demo Order · {formatINR(subtotal)}
                </button>
              </>
            ) : (
              <div className="order-success">
                <div className="success-flame" aria-hidden="true" />
                <h3>Thank you</h3>
                <p className="modal-sub">
                  Your bespoke candle is with our pourers. A confirmation would normally arrive by
                  email — this demo keeps everything in your browser.
                </p>
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => {
                    setOrderPlaced(false)
                    setCheckoutOpen(false)
                  }}
                >
                  Design another candle
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
