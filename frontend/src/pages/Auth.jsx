import { useEffect, useState } from 'react'
import Card from '@leafygreen-ui/card'
import Badge from '@leafygreen-ui/badge'
import Button from '@leafygreen-ui/button'
import Toggle from '@leafygreen-ui/toggle'
import { Subtitle, Body, Description } from '@leafygreen-ui/typography'
import { spacing } from '@leafygreen-ui/tokens'
import { palette } from '@leafygreen-ui/palette'
import { PageHeader, Grid, DataTable, Loading } from '../components/ui'
import { API } from '../api/client'

function AuthRow({ title, desc, checked, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${palette.gray.light2}` }}>
      <div>
        <Body weight="medium">{title}</Body>
        <Description>{desc}</Description>
      </div>
      <Toggle size="small" checked={checked} onChange={onChange} aria-label={title} />
    </div>
  )
}

export default function Auth({ toast }) {
  const [ips, setIps] = useState(null)
  const [mech, setMech] = useState({ scram256: true, scram1: false, x509: true, ldap: false, kerberos: false, tls: true, rest: true, kmip: false, csfle: false })
  const reload = () => API.ips().then(setIps)
  useEffect(() => { reload() }, [])
  if (!ips) return <Loading />

  const flip = (k, name) => { setMech((m) => ({ ...m, [k]: !m[k] })); toast(name, mech[k] ? 'Desabilitado' : 'Habilitado', mech[k] ? 'warning' : 'success') }
  const delIp = async (i) => { try { await API.deleteIp(i); toast('IP removido', '', 'warning'); reload() } catch (e) { toast('Erro', String(e), 'warning') } }

  const ipCols = [
    { header: 'IP / CIDR', render: (r) => <code>{r.ip}</code> },
    { header: 'Comment', key: 'comment' },
    { header: 'Added', key: 'added' },
    { header: 'Actions', render: (r, i) => <Button size="xsmall" variant="dangerOutline" onClick={() => delIp(i)}>Remove</Button> },
  ]

  return (
    <div>
      <PageHeader title="Authentication & Encryption" subtitle="Cluster-wide security mechanisms" />
      <Grid cols={2} gap={spacing[400]} style={{ marginBottom: spacing[600] }}>
        <Card>
          <Subtitle style={{ marginBottom: spacing[200] }}>🔐 Authentication Mechanisms</Subtitle>
          <AuthRow title="SCRAM-SHA-256" desc="Default password authentication" checked={mech.scram256} onChange={() => flip('scram256', 'SCRAM-SHA-256')} />
          <AuthRow title="SCRAM-SHA-1" desc="Legacy password authentication" checked={mech.scram1} onChange={() => flip('scram1', 'SCRAM-SHA-1')} />
          <AuthRow title="x.509 Certificates" desc="Client certificate authentication" checked={mech.x509} onChange={() => flip('x509', 'x.509')} />
          <AuthRow title="LDAP" desc="External directory authentication" checked={mech.ldap} onChange={() => flip('ldap', 'LDAP')} />
          <AuthRow title="Kerberos (GSSAPI)" desc="Enterprise SSO authentication" checked={mech.kerberos} onChange={() => flip('kerberos', 'Kerberos')} />
        </Card>
        <Card>
          <Subtitle style={{ marginBottom: spacing[200] }}>🔒 Encryption</Subtitle>
          <AuthRow title="TLS/SSL (in-transit)" desc="Encrypt client & intra-cluster traffic" checked={mech.tls} onChange={() => flip('tls', 'TLS')} />
          <AuthRow title="Encryption at Rest" desc="WiredTiger AES-256" checked={mech.rest} onChange={() => flip('rest', 'Encryption at Rest')} />
          <AuthRow title="KMIP Key Management" desc="External key management server" checked={mech.kmip} onChange={() => flip('kmip', 'KMIP')} />
          <AuthRow title="Client-Side Field Level Encryption" desc="Encrypt specific fields" checked={mech.csfle} onChange={() => flip('csfle', 'CSFLE')} />
          <div style={{ marginTop: spacing[300] }}>
            <Button onClick={() => toast('Certificados rotacionados', 'Novos certs TLS ativos em todos os nós.', 'success')}>🔄 Rotate TLS Certificates</Button>
          </div>
        </Card>
      </Grid>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: spacing[400], borderBottom: `1px solid #e8edeb` }}><Subtitle>🌐 IP Access List</Subtitle></div>
        <DataTable columns={ipCols} rows={ips} />
      </Card>
    </div>
  )
}
