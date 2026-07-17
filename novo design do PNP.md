# Novo Design do PNP — Relatório de Alterações UI

> Registo cronológico de todas as alterações de interface realizadas no projecto **Prémio Nacional de Publicidade (pnp.cv)**.  
> Fluxo: alteração → commit → push → entrada neste relatório.

---

## Identidade Visual Adoptada

| Token | Valor | Uso |
|---|---|---|
| `GOLD` | `#c2a12b` | Acentos, bordas, labels |
| `GOLD_BRIGHT` | `#f0d060` | Hover, texto em destaque |
| `DARK` | `#080604` | Fundo principal |
| `DARK_CARD` | `#100d07` | Cards, modais, painéis |
| `DARK_MID` | `#0d0a05` | Secções alternadas |
| Fonte display | Cormorant Garamond (300/400, italic) | Títulos, citações |
| Fonte UI | DM Sans (300/400/500) | Corpo, labels, botões |

---

## Alterações

---

### [1] Navbar — Round 2 · Redesign Completo com Inline Styles
**Commit:** `c56bfdd` · **Data:** 2026-04-29  
**Ficheiro:** `components/Navbar/index.tsx`

**O que mudou:**
- Substituição total de `styled-jsx` por inline styles para garantir renderização independente do PrimeReact/Tailwind
- Barra fixa com fundo `#0a0805dd`, linha dourada de 3px no topo (`inset 0 3px 0 #c2a12b`)
- Logo à esquerda, links de navegação ao centro/direita em DM Sans maiúsculas
- Hover dos links com sublinhado dourado via `<span>` inline (sem pseudo-elementos)
- Botão **Login** com gradiente dourado animado (`goldPulse` keyframe)
- Botão **Logout** transparente com borda dourada discreta
- Hamburger dourado (3 linhas) que anima para ✕ ao abrir
- Drawer mobile full-height com links em Cormorant Garamond 1.7rem
- Dialog de login PrimeReact forçado para tema escuro via `.pnp-login-dialog` + `!important`
- Campos de email/password com fundo `#c2a12b0d` e borda dourada

---

### [2] Footer — Round 2 · Redesign Completo com Inline Styles
**Commit:** `c56bfdd` · **Data:** 2026-04-29  
**Ficheiro:** `components/Footer/index.tsx`

**O que mudou:**
- Linha de acento dourado de 3px no topo do footer (gradiente transparente → gold → transparente)
- Fundo `#080604`, borda superior `#c2a12b18`
- Ornamento centrado: `✦ Prémio Nacional de Publicidade ✦`
- Grid 4 colunas responsivo (4 → 2 → 1): Logo+Contacto, Links Úteis, Navegação, Newsletter
- Títulos de secção em Cormorant Garamond, cor `#c2a12b`
- Links com hover `color: #f0d060` + `padding-left: 8px` via classe CSS
- Input newsletter escuro com foco dourado; botão com gradiente animado (`ftNlBtnShimmer`)
- Barra inferior `#0d0a05` com copyright e círculos de redes sociais (inicial da rede)

---

### [3] Página de Contactos — Redesign Completo
**Commit:** `0888676` · **Data:** 2026-04-29  
**Ficheiro:** `pages/contatos.tsx`

**O que mudou:**
- Removido `HeroSection` genérico; substituído por hero inline com grain texture e título shimmer
- Título "Contactos" em Cormorant Garamond com efeito gradiente dourado
- Layout dividido em duas colunas (mapa + info | formulário)
- Mapa com `filter: grayscale(30%) brightness(0.85)` e linha dourada de acento
- Cards de contacto individuais (Endereço, Email, Telefone) com borda `#c2a12b22`
- Formulário num card escuro com linha dourada no topo
- Campos com fundo `#c2a12b08`, borda `#c2a12b28`, foco com borda `#c2a12b88`
- Botão "Enviar Mensagem" com gradiente dourado + `goldPulse` animado
- Mensagem de estado: ouro no sucesso, vermelho no erro
- Nota de privacidade discreta em dourado 40% de opacidade

---

### [4] Layout — Ajuste de Margem Superior
**Commit:** `89f47b0` · **Data:** 2026-04-29  
**Ficheiro:** `components/Layout/index.tsx`

**O que mudou:**
- `marginTop` do conteúdo alterado de `5.88rem` para `69px`
- Elimina o espaço em branco visível entre a navbar fixa (68px) e o conteúdo da página
- Deixa apenas 1px de separação visual

---

### [5] Página Home (/) — Redesign Completo
**Commit:** `72b4633` · **Data:** 2026-04-29  
**Ficheiro:** `pages/index.tsx`

**O que mudou:**

#### §1 Hero Cinemático
- Full-viewport (`100vh`) com imagens do Strapi como background slideshow automático (5s, fade 1.2s)
- Overlay gradiente escuro + grain texture SVG
- Linha dourada de 2px no topo (sob a navbar)
- Título principal em Cormorant Garamond, `clamp(2.8rem, 9vw, 7rem)`, com `<em>` em `GOLD_BRIGHT`
- Badge de edição (ex: "7ª Edição") em pill dourado
- Dois CTAs: **Inscrever** (dourado sólido animado) + **Regulamentos** (outline)
- Dots de navegação entre slides; scroll hint animado (seta a bobinar)

#### §2 Manifesto / Sobre
- Grelha 2 colunas: citação editorial + texto + estatísticas
- Citação em Cormorant com borda esquerda dourada `2px solid #c2a12b`
- Estatísticas em números Cormorant grandes (Edições, Categorias, Jurados)
- Fundo `DARK_MID` alternado

#### §3 Categorias — Masonry Grid Escuro
- Grid `auto-fill minmax(220px, 1fr)` de cards quadrados com aspect-ratio 1:1
- Imagem de categoria como background (opacidade 35%), overlay escuro gradiente
- Número da categoria em Cormorant ghost (opacidade 25%) no canto superior direito
- Hover: overlay com descrição + "Saiba Mais" dourado + elevação `translateY(-4px)`
- Linha de acento dourada no topo de cada card (dourado pleno no hover)

#### §4 Prémio Público — Bloco Minimal
- Secção centrada em fundo `DARK_MID`
- Notice pill escuro com ícone ⏳ (sem o Alert azul do Flowbite)
- Botão CTA dourado

#### §5 Júri — Horizontal Scroll Strip
- Faixa de scroll horizontal com `scroll-snap-type: x mandatory`
- Cards de 240px com fotografia de retrato (objectFit: cover, objectPosition: top)
- Nome em Cormorant, cargo em DM Sans maiúsculas dourado
- Descrição truncada a 110 chars (strip HTML no cliente via `useEffect`)
- Hover: elevação + borda dourada + nome em `GOLD_BRIGHT`
- Scrollbar oculta (webkit + firefox)

#### §6 CTA / Inscrever — Secção Dramática
- Fundo `DARK_CARD` com grain texture + radial glow dourado central
- Título Cormorant `clamp(2.5rem, 7vw, 5rem)` com `<em>` italic em gold
- Dois botões: **Inscrever Agora** (dourado animado) + **Ver Regulamento** (outline)

---

---

### [6] Regulamentos — Redesign Completo
**Commit:** `68c2551` · **Data:** 2026-04-30  
**Ficheiro:** `pages/regulamentos.tsx`

**O que mudou:**
- Removido `HeroSection` genérico; substituído por hero inline com grain texture e título Cormorant
- Tabs "Regulamentos" | "Categorias" em barra sticky abaixo da navbar — borda dourada de 2px no tab activo
- Conteúdo markdown estilizado via `.reg-content` CSS: `h1/h2/h3` em Cormorant gold, `p/li` em DM Sans escuro, `strong` dourado
- Tab **Regulamentos**: texto com título em Cormorant + borda esquerda dourada, markdown renderizado abaixo
- Tab **Categorias**: grid `auto-fill minmax(380px, 1fr)` de cards escuros com linha dourada no topo, título Cormorant e descrição markdown

---

### [7] Edições — Redesign Completo
**Commit:** `68c2551` · **Data:** 2026-04-30  
**Ficheiro:** `pages/edicoes/index.tsx`

**O que mudou:**
- Removido `HeroSection` genérico; hero inline com edição em destaque italic gold
- **Selector de edições**: pills horizontais (uma por edição) com scroll — pill activo com fundo dourado sólido
- **Tab bar** sticky: Júri | Galeria | Vídeos | Documentos — borda dourada no tab activo
- **Júri**: scroll horizontal snap de cards de retrato (220px), hover com elevação e borda dourada
- **Galeria**: grid `auto-fill minmax(260px, 1fr)`, aspect-ratio 16/10, hover scale + borda + linha dourada; link "Ver galeria completa" se >9 imagens
- **Vídeos**: grid de cards escuros com título Cormorant + player nativo `<video>`
- **Documentos**: grid de cards escuros com ícone 📄, título Cormorant, link "Abrir documento"
- Componentes auxiliares `EmptyMsg` e `SectionHead` inline

---

### [8] Parceiros — Redesign Completo
**Commit:** `68c2551` · **Data:** 2026-04-30  
**Ficheiro:** `pages/parceiros.tsx`

**O que mudou:**
- Removido `HeroSection` e `PartnerCard` genéricos; redesenhados inline
- Hero com grain texture e subtítulo em DM Sans
- Cada grupo de parceiros separado por divider com título Cormorant centrado (linha — TÍTULO — linha)
- Cards de parceiro (200px): fundo `DARK_CARD`, linha dourada no topo no hover, logo com `filter brightness/saturate`, nome em DM Sans, badge de tier (Diamante/Ouro/Prata/Bronze) como pill com borda colorida
- Hover: elevação `translateY(-5px)` + `box-shadow` dourado + borda mais brilhante
- Cores de tier: Diamante `#a8d8ea`, Ouro `#c2a12b`, Prata `#b0bec5`, Bronze `#a0785a`

---

### [9] Blog / Posts — Redesign Completo
**Commit:** `68c2551` · **Data:** 2026-04-30  
**Ficheiro:** `pages/posts/index.tsx`

**O que mudou:**
- Removido `HeroSection` genérico e `StrapiImage`; hero inline
- Layout principal: grid `1fr 320px` — featured posts (2) à esquerda, sidebar (4) à direita
- **Featured posts**: cards horizontais escuros com imagem, data em uppercase dourado, título Cormorant com hover `GOLD_BRIGHT`, snippet HTML, link "Ler mais →"
- **Sidebar**: lista vertical com hover `padding-left` animado, título Cormorant, data discreta
- **Posts paginados**: grid `auto-fill minmax(280px, 1fr)` de cards com imagem topo, hover via `onMouseEnter/Leave` inline
- **Paginação**: botões circulares (36px), activo com fundo dourado sólido, hover com `${GOLD}15`

---

### [10] Sobre Nós — Redesign Completo
**Commit:** `68c2551` · **Data:** 2026-04-30  
**Ficheiro:** `pages/sobreus/index.tsx`

**O que mudou:**
- Hero inline com grain texture, título Cormorant e subtítulo DM Sans
- Conteúdo markdown estilizado via `.sob-content`: headings em Cormorant gold, parágrafos DM Sans escuro, blockquote com borda esquerda dourada
- Links rápidos no rodapé da secção: pills outline para "Termos de Serviço" e "Política de Privacidade" com hover via `onMouseEnter/Leave`

---

## Páginas por Redesenhar (análise do utilizador)

As seguintes páginas existem no projecto mas **não** foram alteradas nesta ronda de redesign:

| Página | Rota | Observações |
|---|---|---|
| Inscrição — Retomar/Nova | `/inscricao` | ✅ Já redesenhada (sessão anterior) |
| Inscrição — Detalhe | `/inscricao/[id]` | Página de detalhe da inscrição existente |
| Inscrição — Upload | `/inscricao/upload` | Upload de ficheiros para a inscrição |
| Júri — Detalhe | `/juris/[id]` | Perfil detalhado de um membro do júri |
| Projetos — Lista | `/projetos` | Listagem de projectos a votar (Prémio Público) |
| Projetos — Detalhe | `/projetos/[id]` | Detalhe de um projecto em competição |
| Galeria | `/galeria` | Galeria de imagens por edição |
| Blog — Post | `/posts/[slug]` | Artigo individual do blog |
| Perfil | `/perfil` | Área pessoal do utilizador autenticado |
| Perfil — Avaliação | `/perfil/avaliacao` | Formulário de avaliação (júri) |
| Perfil — Status Avaliação | `/perfil/avaliacaoStatus` | Estado das avaliações (júri) |
| Perfil — Status Votação | `/perfil/votacaopublicaStatus` | Estado da votação pública |
| Termos de Serviço | `/sobreus/terms` | Página de termos |
| Política de Privacidade | `/sobreus/policy` | Página de política |

*Próximas alterações serão registadas abaixo desta linha.*
