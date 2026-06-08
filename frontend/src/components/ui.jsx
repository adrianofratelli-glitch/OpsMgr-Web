import { H2, H3, Body, Subtitle, Description } from '@leafygreen-ui/typography'
import Card from '@leafygreen-ui/card'
import { palette } from '@leafygreen-ui/palette'
import { spacing } from '@leafygreen-ui/tokens'
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider'
import MongoLeaf from './MongoLeaf'

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: spacing[600] }}>
      <div>
        <H2>{title}</H2>
        {subtitle && <Body style={{ color: palette.gray.base, marginTop: 2 }}>{subtitle}</Body>}
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>{actions}</div>
    </div>
  )
}

export function StatCard({ label, value, sub, color }) {
  const { darkMode } = useDarkMode()
  return (
    <Card style={{ padding: spacing[400] }}>
      <Description style={{ textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600 }}>
        {label}
      </Description>
      <div style={{ fontSize: 30, fontWeight: 700, marginTop: 6, color: color || (darkMode ? palette.white : palette.black) }}>
        {value}
      </div>
      {sub && <div style={{ marginTop: 6 }}>{sub}</div>}
    </Card>
  )
}

export function Grid({ cols = 4, gap = spacing[400], children, style }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap, ...style }}>
      {children}
    </div>
  )
}

export function EmptyState({ title, children }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 20px' }}>
      <div style={{ width: 56, height: 56, margin: '0 auto 14px', opacity: 0.5 }}>
        <MongoLeaf size={56} />
      </div>
      <H3>{title}</H3>
      <Body style={{ color: palette.gray.base, maxWidth: 380, margin: '6px auto 0' }}>{children}</Body>
    </div>
  )
}

export function Loading({ label = 'Carregando…' }) {
  return (
    <div style={{ padding: 48, textAlign: 'center', color: palette.gray.base }}>
      <Body>{label}</Body>
    </div>
  )
}

// Tabela estilizada com tokens LeafyGreen (render garantido, visual on-brand)
export function DataTable({ columns, rows, empty }) {
  const { darkMode } = useDarkMode()
  const border = darkMode ? palette.gray.dark2 : palette.gray.light2
  const headBg = darkMode ? palette.gray.dark3 : palette.gray.light3
  const headColor = darkMode ? palette.gray.light1 : palette.gray.dark1
  const cellColor = darkMode ? palette.gray.light2 : palette.black

  if (!rows || rows.length === 0) {
    return empty || <Body style={{ padding: 24, color: palette.gray.base, textAlign: 'center' }}>Nenhum registro.</Body>
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i} style={{ textAlign: 'left', padding: '9px 14px', background: headBg, color: headColor,
                fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em',
                borderBottom: `2px solid ${border}`, whiteSpace: 'nowrap', ...(c.width ? { width: c.width } : {}) }}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {columns.map((c, ci) => (
                <td key={ci} style={{ padding: '10px 14px', borderBottom: `1px solid ${border}`, color: cellColor, verticalAlign: 'middle' }}>
                  {c.render ? c.render(row, ri) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Linha de definição (label: valor) usada em rodapés de card
export function MetaRow({ items }) {
  return (
    <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 12, color: palette.gray.base }}>
      {items.map((it, i) => (
        <span key={i}>{it.label}: <b style={{ color: palette.gray.dark1 }}>{it.value}</b></span>
      ))}
    </div>
  )
}

// Code box (connection strings, snippets)
export function CodeBox({ children, onCopy }) {
  return (
    <div style={{ background: palette.black, color: palette.green.light1, padding: '14px 16px', borderRadius: 6,
      fontFamily: 'monospace', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 12, wordBreak: 'break-all' }}>
      <code style={{ flex: 1, lineHeight: 1.5 }}>{children}</code>
      {onCopy && (
        <button onClick={onCopy} style={{ background: 'rgba(255,255,255,.12)', color: '#fff', border: 'none',
          borderRadius: 4, padding: '5px 10px', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>📋 Copy</button>
      )}
    </div>
  )
}
