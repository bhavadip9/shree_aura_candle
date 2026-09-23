import { Suspense, lazy, useState } from 'react'
import { useStore, usePrice } from '../state/store.js'
import { formatINR } from '../config/options.js'
import { ShapePicker, SizePicker } from './controls/ShapeAndSize.jsx'
import { WaxColorPicker, FragrancePicker } from './controls/ColorAndFragrance.jsx'
import { LabelPicker, TextCustomizer } from './controls/LabelAndText.jsx'
import PackagingPicker from './controls/PackagingPicker.jsx'
import PriceSummary from './PriceSummary.jsx'
import ActionsBar from './ActionsBar.jsx'

const CandleScene = lazy(() => import('../three/CandleScene.jsx'))

function Section({ index, title, hint, children }) {
  return (
    <section className="control-section reveal">
      <header className="control-head">
        <span className="control-index">{index}</span>
        <h3>{title}</h3>
        {hint && <span className="control-hint">{hint}</span>}
      </header>
      {children}
    </section>
  )
}

export default function Configurator() {
  const config = useStore((s) => s.config)
  const addToCart = useStore((s) => s.addToCart)
  const { total } = usePrice()
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="configurator" id="customize">
      <div className="viewer-col">
        <div className="viewer-frame">
          <Suspense
            fallback={
              <div className="viewer-loading">
                <div className="loading-flame" />
                <p>Lighting the studio…</p>
              </div>
            }
          >
            <CandleScene config={config} />
          </Suspense>
          <div className="viewer-hint" aria-hidden="true">
            <span>Drag to rotate · Scroll to zoom</span>
          </div>
        </div>
      </div>

      <div className="panel-col">
        <header className="panel-title reveal">
          <p className="eyebrow">The Atelier</p>
          <h2>
            Design your <em>candle</em>
          </h2>
          <p className="panel-sub">
            Every choice is poured into the piece in front of you — instantly.
          </p>
        </header>

        <Section index="01" title="Shape" hint="sculpted to order">
          <ShapePicker />
        </Section>

        <Section index="02" title="Wax Colour" hint="soy & coconut blend">
          <WaxColorPicker />
        </Section>

        <Section index="03" title="Size">
          <SizePicker />
        </Section>

        <Section index="04" title="Fragrance" hint="phthalate-free oils">
          <FragrancePicker />
        </Section>

        <Section index="05" title="Label Design">
          <LabelPicker />
        </Section>

        <Section index="06" title="Your Message" hint="printed on the label">
          <TextCustomizer />
        </Section>

        <Section index="07" title="Packaging">
          <PackagingPicker />
        </Section>

        <div className="buy-box reveal">
          <PriceSummary />
          <div className="buy-row">
            <div className="qty-stepper" aria-label="Quantity">
              <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((q) => Math.min(9, q + 1))} aria-label="Increase quantity">+</button>
            </div>
            <button type="button" className="primary-btn" onClick={() => addToCart(quantity)}>
              Add to Cart · {formatINR(total * quantity)}
            </button>
          </div>
          <ActionsBar />
        </div>
      </div>

      <div className="sticky-bar">
        <div className="sticky-info">
          <strong>{formatINR(total * quantity)}</strong>
          <span>Bespoke candle</span>
        </div>
        <button type="button" className="primary-btn" onClick={() => addToCart(quantity)}>
          Add to Cart
        </button>
      </div>
    </div>
  )
}
