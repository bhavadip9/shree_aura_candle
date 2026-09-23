import { useEffect, useState } from 'react'
import { useStore } from '../state/store.js'
import BrandLogo from './BrandLogo.jsx'

export function Header() {
  const cart = useStore((s) => s.cart)
  const setCartOpen = useStore((s) => s.setCartOpen)
  const count = cart.reduce((n, it) => n + it.quantity, 0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={'site-header' + (scrolled ? ' scrolled' : '')}>
      <a className="brand" href="#top" title="SA Candles">
        <BrandLogo size={44} showBadge={true} badgeShape="rounded" />
        <span className="brand-text">
          SA <em>CANDLES</em>
        </span>
      </a>
      <nav className="site-nav">
        <a href="#customize">Atelier</a>
        <a href="#craft">Craft</a>
        <a href="#notes">Fragrances</a>
      </nav>
      <button type="button" className="cart-btn" onClick={() => setCartOpen(true)} aria-label="Open cart">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 8h12l-1.2 11a1.6 1.6 0 0 1-1.6 1.5H8.8A1.6 1.6 0 0 1 7.2 19L6 8Z" strokeLinejoin="round" />
          <path d="M9 10V6.8a3 3 0 0 1 6 0V10" strokeLinecap="round" />
        </svg>
        {count > 0 && <span className="cart-count">{count}</span>}
      </button>
    </header>
  )
}

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-inner">
        <p className="eyebrow reveal">Hand-poured in small batches</p>
        <h1 className="reveal">
          A candle made <em>for one</em> —<br />
          designed by you.
        </h1>
        <p className="hero-sub reveal">
          Shape the wax, choose the fragrance, write the words. Watch your candle take form in
          real time, then hold it in your hands.
        </p>
        <div className="hero-cta reveal">
          <a className="primary-btn" href="#customize">
            Begin designing
          </a>
          <a className="ghost-btn" href="#craft">
            Our craft
          </a>
        </div>
      </div>
      <div className="scroll-cue" aria-hidden="true">
        <span />
      </div>
    </section>
  )
}

const CRAFT = [
  {
    title: 'Slow-poured wax',
    body: 'A soy & coconut blend poured at exactly 55°C for a glass-smooth top and an even, 45-hour burn.',
  },
  {
    title: 'Fine fragrance',
    body: 'Phthalate-free oils from Grasse, dosed by hand — never so loud they enter the room before you do.',
  },
  {
    title: 'Your words, printed',
    body: 'Each label is letterpress-printed in-house, so a birthday wish feels as permanent as it should.',
  },
]

export function CraftSection() {
  return (
    <section className="craft" id="craft">
      <p className="eyebrow reveal">The craft</p>
      <h2 className="reveal">
        Made slowly, <em>on purpose</em>
      </h2>
      <div className="craft-grid">
        {CRAFT.map((c, i) => (
          <article className="craft-card reveal" key={c.title} style={{ '--d': i * 0.12 + 's' }}>
            <span className="craft-num">0{i + 1}</span>
            <h3>{c.title}</h3>
            <p>{c.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

const NOTES = ['Vanilla', 'Rose', 'Lavender', 'Coffee', 'Sandalwood', 'Jasmine']

export function NotesSection() {
  return (
    <section className="notes" id="notes">
      <p className="eyebrow reveal">The library</p>
      <h2 className="reveal">
        Six house <em>fragrances</em>
      </h2>
      <div className="notes-row reveal">
        {NOTES.map((n) => (
          <span className="note-chip" key={n}>
            {n}
          </span>
        ))}
      </div>
      <p className="notes-sub reveal">…or brief us on a custom blend, and we will bottle it for you.</p>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <BrandLogo size={52} showBadge={true} badgeShape="circle" />
        <span className="brand-text">
          SA <em>CANDLES</em>
        </span>
      </div>
      <p>Bespoke Candle Studio · Poured to Order · Handcrafted Luxury</p>
      <p className="footer-fine">© 2026 SA CANDLES (Shree Aura) — Designed with real-time 3D atelier.</p>
    </footer>
  )
}

export function Toasts() {
  const toasts = useStore((s) => s.toasts)
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div className="toast" key={t.id}>
          {t.message}
        </div>
      ))}
    </div>
  )
}
