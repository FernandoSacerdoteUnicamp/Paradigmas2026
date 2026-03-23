# DSL `DSL Criação de Quadrinhos`

## Descrição Resumida da DSL

### Contextualização da linguagem:

DSL usada para criação de historia em quadrinhos de maneira automatizada.

### Motivação:

Elementos visuais e narrativos são ótimos para ser descritos em linguagem natural mas não para linguagem de máquina.

### Relevância:

A partir dessa linguagem seria possível fazer a criação de layouts de quadrinhos de maneira automatizada, integração com outras tecnologias assim como possivel narrativa
nterativa.

## Slides

> [link para o PDF da apresentação.](https://docs.google.com/presentation/d/1vxBakMYeWVePtD7YE5kNZg7C7IWeQy7AnbGvJanInRA/edit?usp=sharing)

## Sintaxe da Linguagem na Forma de Tutorial

O projeto idealiza uma linguagem minimalista e legível para humanos voltada à criação de quadrinhos. Através de uma estrutura organizada em blocos de configuração, definição de assets e fluxo de cenas, a linguagem permite traduzir roteiros literários diretamente em estruturas de dados visuais, suportando estados emocionais, tipos de balões e efeitos sonoros nativamente.

Configuração da página: 
```
# OBRIGATORIO: CENA com parametro "Local"
CENA "nome da cena" (Local: "nome_do_local"):

  # OBRIGATORIO: QUADRO com parametro "Layout" 
  QUADRO numero (Layout: "nome_do_layout"):

    # OBRIGATORIO: CENARIO
    CENARIO: "nome_do_cenario"
  
    # OPCIONAL: RECORDATORIO
    RECORDATORIO: "texto do recordatorio."
  
    #  OPCIONAL: linha com nome do personagem especificando sua "Posicao" e "Sentimento"
    NOME_DO_PERSONAGEM (Posicao: "posição", Sentimento: "sentimento")
  
    #  OPCIONAL: linha com nome de personagem especificando sua "açao". Ação pode ser "diz", "grita", "pensa" ou "sussurra" sem aspas.
    NOME_DO_PERSONAGEM acao: "dialogo"
      
    # OPCIONAL: Efeito
    EFEITO: "nome do efeito"

# palavras-chave da linguagem: CENA, Local, QUADRO, Layout, CENARIO, RECORDATORIO, Posicao, Sentimento, diz, grita, pensa, sussurra e EFEITO

ASSETS:
  # O source aponta para a pasta; o interpretador buscará o PNG lá dentro
  PERSONAGEM Joao (Source: "assets/characters/joao/", Formato: ".png")
  PERSONAGEM Maria (Source: "assets/characters/maria/", Formato: ".png")
  CENARIO Quarto (Source: "assets/backgrounds/quarto_noite.jpg")

```  

## Gramática da Linguagem

```
S → ROTEIRO

ROTEIRO → CENA ROTEIRO
ROTEIRO → CENA

CENA → "CENA" STRING PARAMS_CENA ":" QUADROS

PARAMS_CENA → "(" "Local" ":" STRING ")"

QUADROS → QUADRO QUADROS
QUADROS → QUADRO

QUADRO → "QUADRO" NUMERO PARAMS_QUADRO ":" CENARIO ELEMENTOS

PARAMS_QUADRO → "(" "Layout" ":" STRING ")"

CENARIO → "CENARIO" ":" STRING

ELEMENTOS → ELEMENTO ELEMENTOS
ELEMENTOS → ε   // 0 ou mais elementos

ELEMENTO → RECORDATORIO
ELEMENTO → ENTRADA
ELEMENTO → FALA
ELEMENTO → EFEITO

RECORDATORIO → "RECORDATORIO" ":" STRING

ENTRADA → IDENT PARAMS_ENTRADA

PARAMS_ENTRADA → "(" PARAM_LISTA ")"

PARAM_LISTA → PARAM_ENTRADA "," PARAM_LISTA
PARAM_LISTA → PARAM_ENTRADA

PARAM_ENTRADA → "Posicao" ":" STRING
PARAM_ENTRADA → "Sentimento" ":" STRING

FALA → IDENT ACAO ":" STRING

ACAO → "diz"
ACAO → "grita"
ACAO → "pensa"
ACAO → "sussurra"

EFEITO → "EFEITO" ":" STRING
```

### Parser equivalente
```
grammar QuadrinhosDSL;

// =====================
// PARSER
// =====================

roteiro
    : cena+ EOF
    ;

cena
    : 'CENA' STRING parametrosCena ':' NEWLINE quadro+
    ;

quadro
    : 'QUADRO' NUMBER parametrosQuadro ':' NEWLINE
      cenario
      elementos
    ;

// obrigatório
cenario
    : 'CENARIO' ':' STRING NEWLINE
    ;

// 0 ou mais elementos
elementos
    : elemento*
    ;

elemento
    : recordatorio
    | entrada
    | fala
    | efeito
    ;

// =====================
// ELEMENTOS
// =====================

recordatorio
    : 'RECORDATORIO' ':' STRING NEWLINE
    ;

entrada
    : IDENTIFIER parametrosEntrada NEWLINE
    ;

fala
    : IDENTIFIER acao ':' STRING NEWLINE
    ;

efeito
    : 'EFEITO' ':' STRING NEWLINE
    ;

// =====================
// AÇÕES
// =====================

acao
    : 'diz'
    | 'grita'
    | 'pensa'
    | 'sussurra'
    ;

// =====================
// PARÂMETROS (FORÇADOS)
// =====================

parametrosCena
    : '(' 'Local' ':' STRING ')'
    ;

parametrosQuadro
    : '(' 'Layout' ':' STRING ')'
    ;

parametrosEntrada
    : '(' parametroEntrada (',' parametroEntrada)* ')'
    ;

parametroEntrada
    : 'Posicao' ':' STRING
    | 'Sentimento' ':' STRING
    ;

// =====================
// LEXER
// =====================

STRING
    : '"' (~["\\] | '\\' .)* '"'
    ;

NUMBER
    : [0-9]+
    ;

IDENTIFIER
    : [a-zA-Z_][a-zA-Z0-9_]*
    ;

COMMENT
    : '#' ~[\r\n]* -> skip
    ;

NEWLINE
    : '\r'? '\n'
    ;

WS
    : [ \t]+ -> skip
    ;
```



## Exemplos Selecionados

Exemplo 1:
```
CENA "O Despertar do Poder" (Local: "Floresta Proibida"):

  QUADRO 1 (Layout: "Topo_Largo"):
    CENARIO: "Floresta"
    
    # O interpretador busca em: assets/characters/joao/em_guarda.png
    Joao (Posicao: "Esquerda", Sentimento: "Em guarda")
    
    Joao pensa: "Eu sinto uma presença... ela está perto."
    EFEITO: "CRACK!"
    RECORDATORIO: "O silêncio da floresta é interrompido."
```
A evoulução de linha a linha está descrita no [PDF da apresentação.](https://docs.google.com/presentation/d/1vxBakMYeWVePtD7YE5kNZg7C7IWeQy7AnbGvJanInRA/edit?usp=sharing)

# Referências Bibliográficas

