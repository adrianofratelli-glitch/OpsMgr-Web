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
