// Logo: > lex|lab_ — chevron + Spectral italic + Space Grotesk bold + blinking cursor
// Animation runs via @keyframes lexlab-blink defined in globals.css

const BLUE = '#3B7BFF'
const INK = '#0A0E14'

interface Props {
  size?: 'sm' | 'lg'
  animate?: boolean
}

export default function LexLabLogo({ size = 'sm', animate = true }: Props) {
  const sm = size === 'sm'

  const fontSize = sm ? 17 : 22
  const chevW = sm ? 9 : 12
  const chevH = sm ? 13 : 17
  const gap = sm ? 5 : 7
  const cursorW = sm ? 2 : 2.5
  const cursorH = sm ? 10 : 13
  const cursorML = sm ? 3 : 4
  const cursorY = sm ? 4 : 5

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap, lineHeight: 1 }}>
      <svg
        width={chevW}
        height={chevH}
        viewBox="0 0 40 60"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <polyline
          points="8,12 28,30 8,48"
          fill="none"
          stroke={INK}
          strokeWidth={sm ? 5.5 : 5}
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>

      <span style={{ display: 'inline-flex', alignItems: 'baseline', fontSize, letterSpacing: '-0.02em' }}>
        <span style={{
          fontFamily: 'var(--font-spectral), Georgia, serif',
          fontStyle: 'italic',
          fontWeight: 300,
          color: INK,
        }}>
          lex
        </span>
        <span style={{
          fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
          fontWeight: 700,
          color: BLUE,
          letterSpacing: '-0.04em',
          marginLeft: 2,
        }}>
          lab
        </span>
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: cursorW,
            height: cursorH,
            background: BLUE,
            marginLeft: cursorML,
            alignSelf: 'center',
            transform: `translateY(-${cursorY}px)`,
            animation: animate ? 'lexlab-blink 1.05s steps(2) infinite' : 'none',
          }}
        />
      </span>
    </span>
  )
}
