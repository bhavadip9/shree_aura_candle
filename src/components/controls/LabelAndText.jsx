import { useStore } from '../../state/store.js'
import {
  LABEL_STYLES,
  TEXT_FONTS,
  TEXT_COLORS,
  TEXT_SIZES,
  TEXT_ALIGNS,
  formatINR,
} from '../../config/options.js'

export function LabelPicker() {
  const label = useStore((s) => s.config.label)
  const setOption = useStore((s) => s.setOption)
  return (
    <div className="chip-row" role="radiogroup" aria-label="Label design">
      {LABEL_STYLES.map((l) => (
        <button
          key={l.id}
          type="button"
          role="radio"
          aria-checked={label === l.id}
          className={'chip' + (label === l.id ? ' is-active' : '')}
          onClick={() => setOption('label', l.id)}
        >
          {l.name}
          {l.priceDelta > 0 && <em className="price-delta">+{formatINR(l.priceDelta)}</em>}
        </button>
      ))}
    </div>
  )
}

export function TextCustomizer() {
  const config = useStore((s) => s.config)
  const setOption = useStore((s) => s.setOption)
  return (
    <div className="text-customizer">
      <input
        className="text-input"
        type="text"
        maxLength={60}
        placeholder="Enter your message — e.g. Happy Birthday Riya ❤️"
        value={config.text}
        onChange={(e) => setOption('text', e.target.value)}
        aria-label="Personalised message"
      />
      <div className="text-controls">
        <div className="seg-group" role="radiogroup" aria-label="Text font">
          {TEXT_FONTS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={config.textFont === f.id}
              className={'seg' + (config.textFont === f.id ? ' is-active' : '')}
              style={{ fontFamily: f.family }}
              onClick={() => setOption('textFont', f.id)}
              title={f.name}
            >
              Ag
            </button>
          ))}
        </div>
        <div className="seg-group" role="radiogroup" aria-label="Text size">
          {TEXT_SIZES.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={config.textSize === s.id}
              className={'seg seg-sm' + (config.textSize === s.id ? ' is-active' : '')}
              onClick={() => setOption('textSize', s.id)}
            >
              {s.name.charAt(0)}
            </button>
          ))}
        </div>
        <div className="seg-group" role="radiogroup" aria-label="Text alignment">
          {TEXT_ALIGNS.map((a) => (
            <button
              key={a.id}
              type="button"
              role="radio"
              aria-checked={config.textAlign === a.id}
              className={'seg seg-sm' + (config.textAlign === a.id ? ' is-active' : '')}
              onClick={() => setOption('textAlign', a.id)}
              title={a.name}
            >
              {a.id === 'left' && '⇤'}
              {a.id === 'center' && '≡'}
              {a.id === 'right' && '⇥'}
            </button>
          ))}
        </div>
      </div>
      <div className="swatch-row swatch-row-sm" role="radiogroup" aria-label="Text colour">
        {TEXT_COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={config.textColor === c.hex}
            title={c.name}
            className={'swatch swatch-sm' + (config.textColor === c.hex ? ' is-active' : '')}
            style={{ '--swatch': c.hex }}
            onClick={() => setOption('textColor', c.hex)}
          >
            <span className="sr-only">{c.name}</span>
          </button>
        ))}
        <label className="swatch swatch-sm swatch-custom" title="Custom text colour"
          style={{ '--swatch': 'conic-gradient(#96525c,#9a7b2d,#5f7150,#46586a,#96525c)' }}>
          <input
            type="color"
            value={config.textColor}
            onChange={(e) => setOption('textColor', e.target.value)}
            aria-label="Pick a custom text colour"
          />
        </label>
      </div>
    </div>
  )
}
