import { useEffect, useState } from 'react'
import Card from '@leafygreen-ui/card'
import Badge from '@leafygreen-ui/badge'
import Button from '@leafygreen-ui/button'
import Toggle from '@leafygreen-ui/toggle'
import { Tabs, Tab } from '@leafygreen-ui/tabs'
import { Body, Subtitle } from '@leafygreen-ui/typography'
import { spacing } from '@leafygreen-ui/tokens'
import { palette } from '@leafygreen-ui/palette'
import { PageHeader, DataTable, EmptyState, Loading } from '../components/ui'
import { API } from '../api/client'

const SEV = { crit: palette.red.base, warn: palette.yellow.dark2, info: palette.blue.base }

export default function Alerts({ toast, refreshCounts }) {
  const [data, setData] = useState(null)
  const [tab, setTab] = useState(0)
  const reload = () => API.alerts().then(setData).then(() => refreshCounts?.())
  useEffect(() => { reload() }, [])
  if (!data) return <Loading />

  const resolve = async (id) => {
    try { await API.resolveAlert(id); toast('Alerta resolvido', 'Movido para fechados.', 'success'); reload() }
    catch (e) { toast('Erro', String(e), 'warning') }
  }
  const delCfg = async (i) => {
    try { await API.deleteAlertConfig(i); toast('Config deletada', '', 'warning'); reload() }
    catch (e) { toast('Erro', String(e), 'warning') }
  }

  const cfgCols = [
    { header: 'Condition', render: (r) => <b>{r.cond}</b> },
    { header: 'Target', key: 'target' },
    { header: 'Threshold', key: 'thresh' },
    { header: 'Notify', key: 'notify' },
    { header: 'Status', render: (r) => <Toggle size="small" checked={r.on} onChange={() => toast('Alerta', r.cond, 'note')} aria-label="toggle" /> },
    { header: 'Actions', render: (r, i) => <Button size="xsmall" variant="dangerOutline" onClick={() => delCfg(i)}>Delete</Button> },
  ]

  return (
    <div>
      <PageHeader title="Alerts" subtitle={`${data.open.length} open alert${data.open.length !== 1 ? 's' : ''} · Project: Production`} />
      <Tabs selected={tab} setSelected={setTab} aria-label="Alerts">
        <Tab name={`Open Alerts (${data.open.length})`}>
          <div style={{ paddingTop: spacing[400] }}>
            {data.open.length === 0 ? (
              <Card><EmptyState title="Tudo sob controle ✨">Nenhum alerta aberto. Todos os clusters estão saudáveis.</EmptyState></Card>
            ) : data.open.map((a) => (
              <Card key={a.id} style={{ marginBottom: spacing[300], borderLeft: `4px solid ${SEV[a.sev]}`, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 22 }}>{a.sev === 'crit' ? '🔴' : a.sev === 'warn' ? '🟡' : '🔵'}</div>
                <div style={{ flex: 1 }}>
                  <Subtitle style={{ fontSize: 14 }}>{a.title}</Subtitle>
                  <Body style={{ fontSize: 13, color: palette.gray.base }}>{a.target} · {a.detail}</Body>
                </div>
                <Body style={{ fontSize: 12, color: palette.gray.base }}>{a.time}</Body>
                <Button size="small" onClick={() => toast('Reconhecido', 'Notificações pausadas por 1h.', 'note')}>Acknowledge</Button>
                <Button size="small" variant="primary" onClick={() => resolve(a.id)}>Resolve</Button>
              </Card>
            ))}
          </div>
        </Tab>
        <Tab name={`Closed (${data.closed_count})`}>
          <div style={{ paddingTop: spacing[400] }}>
            <Card><Body style={{ color: palette.gray.base }}>{data.closed_count} alertas resolvidos historicamente.</Body></Card>
          </div>
        </Tab>
        <Tab name={`Alert Settings (${data.configs.length})`}>
          <div style={{ paddingTop: spacing[400] }}>
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <DataTable columns={cfgCols} rows={data.configs} />
            </Card>
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}
