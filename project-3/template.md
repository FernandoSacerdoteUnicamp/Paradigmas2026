# DSL para Criação de Histórias em Quadrinhos — Entrega Final

---

## 1. Descrição da DSL

### Descrição

Uma Linguagem de Domínio Específico (DSL) implementada em **Guile Scheme** para a criação automatizada de histórias em quadrinhos. A DSL permite descrever cenas, personagens, diálogos e efeitos de forma declarativa e compositiva, gerando páginas HTML/CSS interativas.

### Contextualização da Linguagem

Histórias em quadrinhos são atualmente criadas por meio de:
- Roteiristas usando linguagem natural para descrever cenas
- Artistas desenhando manualmente cada painel
- Coloristas adicionando cores e efeitos

O processo é manual, demorado e não automatizado, o que dificulta:
- Prototipagem rápida de narrativas
- Adaptações dinâmicas de histórias
- Integração com outras tecnologias

### Motivação

Uma forma de representar elementos narrativos e visuais em formato de dados estruturado que permitam:
- Automação do layout e composição
- Reutilização de componentes (personagens, cenários, efeitos)
- Integração com outras ferramentas de storytelling

### Relevância

A partir dessa linguagem seria possível fazer a criação de layouts de quadrinhos de maneira automatizada, integração com outras tecnologias assim como possivel narrativa
interativa.

---

## 2. Apresentação Final

[Link para os slides da Terceira Etapa.](https://docs.google.com/presentation/d/1kbPGbtBABzpirL5dj_FRSljxTU0NNPodzirWapZi84Q/edit?usp=sharing)

---

## 3. Guia de Sintaxe da Linguagem

A DSL utiliza funções **Scheme para composição**, onde cada elemento é uma função que gera HTML:

### Estrutura Básica

```scheme
(cena "Nome da Cena" "Local"
  (quadro 1 "Layout"
    (cenario "nome_do_cenario")
    (personagem "Nome" "posicao" "emocao")
    (fala "Nome" "acao" "texto do diálogo")
    (efeito "nome_do_efeito")
    (recordatorio "texto da legenda")))
```

### Funções Disponíveis

| Função | Parâmetros | Descrição | Exemplo |
|--------|-----------|-----------|---------|
| `cena` | (nome local . bodies) | Define uma cena com título e local | `(cena "O Despertar" "Floresta")` |
| `quadro` | (número layout . bodies) | Define um painel/quadro | `(quadro 1 "Topo_Largo")` |
| `cenario` | (nome) | Define fundo do quadro | `(cenario "floresta")` |
| `personagem` | (nome posição emoção) | Adiciona personagem | `(personagem "João" "esquerda" "em_guarda")` |
| `fala` | (nome ação texto) | Adiciona diálogo/pensamento | `(fala "João" "pensa" "Sinto uma presença...")` |
| `efeito` | (nome) | Adiciona efeito visual/sonoro | `(efeito "CRACK!")` |
| `recordatorio` | (texto) | Adiciona legenda/narração | `(recordatorio "O silêncio da floresta...")` |

### Parâmetros Especiais

**Posições de personagem:**
- `"esquerda"` — canto esquerdo inferior
- `"direita"` — canto direito inferior
- `"centro"` — centro inferior

**Ações de fala:**
- `"diz"` — diálogo normal
- `"grita"` — grito/exclamação
- `"pensa"` — pensamento interno
- `"sussurra"` — sussurro/voz baixa

---

## 4. Gramática da Linguagem

```
PROGRAMA → DEFINIÇÕES
DEFINIÇÕES → (define IDENT CENA)

CENA → (cena STRING STRING QUADROS)

QUADROS → QUADRO QUADROS
QUADROS → QUADRO

QUADRO → (quadro NÚMERO STRING ELEMENTOS)

ELEMENTOS → ELEMENTO ELEMENTOS
ELEMENTOS → ε  ; zero ou mais

ELEMENTO → (cenario STRING)
ELEMENTO → (personagem STRING STRING STRING)
ELEMENTO → (fala STRING STRING STRING)
ELEMENTO → (efeito STRING)
ELEMENTO → (recordatorio STRING)

STRING → "texto entre aspas"
NÚMERO → 1 | 2 | 3 | ... | n
IDENT → identificador válido em Scheme (letterings, números, hífens)
```

### Notas Gramaticais

- Composição via aplicação de funções (function application)
- Cada função retorna uma string HTML
- Ordem dos elementos é significativa (z-index no CSS)

---

## 5. Implementação

A implementação é feita em **Guile Scheme** no notebook `src/interpretador_scheme.ipynb`.

### Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│  CÓDIGO SCHEME (DSL)                                        │
│  (cena "..." "..."                                          │
│    (quadro ... (personagem ...) (fala ...) ...))           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  FUNÇÕES SCHEME (Composição)                                │
│  - Cada função retorna string HTML                          │
│  - Nested function calls → nested HTML                      │
│  - Normalização de nomes para asset paths                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  HTML + CSS                                                 │
│  <div class="scene">                                        │
│    <div class="panel">                                      │
│      <div class="background" style="...">                   │
│      <div class="character" style="...">                    │
│      <div class="speech">...                                │
│    </div>                                                   │
│  </div>                                                     │
└─────────────────────────────────────────────────────────────┘
```

### Componentes Principais

1. **Normalização** — `normalize`, `ensure-string`, `char-safe`
   - Converte símbolos e strings para nomes de arquivo válidos
   - Remove acentos, converte para lowercase, substitui espaços por `_`

2. **Resolução de Assets** — `bg-path`, `char-path`, `effect-path`
   - Mapeia nomes descritivos para paths de arquivo
   - Exemplo: `(cenario "floresta")` → `assets/backgrounds/floresta.png`

3. **Mapeamento Posicional** — `map-position`
   - Converte `"esquerda"`, `"direita"`, `"centro"` para CSS válido
   - Usa `position: absolute` e transforms para posicionamento

4. **Funções de Composição HTML** — `cena`, `quadro`, `cenario`, `personagem`, `fala`, `efeito`, `recordatorio`
   - Cada uma recebe parâmetros e retorna string HTML
   - Suportam `variadic arguments` (`. bodies`) para composição aninhada

5. **CSS Base** — Estilos para rendering visual
   - Painel com `position: relative; overflow: hidden`
   - Elementos posicionados com `z-index` para sobreposição

### 6. Macros e Simplificação de Código

**O que são Macros?**

Macros em Scheme são transformações de código em tempo de compilação usando `define-syntax` e `syntax-rules`. Elas permitem **reduzir repetição** e criar abstrações sintáticas personalizadas.

**Por que usar macros?**

- Redução de repetição de código: cenas que exigem 7 linhas ficam com 1
- Garantia estrutural: a macro força a estrutura correta, evitando erros
- Legibilidade aumentada: código declarativo em vez de aninhado
- Reutilização: padrões comuns encapsulados em uma única expressão

**Comparação: Sem Macro vs Com Macro**

Sem macro (7 linhas, verboso):
```scheme
(cena "O Despertar" "Floresta"
  (quadro 1 "Normal"
    (cenario "floresta")
    (personagem "João" "esquerda" "medo")
    (fala "João" "diz" "Algo está acontecendo...")
    (efeito "CRACK")
    (recordatorio "A floresta despertou.")))
```

Com macro (1 linha, conciso):
```scheme
(cena-dramatica "O Despertar" "Floresta" "floresta"
  "João" "esquerda" "medo" "diz"
  "Algo está acontecendo..."
  "CRACK"
  "A floresta despertou.")
```

**Macros Implementadas**

| Macro | Propósito | Redução |
|-------|-----------|---------|
| `cena-simples` | Cena com 1 personagem + 1 fala | 7 → 1 linha |
| `cena-dialogo` | 2 personagens em diálogo | 8 → 1 linha |
| `cena-dramatica` | 1 personagem + efeito + narração | 9 → 1 linha |
| `cena-dialogo-completa` | 2 personagens + diálogo + narração | 9 → 1 linha |

**Exemplo 1: `cena-dramatica`**

Define uma cena dramática com personagem, ação, efeito e narração em uma única chamada:

```scheme
(define-syntax cena-dramatica
  (syntax-rules ()
    ((cena-dramatica nome local cenario personagem posicao emocao acao fala nome-efeito naracao)
     (cena nome local
       (quadro 1 "Normal"
         (cenario cenario)
         (personagem personagem posicao emocao)
         (fala personagem acao fala)
         (efeito nome-efeito)
         (recordatorio naracao))))))
```

Uso:
```scheme
(define exemplo1-macro
  (cena-dramatica "O Despertar do Poder" "Floresta Proibida"
                  "floresta"
                  "Joao" "esquerda" "em_guarda"
                  "pensa"
                  "Eu sinto uma presença... ela está perto."
                  "CRACK"
                  "O silêncio da floresta é interrompido."))
```

**Exemplo 2: `cena-dialogo-completa`**

Combina dois personagens, seus diálogos e uma narração em uma expressão:

```scheme
(define-syntax cena-dialogo-completa
  (syntax-rules ()
    ((cena-dialogo-completa nome local cenario (p1 pos1 em1 fala1) (p2 pos2 em2 fala2) naracao)
     (cena nome local
       (quadro 1 "Normal"
         (cenario cenario)
         (personagem p1 pos1 em1)
         (personagem p2 pos2 em2)
         (fala p1 "diz" fala1)
         (fala p2 "diz" fala2)
         (recordatorio naracao))))))
```

Uso:
```scheme
(define exemplo2-macro
  (cena-dialogo-completa "Reencontro" "Cafeteria da Cidade" "cafeteria"
    ("Joao" "esquerda" "em_guarda" "Quanto tempo, Maria!")
    ("Maria" "direita" "feliz" "Que coincidência te encontrar por aqui!")
    "Um reencontro inesperado na cafeteria."))
```

---

## 6. Exemplos Selecionados

### Exemplo 1: Cena Simples — "O Despertar do Poder"

```scheme
(cena "O Despertar do Poder" "Floresta Proibida"
  (quadro 1 "Topo_Largo"
    (cenario "floresta")
    (personagem "Joao" "esquerda" "em_guarda")
    (fala "Joao" "pensa" "Eu sinto uma presença... ela está perto.")
    (efeito "CRACK!")
    (recordatorio "O silêncio da floresta é interrompido.")))
```

**Output esperado:**
- Fundo: imagem de floresta
- Personagem João à esquerda com emoção "em_guarda"
- Balão de pensamento com o texto
- Efeito visual "CRACK!" no canto superior direito
- Legenda na base do painel

### Exemplo 2: Múltiplos Personagens — "Reencontro"

```scheme
(cena "Reencontro" "Cafeteria da Cidade"
  (quadro 1 "Normal"
    (cenario "cafe_noturno")
    (personagem "Joao" "esquerda" "surpreso")
    (personagem "Maria" "direita" "feliz")
    (fala "Joao" "grita" "Maria?! Você está viva!")
    (fala "Maria" "diz" "Claro que estou, seu tonto!")
    (efeito "BOOM")
    (recordatorio "Um reencontro inesperado após anos.")))
```

**Output esperado:**
- Fundo: cafeteria noturna
- João à esquerda com emoção "surpreso"
- Maria à direita com emoção "feliz"
- Dois balões de fala (um grito, um diálogo normal)
- Efeito "BOOM" no canto
- Legenda descritiva

**Ambos os exemplos estão implementados e funcionando no notebook `src/interpretador_scheme.ipynb`.**

---

## 7. Discussão

### O que Funcionou

1. **Modelo de composição Scheme**
   - Usar funções como blocos de construção
   - Geração de HTML a partir de Scheme foi simples e confiável

2. **Normalização de nomes**
   - Sistema de path resolution automatizado funcionou bem
   - Permite artistas usarem nomes descritivos em qualquer linguagem

3. **Posicionamento CSS**
   - `position: relative` + `position: absolute` permitiu camadas (z-index)
   - Responsivo o suficiente para exemplos básicos

4. **Foco em paradigma funcional**
   - Demonstrou bem o uso de **composição** em linguagem funcional
   - Cada função é **pura** (sem side effects até a renderização final)

### O que Não Funcionou (Desafios)

1. **Falta de parser de texto DSL**
   - Implementação atual é Scheme puro (funções), não parse de sintaxe textual
   - Usuários escrevem código Scheme, não linguagem textual descritiva
   - O `code.txt` mostra sintaxe desejada, mas não é interpretada

2. **Ausência de imagens/assets**
   - Sem arquivos de imagem, exemplos não ficam visuais completos
   - Poderia usar placeholders ou SVGs para demo

3. **Posicionamento flexível limitado**
   - Apenas 3 posições pré-definidas ("esquerda", "direita", "centro")
   - Sem suporte para posicionamento absoluto customizado

4. **Sem validação de entrada**
   - Erros de digitação em parâmetros não são validados
   - Sem mensagens de erro informativas

### Comparação com Trabalhos Relacionados

| Aspecto | Nossa DSL | Ink | Fountain |
|---------|-----------|-----|----------|
| Linguagem | Scheme | Própria (texto) | Markdown |
| Foco | Quadrinhos visuais | Narrativa interativa | Roteiro de cinema |
| Composição | Funcional | Sequencial | Descritiva |
| Geração | HTML/CSS | Engine próprio | PDF/Web |
| Simplicidade | Alta | Alta | Muito alta |

---

## 8. Conclusão

A implementação da DSL demonstrou que a composição funcional é efetiva para descrever narrativas visuais. Scheme foi uma escolha acertada por:

- Permitir código limpo e expressivo via funções
- Macros potencial (não implementadas nesta versão)
- Fácil geração de strings (HTML)
- Paradigma puramente funcional

---

## 9. Trabalhos Futuros

1. **Parser de texto completo**
   - Implementar parser que lê sintaxe descritiva (como em `code.txt`)
   - Converter para AST e depois para funções Scheme
   - Isso fecharia o gap entre design e implementação

   O arquivo `parser_text2schemelike.js` é uma tentativa de protótipo

2. **Suporte a múltiplas cenas/histórias**
   - Sistema de capítulos
   - Navegação entre cenas
   - Persistência em banco de dados

3. **Sistema de posicionamento + dinâmico**
   - Layout engine mais flexível
   - Suporte a breakpoints (responsividade)
   - Animações CSS

4. **Integração com game engines**
   - Exportar para formatos de engines

---

## 10. Referências Bibliográficas

### Linguagens e Trabalhos Relacionados

- **Ink** — https://www.inklescript.com/  

- **Fountain** — https://fountain.io/  

- **Renpy** — https://www.renpy.org/  

- **Comic Draw** — Software de desenho de quadrinhos com layout inteligente.

### Linguagens de Programação

- **Guile Scheme** — https://www.gnu.org/software/guile/  

- **HTML5 + CSS3** — https://developer.mozilla.org/  

---

## Apêndice: Como Rodar o Projeto

### Pré-requisitos

- Guile Scheme 3.0+ instalado (`sudo apt install guile-3.0` no Linux)
- Jupyter Notebook com suporte a Guile Kernel (opcional)

### Executar o Notebook

```bash
# Abrir Jupyter com Guile
jupyter notebook src/interpretador_scheme.ipynb

# Ou executar diretamente
guile < src/interpretador_scheme.scm > output.html
```

### Visualizar Resultado

```bash
# Abrir output.html no navegador
open output.html  # macOS
xdg-open output.html  # Linux
start output.html  # Windows
```

---
