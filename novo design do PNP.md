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

*Próximas alterações serão registadas abaixo desta linha.*
