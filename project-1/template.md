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
CONFIG:
  PAGINA: A4 (Orientacao: Vertical)
  ESTILO: Anime (Cor: FullColor)
  FONTE: "ComicSans-Bold"
```
Declaração dos personagens:
```
ASSETS:
  # O source aponta para a pasta; o interpretador buscará o PNG lá dentro
  PERSONAGEM Joao (Source: "assets/characters/joao/", Formato: ".png")
  PERSONAGEM Maria (Source: "assets/characters/maria/", Formato: ".png")
  
  CENARIO Quarto (Source: "assets/backgrounds/quarto_noite.jpg")
```
Construção da história:
```
CENA "O Despertar do Poder" (Local: "Floresta Proibida"):

  QUADRO 1 (Layout: Topo_Largo, Proporcao: 16/9):
    CENARIO: Floresta (Tempo: Crepusculo, Filtro: "Neblina")
    
    # O interpretador busca em: assets/characters/joao/serio.png
    ENTRA: Joao (Posicao: Esquerda, Sentimento: "Serio", Pose: "Guarda_Alta")
    Joao pensa: "Eu sinto uma presença... ela está perto."
    
    EFEITO: "CRACK!" (Origem: "Arvores", Estilo: "Quebra")

  QUADRO 2 (Layout: Centro_Esquerda, Tamanho: 1/2):
    ENTRA: Maria (Posicao: Direita, Sentimento: "Furtiva")
    
    RECORDATORIO: "Das sombras, uma aliada inesperada surge."
    
    Maria diz: "Você demora muito para perceber o óbvio, João." (Tipo: Sussurro)
    MUDAR_ESTADO: Joao (Sentimento: "Surpreso")

  QUADRO 3 (Layout: Centro_Direita, Tamanho: 1/2):
    EFEITO: "BOOM!" (Tipo: Explosao, Intensidade: Máxima)
    
    MUDAR_ESTADO: Maria (Sentimento: "Pronta_Para_Combate")
    Maria grita: "AGORA!" 

    # Foco narrativo no narrador
    RECORDATORIO: "A batalha pela nota final havia começado."
```  

## Gramática da Linguagem

```
S -> DefinirFolha | DefinirQuadro | DefinirImagem | Variavel | #.

DefinirFolha -> Define Folha Exp Exp.

DefinirQuadro -> Define Quadro palavra Exp Exp Exp Exp.

DefinirImagem -> Define Imagem palavra palavra.


Variavel -> Var Atr.

Atr -> palavra = Exp | palavra , Atr , Exp.

Exp -> numero | Exp Operador Exp | palavra.

Operador -> + | - | * | :.
Define -> define.

Var -> var.

Quadro -> quadro.

Imagem -> imagem.

Folha -> folha.
```


## Exemplos Selecionados

Exemplo 1: Aqui adicionatemos 2 quadros numa folha e uma imagem ao primeiro quadro.
```
var a, b, c, d = 0, 0, 10, 10
Define quadro a b c d
Define folha 50 100 
Define quadro q1 a b c d
Define quadro q2 c-a d-b 20 20
Define imagem x caminho_arquivo
Inserir imagem x in Quadro q1
```
A evoulução de linha a linha está descrita no [PDF da apresentação.](https://docs.google.com/presentation/d/1vxBakMYeWVePtD7YE5kNZg7C7IWeQy7AnbGvJanInRA/edit?usp=sharing)

# Referências Bibliográficas

