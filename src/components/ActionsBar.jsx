import { useState } from 'react'
import { useStore, encodeDesign } from '../state/store.js'
import { formatINR } from '../config/options.js'

export default function ActionsBar() {
  const resetConfig = useStore((s) => s.resetConfig)
  const saveDesign = useStore((s) => s.saveDesign)
  const designs = useStore((s) => s.designs)
  const loadDesign = useStore((s) => s.loadDesign)
  const deleteDesign = useStore((s) => s.deleteDesign)
  const config = useStore((s) => s.config)
  const toast = useStore((s) => s.toast)
  const [shelfOpen, setShelfOpen] = useState(false)

  const share = async () => {
    const encoded = encodeDesign(config)
    const url = window.location.origin + window.location.pathname + '?d=' + encoded
    const shareData = { title: 'My Shree Aura candle', text: 'I designed this candle — take a look', url }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        toast('Design shared')
      } else {
        await navigator.clipboard.writeText(url)
        toast('Link copied — send it to someone you love')
      }
    } catch (e) {
      if (e && e.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(url)
          toast('Link copied to clipboard')
        } catch {
          toast('Could not share right now')
        }
      }
    }
  }

  return (
    <div className="actions-bar">
      <button type="button" className="ghost-btn" onClick={resetConfig}>
        Reset
      </button>
      <div className="shelf-wrap">
        <button
          type="button"
          className="ghost-btn"
          onClick={() => setShelfOpen((o) => !o)}
          aria-expanded={shelfOpen}
        >
          My Designs{designs.length > 0 && <span className="count-badge">{designs.length}</span>}
        </button>
        {shelfOpen && (
          <div className="shelf-popover" role="menu">
            {designs.length === 0 && <p className="shelf-empty">No saved designs yet.</p>}
            {designs.map((d) => (
              <div className="shelf-item" key={d.id}>
                <button
                  type="button"
                  className="shelf-load"
                  onClick={() => {
                    loadDesign(d.id)
                    setShelfOpen(false)
                  }}
                >
                  <span className="shelf-name">{d.name}</span>
                  <span className="shelf-meta">
                    {d.summary.Shape} · {d.summary['Wax colour']} · {formatINR(d.price)}
                  </span>
                </button>
                <button
                  type="button"
                  className="shelf-delete"
                  aria-label={'Delete ' + d.name}
                  onClick={() => deleteDesign(d.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <button type="button" className="ghost-btn" onClick={saveDesign}>
        Save Design
      </button>
      <button type="button" className="ghost-btn accent" onClick={share}>
        Share My Design
      </button>
    </div>
  )
}
