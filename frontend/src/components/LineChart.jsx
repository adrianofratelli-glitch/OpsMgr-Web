import { useState, useRef } from 'react'
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider'
import { palette } from '@leafygreen-ui/palette'

const COLORS = [palette.green.base, palette.yellow.dark2, palette.blue.base, palette.purple.base, palette.red.base]

const fmt = (v) => (Math.abs(v) >= 1000 ? Math.round(v).toLocaleString() : (Number.isInteger(v) ? v : v.toFixed(1)))

// Gráfico de linhas em SVG com tooltip no hover (linha-guia + valores por série)
export default function LineChart({ series, height = 180, yMax }) {
  const { darkMode } = useDarkMode()
  const grid = darkMode ? palette.gray.dark2 : palette.gray.light2
  const axis = darkMode ? palette.gray.base : palette.gray.dark1
  const W = 600, H = height, padL = 34, padB = 22, padT = 10, padR = 10

  const wrapRef = useRef(null)
  const [hover, setHover] = useState(null) // { idx, px, py }

  const allVals = series.flatMap((s) => s.data)
  const max = yMax || Math.max(1, ...allVals) * 1.1
  const n = series[0]?.data.length || 1
  const x = (i) => padL + (i / (n - 1)) * (W - padL - padR)
  const y = (v) => padT + (1 - v / max) * (H - padT - padB)

  const onMove = (e) => {
    const rect = wrapRef.current.getBoundingClientRect()
    const ratioX = (e.clientX - rect.left) / rect.width
    const svgX = ratioX * W
    let i = Math.round(((svgX - padL) / (W - padL - padR)) * (n - 1))
    i = Math.max(0, Math.min(n - 1, i))
    setHover({ idx: i, px: e.clientX - rect.left, py: e.clientY - rect.top })
  }

  const tooltipLeft = hover ? (hover.px > (wrapRef.current?.clientWidth || 600) - 150 ? hover.px - 150 : hover.px + 14) : 0

  return (
    <div ref={wrapRef} style={{ position: 'relative' }} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height, display: 'block' }}>
        {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
          const yy = padT + f * (H - padT - padB)
          return (
            <g key={i}>
              <line x1={padL} y1={yy} x2={W - padR} y2={yy} stroke={grid} strokeWidth="1" />
              <text x={padL - 6} y={yy + 3} fontSize="9" fill={axis} textAnchor="end">{Math.round(max * (1 - f))}</text>
            </g>
          )
        })}
        {series.map((s, si) => {
          const c = s.color || COLORS[si % COLORS.length]
          const d = s.data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
          return (
            <g key={si}>
              {s.fill && <path d={`${d} L ${x(n - 1)} ${H - padB} L ${x(0)} ${H - padB} Z`} fill={c} opacity="0.08" />}
              <path d={d} fill="none" stroke={c} strokeWidth="1.8" />
            </g>
          )
        })}
        {/* legenda */}
        {series.map((s, si) => (
          <g key={`l${si}`} transform={`translate(${padL + si * 110}, ${padT})`}>
            <rect width="10" height="10" rx="2" fill={s.color || COLORS[si % COLORS.length]} />
            <text x="14" y="9" fontSize="10" fill={axis}>{s.label}</text>
          </g>
        ))}
        {/* hover: linha-guia + pontos */}
        {hover && (
          <g>
            <line x1={x(hover.idx)} y1={padT} x2={x(hover.idx)} y2={H - padB} stroke={axis} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            {series.map((s, si) => (
              <circle key={si} cx={x(hover.idx)} cy={y(s.data[hover.idx])} r="3.5" fill={s.color || COLORS[si % COLORS.length]} stroke={darkMode ? palette.black : palette.white} strokeWidth="1.5" />
            ))}
          </g>
        )}
      </svg>

      {hover && (
        <div style={{
          position: 'absolute', left: tooltipLeft, top: Math.max(4, hover.py - 10), pointerEvents: 'none',
          background: darkMode ? palette.gray.dark3 : palette.black, color: '#fff', borderRadius: 6,
          padding: '8px 10px', fontSize: 12, minWidth: 130, boxShadow: '0 4px 14px rgba(0,0,0,.35)', zIndex: 10,
        }}>
          <div style={{ color: palette.gray.light1, fontSize: 10, marginBottom: 4 }}>Ponto {hover.idx + 1}/{n}</div>
          {series.map((s, si) => (
            <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '1px 0' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color || COLORS[si % COLORS.length], flexShrink: 0 }} />
              <span style={{ flex: 1, color: palette.gray.light1 }}>{s.label}</span>
              <b>{fmt(s.data[hover.idx])}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
