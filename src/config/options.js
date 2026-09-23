// Single source of truth for the candle configurator.
// Prices are in whole INR. priceDelta is added to the base candle price.
// shopifyVariantId mirrors how options would map to real Shopify variants.

export const BASE_PRICE = 399

export const SHAPES = [
  { id: 'jar', name: 'Jar', tagline: 'Classic glass jar', shopifyVariantId: 4470011201 },
  { id: 'pillar', name: 'Pillar', tagline: 'Sculptural solid wax', shopifyVariantId: 4470011202 },
  { id: 'heart', name: 'Heart', tagline: 'Hand-carved heart', shopifyVariantId: 4470011203 },
  { id: 'flower', name: 'Fleur', tagline: 'Pressed-flower form', shopifyVariantId: 4470011204 },
]

export const WAX_COLORS = [
  { id: 'ivory', name: 'Ivory', hex: '#f4ead8' },
  { id: 'cream', name: 'Cream', hex: '#efdcbd' },
  { id: 'dusty-pink', name: 'Dusty Pink', hex: '#e3b8b2' },
  { id: 'lavender', name: 'Lavender', hex: '#c3b4d9' },
  { id: 'sage', name: 'Sage Green', hex: '#b3bfa3' },
  { id: 'baby-blue', name: 'Baby Blue', hex: '#b9d2e0' },
  { id: 'terracotta', name: 'Terracotta', hex: '#c97e5a' },
]

export const SIZES = [
  { id: 'small', name: 'Small', detail: '120 g · ~25 h burn', scale: 0.82, priceDelta: -50, shopifyVariantSuffix: 'S' },
  { id: 'medium', name: 'Medium', detail: '220 g · ~45 h burn', scale: 1.0, priceDelta: 0, shopifyVariantSuffix: 'M' },
  { id: 'large', name: 'Large', detail: '340 g · ~70 h burn', scale: 1.18, priceDelta: 100, shopifyVariantSuffix: 'L' },
]

export const FRAGRANCES = [
  { id: 'vanilla', name: 'Vanilla', notes: 'warm bourbon vanilla', priceDelta: 0 },
  { id: 'rose', name: 'Rose', notes: 'damask rose petals', priceDelta: 0 },
  { id: 'lavender', name: 'Lavender', notes: 'provence lavender fields', priceDelta: 0 },
  { id: 'coffee', name: 'Coffee', notes: 'roasted arabica bean', priceDelta: 0 },
  { id: 'sandalwood', name: 'Sandalwood', notes: 'mysore sandal · premium', priceDelta: 50, premium: true },
  { id: 'jasmine', name: 'Jasmine', notes: 'night-blooming jasmine · premium', priceDelta: 50, premium: true },
  { id: 'custom', name: 'Custom Fragrance', notes: 'blended to your brief', priceDelta: 75, premium: true, custom: true },
]

export const LABEL_STYLES = [
  { id: 'minimal', name: 'Minimal', priceDelta: 0 },
  { id: 'birthday', name: 'Birthday', priceDelta: 40 },
  { id: 'anniversary', name: 'Anniversary', priceDelta: 40 },
  { id: 'wedding', name: 'Wedding', priceDelta: 40 },
  { id: 'floral', name: 'Floral', priceDelta: 40 },
  { id: 'luxury', name: 'Luxury', priceDelta: 40 },
]

export const TEXT_FONTS = [
  { id: 'serif', name: 'Serif', family: '"Cormorant Garamond", serif' },
  { id: 'script', name: 'Script', family: '"Great Vibes", cursive' },
  { id: 'hand', name: 'Handwritten', family: '"Caveat", cursive' },
  { id: 'sans', name: 'Sans', family: '"Jost", sans-serif' },
]

export const TEXT_COLORS = [
  { id: 'espresso', name: 'Espresso', hex: '#3d2b1f' },
  { id: 'caramel', name: 'Caramel', hex: '#a06a35' },
  { id: 'gold', name: 'Antique Gold', hex: '#9a7b2d' },
  { id: 'rose', name: 'Rosewood', hex: '#96525c' },
  { id: 'sage', name: 'Sage', hex: '#5f7150' },
  { id: 'slate', name: 'Slate', hex: '#46586a' },
]

export const TEXT_SIZES = [
  { id: 's', name: 'Small', px: 44 },
  { id: 'm', name: 'Medium', px: 60 },
  { id: 'l', name: 'Large', px: 78 },
]

export const TEXT_ALIGNS = [
  { id: 'left', name: 'Left' },
  { id: 'center', name: 'Center' },
  { id: 'right', name: 'Right' },
]

export const PACKAGING = [
  { id: 'standard', name: 'Standard', detail: 'Kraft wrap & twine', priceDelta: 0 },
  { id: 'gift', name: 'Gift Box', detail: 'Ivory box, silk ribbon', priceDelta: 50 },
  { id: 'premium', name: 'Premium Gift Box', detail: 'Walnut-tone box, gold foil', priceDelta: 100 },
]

export const DEFAULT_CONFIG = {
  shape: 'jar',
  color: 'ivory',
  customColor: '#d9a05b',
  size: 'medium',
  fragrance: 'vanilla',
  customFragrance: '',
  label: 'minimal',
  text: '',
  textFont: 'serif',
  textColor: '#3d2b1f',
  textSize: 'm',
  textAlign: 'center',
  packaging: 'standard',
}

export const getShape = (id) => SHAPES.find((o) => o.id === id) || SHAPES[0]
export const getSize = (id) => SIZES.find((o) => o.id === id) || SIZES[1]
export const getFragrance = (id) => FRAGRANCES.find((o) => o.id === id) || FRAGRANCES[0]
export const getLabelStyle = (id) => LABEL_STYLES.find((o) => o.id === id) || LABEL_STYLES[0]
export const getPackaging = (id) => PACKAGING.find((o) => o.id === id) || PACKAGING[0]
export const getTextFont = (id) => TEXT_FONTS.find((o) => o.id === id) || TEXT_FONTS[0]

export function getWaxHex(config) {
  return config.color === 'custom' ? config.customColor : (WAX_COLORS.find((c) => c.id === config.color) || WAX_COLORS[0]).hex
}

export function getWaxName(config) {
  if (config.color === 'custom') return 'Custom Blend'
  return (WAX_COLORS.find((c) => c.id === config.color) || WAX_COLORS[0]).name
}

// Real-time price breakdown, recomputed on every option change.
export function priceBreakdown(config) {
  const lines = [{ label: 'Base candle', amount: BASE_PRICE }]
  const size = getSize(config.size)
  if (size.priceDelta !== 0) lines.push({ label: size.name + ' size', amount: size.priceDelta })
  const frag = getFragrance(config.fragrance)
  if (frag.priceDelta !== 0) lines.push({ label: frag.name + ' fragrance', amount: frag.priceDelta })
  const label = getLabelStyle(config.label)
  if (label.priceDelta !== 0) lines.push({ label: label.name + ' label', amount: label.priceDelta })
  const pack = getPackaging(config.packaging)
  if (pack.priceDelta !== 0) lines.push({ label: pack.name, amount: pack.priceDelta })
  const total = lines.reduce((sum, l) => sum + l.amount, 0)
  return { lines, base: BASE_PRICE, customization: total - BASE_PRICE, total }
}

export const formatINR = (n) => '₹' + n.toLocaleString('en-IN')

// Human-readable summary used in cart, share links and order metadata.
export function summarizeConfig(config) {
  return {
    Shape: getShape(config.shape).name,
    'Wax colour': getWaxName(config),
    Size: getSize(config.size).name,
    Fragrance: config.fragrance === 'custom' && config.customFragrance
      ? 'Custom — ' + config.customFragrance
      : getFragrance(config.fragrance).name,
    'Label design': getLabelStyle(config.label).name,
    Message: config.text || '—',
    Packaging: getPackaging(config.packaging).name,
  }
}
