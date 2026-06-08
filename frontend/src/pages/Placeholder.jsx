import Banner from '@leafygreen-ui/banner'
import { PageHeader } from '../components/ui'

export default function Placeholder({ title }) {
  return (
    <div>
      <PageHeader title={title} subtitle="Em construção nesta migração para LeafyGreen" />
      <Banner variant="info">🚧 Esta seção será portada para React + LeafyGreen na próxima fase.</Banner>
    </div>
  )
}
