import { useStore } from '../../state/store.js'
import { PACKAGING, formatINR } from '../../config/options.js'

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 9h16v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9Z" />
      <path d="M3 6.5h18V9H3V6.5Z" />
      <path d="M12 6.5V20M12 6.5s-2.5-4-4.5-3S6 6.5 12 6.5Zm0 0s2.5-4 4.5-3 1.5 3-4.5 3Z" strokeLinejoin="round" />
    </svg>
  )
}

export default function PackagingPicker() {
  const packaging = useStore((s) => s.config.packaging)
  const setOption = useStore((s) => s.setOption)
  return (
    <div className="option-grid packaging-grid" role="radiogroup" aria-label="Packaging">
      {PACKAGING.map((p) => (
        <button
          key={p.id}
          type="button"
          role="radio"
          aria-checked={packaging === p.id}
          className={'option-card packaging-card' + (packaging === p.id ? ' is-active' : '')}
          onClick={() => setOption('packaging', p.id)}
        >
          <span className="shape-icon"><BoxIcon /></span>
          <span className="option-name">
            {p.name}
            {p.priceDelta > 0 && <em className="price-delta">+{formatINR(p.priceDelta)}</em>}
          </span>
          <span className="option-sub">{p.detail}</span>
        </button>
      ))}
    </div>
  )
}
