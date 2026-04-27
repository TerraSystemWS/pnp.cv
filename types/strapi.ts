export interface StrapiData<T> {
  id: number
  attributes: T
}

export interface StrapiResponse<T> {
  data: StrapiData<T> | null
  meta?: StrapiMeta
}

export interface StrapiListResponse<T> {
  data: StrapiData<T>[]
  meta: StrapiMeta
}

export interface StrapiMeta {
  pagination?: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
}

export interface NavbarItem {
  title: string
  url: string
}

export interface NavbarMenu {
  items: {
    data: StrapiData<NavbarItem>[]
  }
}

export interface RedesSocial {
  nome: string
  link: string
  icone?: { data: StrapiData<{ url: string }> | null }
}

export interface Contato {
  email?: string
  telefone?: string
  endereco?: string
}

export interface Categoria {
  titulo: string
  descricao?: string
}

export interface Edicao {
  N_Edicao: number
  titulo?: string
  descricao?: string
  categoria: Categoria[]
  juri?: Juri[]
  inscricoes?: { data: StrapiData<Inscricao>[] }
}

export interface Juri {
  nome: string
  foto?: { data: StrapiData<Ficheiro> | null }
  bio?: string
}

export interface Ficheiro {
  url: string
  hash: string
  ext: string
  mime: string
  name: string
  formats?: {
    small?: { url: string }
    medium?: { url: string }
    thumbnail?: { url: string }
  }
}

export interface FileLink {
  id: number
  titulo: string
  publico: boolean
  ficheiro: { data: StrapiData<Ficheiro> | null }
}

export interface Inscricao {
  nome_completo: string
  email: string
  sede?: string
  NIF?: number
  telefone?: number
  nome_projeto?: string
  categoria?: string
  con_criativo?: string
  coord_prod?: string
  dir_foto?: string
  dir_art?: string
  realizador?: string
  editor?: string
  autor_jingle?: string
  designer?: string
  outras_consideracoes?: string
  data_producao?: string
  data_divulgacao?: string
  data_apresentacao_publica?: string
  fileLink?: FileLink[]
}

export interface Avaliacao {
  notas?: string
  comentario?: string
  user_id: { data: StrapiData<{ id: number }> | null }
  inscricoe: { data: StrapiData<{ id: number }> | null }
}

export interface ParsedNavLink {
  name: string
  link: string
}
