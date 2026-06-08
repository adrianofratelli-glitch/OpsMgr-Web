import { useState } from 'react'
import Modal from '@leafygreen-ui/modal'
import Button from '@leafygreen-ui/button'
import TextInput from '@leafygreen-ui/text-input'
import { Select, Option } from '@leafygreen-ui/select'
import { H3, Body } from '@leafygreen-ui/typography'
import { spacing } from '@leafygreen-ui/tokens'
import { API } from '../api/client'

export default function NewDeploymentModal({ open, onClose, toast, onCreated }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('Replica Set')
  const [version, setVersion] = useState('7.0.5')
  const [members, setMembers] = useState('3')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    if (!name.trim()) { toast('Validação', 'Nome do cluster é obrigatório.', 'warning'); return }
    setBusy(true)
    try {
      await API.createCluster({ name: name.trim(), type, version, members: parseInt(members) })
      toast(`${name} provisionado!`, `${type} criado com sucesso.`, 'success')
      onClose(); onCreated?.(); setName('')
    } catch (e) {
      toast('Erro', e?.response?.data?.detail || 'Falha ao provisionar.', 'warning')
    } finally { setBusy(false) }
  }

  return (
    <Modal open={open} setOpen={onClose} size="small">
      <H3 style={{ marginBottom: spacing[300] }}>New Deployment</H3>
      <Body style={{ marginBottom: spacing[400], color: '#888' }}>O Ops Manager orquestra os agents e a configuração automaticamente.</Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[300] }}>
        <Select label="Deployment Type" value={type} onChange={setType} allowDeselect={false}>
          <Option value="Replica Set">Replica Set</Option>
          <Option value="Sharded Cluster">Sharded Cluster</Option>
          <Option value="Standalone">Standalone</Option>
        </Select>
        <TextInput label="Cluster Name" placeholder="ex: rs-prod-02" value={name} onChange={(e) => setName(e.target.value)} />
        <Select label="MongoDB Version" value={version} onChange={setVersion} allowDeselect={false}>
          <Option value="7.0.5">7.0.5</Option>
          <Option value="6.0.12">6.0.12</Option>
          <Option value="5.0.24">5.0.24</Option>
        </Select>
        {type !== 'Standalone' && (
          <Select label="Number of Members" value={members} onChange={setMembers} allowDeselect={false}>
            <Option value="3">3 (Recommended)</Option>
            <Option value="5">5</Option>
            <Option value="7">7</Option>
          </Select>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: spacing[500] }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={submit} disabled={busy} isLoading={busy}>Deploy</Button>
      </div>
    </Modal>
  )
}
