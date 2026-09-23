import { useStore } from '../../state/store.js'
import { SHAPES, SIZES, formatINR } from '../../config/options.js'

function ShapeIcon({ id }) {
  if (id === 'jar')
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 8h10v11a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19V8Z" />
        <path d="M6.5 6.5h11" strokeLinecap="round" />
        <path d="M12 8V5.5" strokeLinecap="round" />
      </svg>
    )
  if (id === 'pillar')
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="8.5" y="6" width="7" height="14.5" rx="1.2" />
        <path d="M12 6V3.5" strokeLinecap="round" />
      </svg>
    )
  if (id === 'heart')
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20s-7-4.3-8.5-9C2.6 8 4.5 5.5 7.2 5.5c1.9 0 3.4 1.1 4.3 2.6h1c.9-1.5 2.4-2.6 4.3-2.6 2.7 0 4.6 2.5 3.7 5.5-1.5 4.7-8.5 9-8.5 9Z" strokeLinejoin="round" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 9.8c0-2.5 0-4.3 0-5.3M12 14.2c0 2.5 0 4.3 0 5.3M9.9 11c-2.2-1.2-3.7-2-4.6-2.4M14.1 13c2.2 1.2 3.7 2 4.6 2.4M9.9 13c-2.2 1.2-3.7 2-4.6 2.4M14.1 11c2.2-1.2 3.7-2 4.6-2.4" strokeLinecap="round" />
    </svg>
  )
}

export function ShapePicker() {
  const shape = useStore((s) => s.config.shape)
  const setOption = useStore((s) => s.setOption)
  return (
    <div className="option-grid shape-grid" role="radiogroup" aria-label="Candle shape">
      {SHAPES.map((s) => (
        <button
          key={s.id}
          type="button"
          role="radio"
          aria-checked={shape === s.id}
          className={'option-card shape-card' + (shape === s.id ? ' is-active' : '')}
          onClick={() => setOption('shape', s.id)}
        >
          <span className="shape-icon"><ShapeIcon id={s.id} /></span>
          <span className="option-name">{s.name}</span>
          <span className="option-sub">{s.tagline}</span>
        </button>
      ))}
    </div>
  )
}

export function SizePicker() {
  const size = useStore((s) => s.config.size)
  const setOption = useStore((s) => s.setOption)
  return (
    <div className="option-grid size-grid" role="radiogroup" aria-label="Candle size">
      {SIZES.map((s) => (
        <button
          key={s.id}
          type="button"
          role="radio"
          aria-checked={size === s.id}
          className={'option-card size-card' + (size === s.id ? ' is-active' : '')}
          onClick={() => setOption('size', s.id)}
        >
          <span className={'size-dot size-' + s.id} aria-hidden="true" />
          <span className="option-name">
            {s.name}
            {s.priceDelta !== 0 && (
              <em className="price-delta">
                {s.priceDelta > 0 ? '+' : '−'}{formatINR(Math.abs(s.priceDelta)).slice(0)}
              </em>
            )}
          </span>
          <span className="option-sub">{s.detail}</span>
        </button>
      ))}
    </div>
  )
}
