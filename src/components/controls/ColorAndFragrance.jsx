import { useStore } from '../../state/store.js'
import { WAX_COLORS, FRAGRANCES, formatINR } from '../../config/options.js'

export function WaxColorPicker() {
  const color = useStore((s) => s.config.color)
  const customColor = useStore((s) => s.config.customColor)
  const setOption = useStore((s) => s.setOption)
  const activeName =
    color === 'custom' ? 'Custom Blend' : (WAX_COLORS.find((c) => c.id === color) || {}).name

  return (
    <div>
      <div className="swatch-row" role="radiogroup" aria-label="Wax colour">
        {WAX_COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={color === c.id}
            title={c.name}
            className={'swatch' + (color === c.id ? ' is-active' : '')}
            style={{ '--swatch': c.hex }}
            onClick={() => setOption('color', c.id)}
          >
            <span className="sr-only">{c.name}</span>
          </button>
        ))}
        <label
          className={'swatch swatch-custom' + (color === 'custom' ? ' is-active' : '')}
          title="Custom colour"
          style={{
            '--swatch':
              'conic-gradient(#e3b8b2,#c3b4d9,#b9d2e0,#b3bfa3,#efdcbd,#c97e5a,#e3b8b2)',
          }}
        >
          <input
            type="color"
            value={customColor}
            onChange={(e) => {
              setOption('customColor', e.target.value)
              setOption('color', 'custom')
            }}
            aria-label="Pick a custom wax colour"
          />
        </label>
      </div>
      <p className="selection-note">
        Wax · <strong>{activeName}</strong>
        {color === 'custom' && <span className="custom-chip">{customColor}</span>}
      </p>
    </div>
  )
}

export function FragrancePicker() {
  const fragrance = useStore((s) => s.config.fragrance)
  const customFragrance = useStore((s) => s.config.customFragrance)
  const setOption = useStore((s) => s.setOption)
  return (
    <div>
      <div className="option-grid fragrance-grid" role="radiogroup" aria-label="Fragrance">
        {FRAGRANCES.map((f) => (
          <button
            key={f.id}
            type="button"
            role="radio"
            aria-checked={fragrance === f.id}
            className={'option-card fragrance-card' + (fragrance === f.id ? ' is-active' : '')}
            onClick={() => setOption('fragrance', f.id)}
          >
            <span className="option-name">
              {f.name}
              {f.premium && <em className="price-delta">+{formatINR(f.priceDelta)}</em>}
            </span>
            <span className="option-sub">{f.notes}</span>
          </button>
        ))}
      </div>
      {fragrance === 'custom' && (
        <input
          className="text-input"
          type="text"
          maxLength={40}
          placeholder="Describe your blend — e.g. Fig & Cedarwood"
          value={customFragrance}
          onChange={(e) => setOption('customFragrance', e.target.value)}
        />
      )}
    </div>
  )
}
