import { useEffect, useRef, useState } from 'react'
import { usePrice } from '../state/store.js'
import { formatINR } from '../config/options.js'

// Smooth count-up whenever the total changes.
function useAnimatedNumber(target, duration = 450) {
  const [display, setDisplay] = useState(target)
  const fromRef = useRef(target)
  const rafRef = useRef(0)
  useEffect(() => {
    const from = fromRef.current
    if (from === target) return
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const value = Math.round(from + (target - from) * eased)
      setDisplay(value)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else fromRef.current = target
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])
  return display
}

export default function PriceSummary() {
  const { lines, customization, total } = usePrice()
  const animated = useAnimatedNumber(total)
  const [pulse, setPulse] = useState(false)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setPulse(true)
    const t = setTimeout(() => setPulse(false), 420)
    return () => clearTimeout(t)
  }, [total])

  return (
    <div className="price-summary" aria-live="polite">
      <div className="price-lines">
        {lines.map((l) => (
          <div className="price-line" key={l.label}>
            <span>{l.label}</span>
            <span className={l.amount < 0 ? 'neg' : ''}>
              {l.amount < 0 ? '−' : l.label === 'Base candle' ? '' : '+'}
              {formatINR(Math.abs(l.amount))}
            </span>
          </div>
        ))}
      </div>
      <div className="price-total-row">
        <div>
          <span className="total-caption">Total · incl. {formatINR(customization)} personalisation</span>
          <span className={'total-price' + (pulse ? ' pulse' : '')}>{formatINR(animated)}</span>
        </div>
      </div>
    </div>
  )
}
