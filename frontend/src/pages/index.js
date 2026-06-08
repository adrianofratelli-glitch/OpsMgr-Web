import Dashboard from './Dashboard'
import Placeholder from './Placeholder'
import { ALL_SECTIONS } from '../lib/sections'

// Páginas já portadas
const READY = {
  dashboard: Dashboard,
}

// Demais seções caem no Placeholder (serão portadas nas próximas fases)
export const PAGES = Object.fromEntries(
  ALL_SECTIONS.map((s) => {
    const Comp = READY[s.id]
    if (Comp) return [s.id, Comp]
    const P = (props) => Placeholder({ ...props, title: s.label })
    return [s.id, P]
  }),
)
