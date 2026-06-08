import Card from '@leafygreen-ui/card'
import Button from '@leafygreen-ui/button'
import TextInput from '@leafygreen-ui/text-input'
import { Select, Option } from '@leafygreen-ui/select'
import ConfirmationModal from '@leafygreen-ui/confirmation-modal'
import { useState } from 'react'
import { spacing } from '@leafygreen-ui/tokens'
import { PageHeader } from '../components/ui'
import { API } from '../api/client'

export default function Settings({ toast, navigate }) {
  const [confirmReset, setConfirmReset] = useState(false)

  const doReset = async () => {
    setConfirmReset(false)
    try { await API.reset(); toast('Demo restaurada', 'Estado inicial recarregado.', 'success'); navigate?.('dashboard') }
    catch (e) { toast('Erro', String(e), 'warning') }
  }

  return (
    <div>
      <PageHeader title="Project Settings" subtitle="Configurações gerais" />
      <Card style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[400] }}>
          <TextInput label="Project Name" value="Production" onChange={() => {}} />
          <TextInput label="Organization" value="MongoDB Brazil" disabled onChange={() => {}} />
          <Select label="Default MongoDB Version" value="7.0.5" onChange={() => {}} allowDeselect={false}>
            <Option value="7.0.5">7.0.5</Option>
            <Option value="6.0.12">6.0.12</Option>
            <Option value="5.0.24">5.0.24</Option>
          </Select>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="primary" onClick={() => toast('Settings salvas', 'Configurações atualizadas.', 'success')}>Save Changes</Button>
            <Button variant="dangerOutline" onClick={() => setConfirmReset(true)}>♻️ Reset Demo</Button>
          </div>
        </div>
      </Card>

      <ConfirmationModal open={confirmReset} title="Restaurar estado inicial?" buttonText="Reset" variant="danger"
        onConfirm={doReset} onCancel={() => setConfirmReset(false)}>
        Todos os clusters/snapshots/usuários criados durante a demo serão revertidos.
      </ConfirmationModal>
    </div>
  )
}
