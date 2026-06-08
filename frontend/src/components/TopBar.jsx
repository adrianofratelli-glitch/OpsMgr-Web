import Button from '@leafygreen-ui/button'
import IconButton from '@leafygreen-ui/icon-button'
import Icon from '@leafygreen-ui/icon'
import Toggle from '@leafygreen-ui/toggle'
import { palette } from '@leafygreen-ui/palette'
import MongoLeaf from './MongoLeaf'

export default function TopBar({ org, project, darkMode, onToggleDark, onNewDeployment, onBell }) {
  return (
    <header
      style={{
        height: 56,
        background: palette.black,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 16,
        flexShrink: 0,
        boxShadow: '0 2px 6px rgba(0,0,0,.3)',
        zIndex: 5,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: '#fff' }}>
        <MongoLeaf size={26} />
        <span style={{ fontSize: 15, letterSpacing: '-0.01em' }}>
          <b style={{ fontWeight: 800 }}>MongoDB</b> Ops Manager
        </span>
      </div>

      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 7, marginLeft: 14,
          color: palette.gray.light1, fontSize: 13,
        }}
      >
        <Icon glyph="Building" fill={palette.gray.light1} size={14} />
        Org:&nbsp;<span style={{ color: '#fff', fontWeight: 500 }}>{org || '—'}</span>
      </div>

      <div style={{ flex: 1 }} />

      <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: palette.gray.light1, fontSize: 12 }}>
        <Icon glyph="Sun" fill={palette.gray.light1} size={14} />
        <Toggle
          size="small"
          checked={darkMode}
          onChange={onToggleDark}
          aria-label="Alternar tema"
          darkMode
        />
        <Icon glyph="Moon" fill={palette.gray.light1} size={14} />
      </span>

      <Button variant="primary" size="small" leftGlyph={<Icon glyph="Plus" />} onClick={onNewDeployment}>
        New Deployment
      </Button>

      <IconButton aria-label="Alertas" darkMode onClick={onBell}>
        <Icon glyph="Bell" fill="#fff" />
      </IconButton>

      <div
        style={{
          width: 32, height: 32, borderRadius: '50%', background: palette.green.dark2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 13,
        }}
      >
        A
      </div>
    </header>
  )
}
