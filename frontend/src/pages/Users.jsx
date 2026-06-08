import { useEffect, useState } from 'react'
import Card from '@leafygreen-ui/card'
import Badge from '@leafygreen-ui/badge'
import Button from '@leafygreen-ui/button'
import Icon from '@leafygreen-ui/icon'
import Modal from '@leafygreen-ui/modal'
import TextInput from '@leafygreen-ui/text-input'
import { Select, Option } from '@leafygreen-ui/select'
import { H3 } from '@leafygreen-ui/typography'
import { spacing } from '@leafygreen-ui/tokens'
import { PageHeader, DataTable, Loading } from '../components/ui'
import { API } from '../api/client'

export default function Users({ toast }) {
  const [users, setUsers] = useState(null)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [auth, setAuth] = useState('SCRAM-SHA-256')
  const [role, setRole] = useState('read@analytics')
  const reload = () => API.users().then(setUsers)
  useEffect(() => { reload() }, [])
  if (!users) return <Loading />

  const add = async () => {
    if (!name.trim()) { toast('Validação', 'Username obrigatório.', 'warning'); return }
    try { await API.addUser({ name: name.trim(), auth, role }); toast('Usuário criado', name, 'success'); setOpen(false); setName(''); reload() }
    catch (e) { toast('Erro', String(e), 'warning') }
  }
  const del = async (n) => {
    try { await API.deleteUser(n); toast('Usuário removido', n, 'warning'); reload() }
    catch (e) { toast('Erro', String(e), 'warning') }
  }

  const cols = [
    { header: 'Username', render: (r) => <b>{r.name}</b> },
    { header: 'Auth', render: (r) => <Badge variant="lightgray">{r.auth}</Badge> },
    { header: 'Roles', render: (r) => r.roles.map((x, i) => <Badge key={i} variant="blue" style={{ marginRight: 4 }}>{x}</Badge>) },
    { header: 'Database', render: (r) => <code>{r.db}</code> },
    { header: 'Created', key: 'created' },
    { header: 'Status', render: (r) => r.status === 'active' ? <Badge variant="green">● Active</Badge> : <Badge variant="lightgray">○ Disabled</Badge> },
    { header: 'Actions', render: (r) => (
      <div style={{ display: 'flex', gap: 6 }}>
        <Button size="xsmall" onClick={() => toast('Reset senha', `Nova senha gerada para ${r.name}`, 'success')}>Reset Pw</Button>
        <Button size="xsmall" variant="dangerOutline" onClick={() => del(r.name)}>Delete</Button>
      </div>
    ) },
  ]

  return (
    <div>
      <PageHeader title="Database Users" subtitle="Manage authentication & access"
        actions={[<Button key="a" variant="primary" leftGlyph={<Icon glyph="Plus" />} onClick={() => setOpen(true)}>Add Database User</Button>]} />
      <Card style={{ padding: 0, overflow: 'hidden' }}><DataTable columns={cols} rows={users} /></Card>

      <Modal open={open} setOpen={setOpen} size="small">
        <H3 style={{ marginBottom: spacing[400] }}>Add Database User</H3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[300] }}>
          <TextInput label="Username" placeholder="ex: app_service" value={name} onChange={(e) => setName(e.target.value)} />
          <Select label="Authentication" value={auth} onChange={setAuth} allowDeselect={false}>
            <Option value="SCRAM-SHA-256">SCRAM-SHA-256</Option>
            <Option value="x.509">x.509 Certificate</Option>
            <Option value="LDAP">LDAP</Option>
          </Select>
          <Select label="Role" value={role} onChange={setRole} allowDeselect={false}>
            <Option value="readWrite@app_db">readWrite@app_db</Option>
            <Option value="read@analytics">read@analytics</Option>
            <Option value="dbAdmin@admin">dbAdmin@admin</Option>
            <Option value="backup@admin">backup@admin</Option>
          </Select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: spacing[500] }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={add}>Create User</Button>
        </div>
      </Modal>
    </div>
  )
}
