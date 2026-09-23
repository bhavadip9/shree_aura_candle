import * as THREE from 'three'
import { getFragrance, getTextFont, TEXT_SIZES } from '../config/options.js'

const W = 1024
const H = 640

// Deterministic PRNG so decorative elements do not jump between redraws.
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function createLabelTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 8
  texture.colorSpace = THREE.SRGBColorSpace
  return { canvas, texture }
}

function frame(ctx, inset, color, width) {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.strokeRect(inset, inset, W - inset * 2, H - inset * 2)
}

function heart(ctx, x, y, s, color) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(s, s)
  ctx.beginPath()
  ctx.moveTo(0, 3)
  ctx.bezierCurveTo(-6, -3, -14, 2, 0, 12)
  ctx.bezierCurveTo(14, 2, 6, -3, 0, 3)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
  ctx.restore()
}

function blossom(ctx, x, y, r, petal, centerColor) {
  ctx.save()
  ctx.translate(x, y)
  for (let i = 0; i < 5; i++) {
    ctx.save()
    ctx.rotate((i / 5) * Math.PI * 2)
    ctx.beginPath()
    ctx.ellipse(0, -r * 0.62, r * 0.34, r * 0.62, 0, 0, Math.PI * 2)
    ctx.fillStyle = petal
    ctx.fill()
    ctx.restore()
  }
  ctx.beginPath()
  ctx.arc(0, 0, r * 0.24, 0, Math.PI * 2)
  ctx.fillStyle = centerColor
  ctx.fill()
  ctx.restore()
}

function sprig(ctx, x, y, angle, len, color) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.quadraticCurveTo(len * 0.2, -len * 0.5, 0, -len)
  ctx.stroke()
  for (let i = 1; i <= 4; i++) {
    const t = i / 4.6
    const ly = -len * t
    const lx = len * 0.2 * (1 - t) * 0.9
    for (const side of [-1, 1]) {
      ctx.save()
      ctx.translate(lx, ly)
      ctx.rotate(side * 0.85)
      ctx.beginPath()
      ctx.ellipse(0, -len * 0.07, len * 0.045, len * 0.1, 0, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      ctx.restore()
    }
  }
  ctx.restore()
}

const PALETTES = {
  minimal:     { bg: '#f8f2e6', ink: '#3d2b1f', accent: '#a06a35', frame: '#3d2b1f' },
  birthday:    { bg: '#fdf3e3', ink: '#4a2c2a', accent: '#c96f4a', frame: '#c96f4a' },
  anniversary: { bg: '#f7efe2', ink: '#402a22', accent: '#9a7b2d', frame: '#9a7b2d' },
  wedding:     { bg: '#f9f4ea', ink: '#37403a', accent: '#8a9779', frame: '#b28c46' },
  floral:      { bg: '#faf0ea', ink: '#4a2b31', accent: '#b3667a', frame: '#b3667a' },
  luxury:      { bg: '#2b1f16', ink: '#e8d5ac', accent: '#d9b877', frame: '#d9b877' },
}

const FONT_STACKS = [
  '52px "Cormorant Garamond"',
  '60px "Great Vibes"',
  '60px "Caveat"',
  '40px "Jost"',
]

async function ensureFonts() {
  if (!document.fonts || !document.fonts.load) return
  try {
    await Promise.all(FONT_STACKS.map((f) => document.fonts.load(f)))
  } catch (e) { /* fall back to installed fonts */ }
}

function drawDecor(ctx, style, pal) {
  const rand = mulberry32(style.length * 7919 + 13)
  if (style === 'minimal') {
    frame(ctx, 26, pal.frame, 2)
    ctx.save()
    ctx.translate(W / 2, 74)
    ctx.rotate(Math.PI / 4)
    ctx.fillStyle = pal.accent
    ctx.fillRect(-7, -7, 14, 14)
    ctx.restore()
  } else if (style === 'birthday') {
    frame(ctx, 26, pal.frame, 3)
    const colors = ['#c96f4a', '#d9a05b', '#96525c', '#5f7150', '#46586a']
    for (let i = 0; i < 42; i++) {
      const top = i % 2 === 0
      const x = 40 + rand() * (W - 80)
      const y = top ? 40 + rand() * 60 : H - 40 - rand() * 60
      ctx.beginPath()
      ctx.arc(x, y, 3 + rand() * 5, 0, Math.PI * 2)
      ctx.fillStyle = colors[Math.floor(rand() * colors.length)]
      ctx.globalAlpha = 0.75
      ctx.fill()
      ctx.globalAlpha = 1
    }
    // bunting
    ctx.strokeStyle = pal.accent
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(60, 46)
    ctx.quadraticCurveTo(W / 2, 120, W - 60, 46)
    ctx.stroke()
    for (let i = 0; i < 9; i++) {
      const t = (i + 0.5) / 9
      const bx = (1 - t) * (1 - t) * 60 + 2 * (1 - t) * t * (W / 2) + t * t * (W - 60)
      const by = (1 - t) * (1 - t) * 46 + 2 * (1 - t) * t * 120 + t * t * 46
      ctx.beginPath()
      ctx.moveTo(bx - 13, by)
      ctx.lineTo(bx + 13, by)
      ctx.lineTo(bx, by + 30)
      ctx.closePath()
      ctx.fillStyle = colors[i % colors.length]
      ctx.fill()
    }
  } else if (style === 'anniversary') {
    frame(ctx, 24, pal.frame, 3)
    frame(ctx, 36, pal.frame, 1)
    heart(ctx, W / 2 - 130, 66, 2.2, pal.accent)
    heart(ctx, W / 2 + 130, 66, 2.2, pal.accent)
  } else if (style === 'wedding') {
    frame(ctx, 26, pal.frame, 2.5)
    sprig(ctx, 90, 120, -0.5, 120, pal.accent)
    sprig(ctx, W - 90, 120, 0.5, 120, pal.accent)
    sprig(ctx, 90, H - 120, Math.PI + 0.5, 120, pal.accent)
    sprig(ctx, W - 90, H - 120, Math.PI - 0.5, 120, pal.accent)
  } else if (style === 'floral') {
    frame(ctx, 26, pal.frame, 2)
    const petals = ['#e3b8b2', '#d9a0a8', '#c98a95']
    for (let c = 0; c < 4; c++) {
      const cx = c % 2 === 0 ? 96 : W - 96
      const cy = c < 2 ? 96 : H - 96
      for (let i = 0; i < 3; i++) {
        blossom(
          ctx,
          cx + (rand() - 0.5) * 90,
          cy + (rand() - 0.5) * 90,
          22 + rand() * 16,
          petals[Math.floor(rand() * petals.length)],
          '#a06a35'
        )
      }
    }
  } else if (style === 'luxury') {
    frame(ctx, 22, pal.frame, 3)
    frame(ctx, 32, pal.frame, 1)
    ctx.fillStyle = pal.accent
    ctx.fillRect(W / 2 - 60, 116, 120, 2)
    ctx.fillRect(W / 2 - 60, H - 118, 120, 2)
  }
}

function wrapLines(ctx, text, maxWidth) {
  const out = []
  for (const raw of String(text).split('\n')) {
    const words = raw.split(/\s+/).filter(Boolean)
    let line = ''
    for (const word of words) {
      const attempt = line ? line + ' ' + word : word
      if (ctx.measureText(attempt).width > maxWidth && line) {
        out.push(line)
        line = word
      } else {
        line = attempt
      }
    }
    if (line) out.push(line)
    if (!words.length) out.push('')
  }
  return out
}

export async function drawLabel(canvas, config) {
  await ensureFonts()
  const ctx = canvas.getContext('2d')
  const style = config.label
  const pal = PALETTES[style] || PALETTES.minimal
  const fragrance = getFragrance(config.fragrance)
  const fragranceName =
    config.fragrance === 'custom' && config.customFragrance ? config.customFragrance : fragrance.name

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = pal.bg
  ctx.fillRect(0, 0, W, H)

  drawDecor(ctx, style, pal)

  // Brand
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = pal.ink
  ctx.font = '500 50px "Cormorant Garamond", serif'
  ctx.fillText('SHREE AURA CANDLE', W / 2, style === 'birthday' ? 186 : 176)

  // Fragrance
  ctx.font = '400 30px "Jost", sans-serif'
  ctx.fillStyle = pal.accent
  const fr = fragranceName.toUpperCase()
  ctx.fillText('— ' + fr + ' —', W / 2, style === 'birthday' ? 232 : 224)

  // Personal message
  const message = (config.text || '').trim()
  if (message) {
    const font = getTextFont(config.textFont)
    const basePx = (TEXT_SIZES.find((s) => s.id === config.textSize) || TEXT_SIZES[1]).px
    const maxWidth = W - 190
    let px = basePx
    let lines = []
    for (let attempt = 0; attempt < 8; attempt++) {
      ctx.font = '500 ' + px + 'px ' + font.family
      lines = wrapLines(ctx, message, maxWidth)
      const blockH = lines.length * px * 1.22
      if (lines.length <= 3 && blockH <= 250) break
      px -= 7
    }
    let color = config.textColor || '#3d2b1f'
    if (style === 'luxury' && color.toLowerCase() === '#3d2b1f') color = '#d9b877'
    ctx.fillStyle = color
    ctx.font = '500 ' + px + 'px ' + font.family
    ctx.textAlign = config.textAlign || 'center'
    const tx = config.textAlign === 'left' ? 96 : config.textAlign === 'right' ? W - 96 : W / 2
    const blockH = lines.length * px * 1.22
    let ty = 330 + (250 - blockH) / 2 + px * 0.8
    for (const line of lines) {
      ctx.fillText(line, tx, ty)
      ty += px * 1.22
    }
    ctx.textAlign = 'center'
  }

  // Footer
  ctx.font = '400 22px "Jost", sans-serif'
  ctx.fillStyle = pal.ink
  ctx.globalAlpha = 0.72
  ctx.fillText('HAND-POURED · SMALL BATCH · SOY WAX', W / 2, H - 52)
  ctx.globalAlpha = 1
}
