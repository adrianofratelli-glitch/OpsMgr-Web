import { SideNav, SideNavItem, SideNavGroup } from '@leafygreen-ui/side-nav'
import Icon from '@leafygreen-ui/icon'
import Badge from '@leafygreen-ui/badge'
import { SECTIONS } from '../lib/sections'

export default function Sidebar({ active, onNavigate, counts = {} }) {
  return (
    <SideNav aria-label="Ops Manager navigation" widthOverride={232}>
      {SECTIONS.map((group) => (
        <SideNavGroup key={group.group} header={group.group}>
          {group.items.map((item) => {
            const badge = counts[item.id]
            return (
              <SideNavItem
                key={item.id}
                active={active === item.id}
                onClick={() => onNavigate(item.id)}
                glyph={<Icon glyph={item.glyph} />}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  {item.label}
                  {badge ? (
                    <Badge variant={item.id === 'alerts' ? 'red' : 'yellow'} style={{ marginLeft: 8 }}>
                      {badge}
                    </Badge>
                  ) : null}
                </span>
              </SideNavItem>
            )
          })}
        </SideNavGroup>
      ))}
    </SideNav>
  )
}
