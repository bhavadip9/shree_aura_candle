export default function BrandLogo({ size = 42, showBadge = false, badgeShape = 'rounded', className = '' }) {
  return (
    <div
      className={`sa-logo-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        viewBox="0 0 160 160"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="SA Candles Logo"
      >
        <defs>
          <linearGradient id="saLogoFlame" x1="0.1" y1="1" x2="0.6" y2="0">
            <stop offset="0%" stopColor="#E64A00" />
            <stop offset="40%" stopColor="#FF7700" />
            <stop offset="85%" stopColor="#FFAA00" />
            <stop offset="100%" stopColor="#FFD24D" />
          </linearGradient>
          <filter id="saFlameGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Optional background badge */}
        {showBadge && badgeShape === 'circle' && (
          <circle cx="80" cy="80" r="78" fill="#18181A" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        )}
        {showBadge && badgeShape === 'rounded' && (
          <rect x="2" y="2" width="156" height="156" rx="28" fill="#18181A" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        )}

        {/* Elegant Candle Flame perched on the top right apex of 'A' */}
        <g transform="translate(112, 57)">
          {/* Main Flame body */}
          <path
            d="M0,0 C5,-9 4,-20 -2,-28 C-3.5,-17 -10,-11 -10,-1 C-10,7 -2,11 4,10 C8,9.2 13,5 15,0 C10,1.5 3,5 0,0 Z"
            fill="url(#saLogoFlame)"
            filter="url(#saFlameGlow)"
          />
          {/* Inner golden flame heart */}
          <path
            d="M0,0 C2.5,-5 2,-12 -1,-17 C-2,-10 -5,-7 -5,0 C-5,4 -0.5,6.5 2.5,6 C5,5.5 8,3 9,0 C6,1 1.5,3 0,0 Z"
            fill="#FFF1A8"
            opacity="0.9"
          />
        </g>

        {/* Stylized 'S' and 'A' in crisp luxury serif typography */}
        <g fill="#FFFFFF" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>
          {/* 'S' */}
          <text
            x="36"
            y="96"
            fontSize="68"
            fontWeight="600"
            letterSpacing="-1.5px"
          >
            S
          </text>
          {/* 'A' */}
          <text
            x="79"
            y="96"
            fontSize="68"
            fontWeight="600"
            letterSpacing="-1px"
          >
            A
          </text>
        </g>

        {/* Tracked 'C A N D L E S' subtext */}
        <text
          x="80"
          y="118"
          fill="#A4A4AB"
          fontSize="14"
          fontWeight="500"
          fontFamily="'Jost', 'Montserrat', -apple-system, sans-serif"
          letterSpacing="0.34em"
          textAnchor="middle"
        >
          CANDLES
        </text>
      </svg>
    </div>
  )
}
