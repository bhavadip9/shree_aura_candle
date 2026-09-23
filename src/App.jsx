import { useEffect } from 'react'
import { Header, Hero, CraftSection, NotesSection, Footer, Toasts } from './components/Chrome.jsx'
import Configurator from './components/Configurator.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import { applySharedDesignFromURL, useStore } from './state/store.js'
import { useReveal } from './hooks/useReveal.js'

export default function App() {
  const cartOpen = useStore((s) => s.cartOpen)

  useEffect(() => {
    applySharedDesignFromURL()
  }, [])

  useReveal()

  // Prevent background scroll while the cart drawer is open.
  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [cartOpen])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Configurator />
        <CraftSection />
        <NotesSection />
      </main>
      <Footer />
      <CartDrawer />
      <Toasts />
    </>
  )
}
