import { useState } from 'react'
import Modal from '@leafygreen-ui/modal'
import Button from '@leafygreen-ui/button'
import { Tabs, Tab } from '@leafygreen-ui/tabs'
import { Select, Option } from '@leafygreen-ui/select'
import { H3, Body, Label } from '@leafygreen-ui/typography'
import { spacing } from '@leafygreen-ui/tokens'
import { CodeBox } from '../components/ui'

export default function ConnectModal({ open, cluster, onClose, toast }) {
  const [tab, setTab] = useState(0)
  const [driver, setDriver] = useState('node')
  if (!cluster) return null

  const srv = `mongodb+srv://<user>:<password>@${cluster.name}.mongodb-brazil.internal/?retryWrites=true&w=majority&tls=true`
  const mongosh = `mongosh "mongodb+srv://${cluster.name}.mongodb-brazil.internal/" --username <user> --tls`
  const uri = `mongodb+srv://<user>:<password>@${cluster.name}.mongodb-brazil.internal/`
  const snippets = {
    node: `const { MongoClient } = require('mongodb');\nconst client = new MongoClient("${uri}");\nawait client.connect();`,
    python: `from pymongo import MongoClient\nclient = MongoClient("${uri}")`,
    java: `MongoClient client = MongoClients.create(\n  "${uri}");`,
    csharp: `var client = new MongoClient(\n  "${uri}");`,
    go: `client, _ := mongo.Connect(ctx,\n  options.Client().ApplyURI("${uri}"))`,
  }
  const copy = (text) => {
    navigator.clipboard?.writeText(text)
    toast('Copiado!', 'Connection string copiada.', 'success')
  }

  return (
    <Modal open={open} setOpen={onClose} size="default">
      <H3 style={{ marginBottom: spacing[300] }}>Connect to {cluster.name}</H3>
      <Tabs selected={tab} setSelected={setTab} aria-label="Connect options">
        <Tab name="Connection String">
          <div style={{ paddingTop: spacing[300] }}>
            <Label htmlFor="uri">Standard Connection String (SRV)</Label>
            <CodeBox onCopy={() => copy(srv)}>{srv}</CodeBox>
            <Body style={{ marginTop: 8, color: '#888', fontSize: 12 }}>TLS é obrigatório. Use em qualquer driver MongoDB.</Body>
          </div>
        </Tab>
        <Tab name="mongosh">
          <div style={{ paddingTop: spacing[300] }}>
            <CodeBox onCopy={() => copy(mongosh)}>{mongosh}</CodeBox>
            <Body style={{ marginTop: 8, color: '#888', fontSize: 12 }}>Requer o mongosh instalado.</Body>
          </div>
        </Tab>
        <Tab name="Drivers">
          <div style={{ paddingTop: spacing[300] }}>
            <Select label="Driver" value={driver} onChange={setDriver} allowDeselect={false} style={{ marginBottom: spacing[300] }}>
              <Option value="node">Node.js</Option>
              <Option value="python">Python (PyMongo)</Option>
              <Option value="java">Java</Option>
              <Option value="csharp">C#</Option>
              <Option value="go">Go</Option>
            </Select>
            <CodeBox onCopy={() => copy(snippets[driver])}>{snippets[driver]}</CodeBox>
          </div>
        </Tab>
      </Tabs>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: spacing[500] }}>
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  )
}
