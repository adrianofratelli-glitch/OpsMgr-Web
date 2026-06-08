import { useEffect, useState } from 'react'
import Card from '@leafygreen-ui/card'
import Badge from '@leafygreen-ui/badge'
import Button from '@leafygreen-ui/button'
import Icon from '@leafygreen-ui/icon'
import Modal from '@leafygreen-ui/modal'
import TextInput from '@leafygreen-ui/text-input'
import { H3, Subtitle } from '@leafygreen-ui/typography'
import { spacing } from '@leafygreen-ui/tokens'
import { PageHeader, DataTable, Loading } from '../components/ui'
import { API } from '../api/client'

const BUILTIN = ['read', 'readWrite', 'dbAdmin', 'dbOwner', 'userAdmin', 'clusterAdmin', 'clusterManager', 'clusterMonitor', 'hostManager', 'root', 'backup', 'restore', 'readAnyDatabase', 'readWriteAnyDatabase', 'userAdminAnyDatabase', 'dbAdminAnyDatabase']

export default function Roles({ toast }) {
  const [roles, setRoles] = useState(null)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const reload = () => API.roles().then(setRoles)
  useEffect(() => { reload() }, [])
  if (!roles) return <Loading />

  const add = async () => {
    if (!name.trim()) { toast('Validação', 'Nome obrigatório.', 'warning'); return }
    try { await API.addRole({ name: name.trim(), priv: 'find', inherits: 'read' }); toast('Role criada', name, 'success'); setOpen(false); setName(''); reload() }
    catch (e) { toast('Erro', String(e), 'warning') }
  }
  const del = async (i) => {
    try { await API.deleteRole(i); toast('Role deletada', '', 'warning'); reload() }
    catch (e) { toast('Erro', String(e), 'warning') }
  }

  const cols = [
    { header: 'Role Name', render: (r) => <b>{r.name}</b> },
    { header: 'Privileges', render: (r) => <span style={{ fontSize: 12, color: '#888' }}>{r.priv}</span> },
    { header: 'Inherits', render: (r) => r.inherits === '(none)' ? '—' : <Badge variant="blue">{r.inherits}</Badge> },
    { header: 'Users', render: (r) => `${r.users} user${r.users !== 1 ? 's' : ''}` },
    { header: 'Actions', render: (r, i) => <Button size="xsmall" variant="dangerOutline" onClick={() => del(i)}>Delete</Button> },
  ]

  return (
    <div>
      <PageHeader title="Custom Roles" subtitle="Role-based access control (RBAC)"
        actions={[<Button key="a" variant="primary" leftGlyph={<Icon glyph="Plus" />} onClick={() => setOpen(true)}>Add Custom Role</Button>]} />
      <Card style={{ padding: 0, overflow: 'hidden', marginBottom: spacing[600] }}><DataTable columns={cols} rows={roles} /></Card>
      <Card>
        <Subtitle style={{ marginBottom: spacing[300] }}>Built-in Roles</Subtitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {BUILTIN.map((b) => <Badge key={b} variant={b.includes('Any') || b === 'root' ? 'red' : b.includes('cluster') || b.includes('host') ? 'yellow' : 'blue'}>{b}</Badge>)}
        </div>
      </Card>

      <Modal open={open} setOpen={setOpen} size="small">
        <H3 style={{ marginBottom: spacing[400] }}>Add Custom Role</H3>
        <TextInput label="Role Name" placeholder="ex: analyticsReadOnly" value={name} onChange={(e) => setName(e.target.value)} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: spacing[500] }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={add}>Create Role</Button>
        </div>
      </Modal>
    </div>
  )
}
