import { useDarkMode } from '@leafygreen-ui/leafygreen-provider'
import { palette } from '@leafygreen-ui/palette'

const COLORS = [palette.green.base, palette.yellow.dark2, palette.blue.base, palette.purple.base, palette.red.base]

// Gráfico de linhas em SVG (leve, sem dependência externa, render garantido)
export default function LineChart({ series, height = 180, yMax }) {
  const { darkMode } = useDarkMode()
  const grid = darkMode ? palette.gray.dark2 : palette.gray.light2
  const axis = darkMode ? palette.gray.base : palette.gray.dark1
  const W = 600, H = height, padL = 34, padB = 22, padT = 10, padR = 10

  const allVals = series.flatMap((s) => s.data)
  const max = yMax || Math.max(1, ...allVals) * 1.1
  const n = series[0]?.data.length || 1
  const x = (i) => padL + (i / (n - 1)) * (W - padL - padR)
  const y = (v) => padT + (1 - v / max) * (H - padT - padB)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height }}>
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
    </svg>
  )
}
