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

A linguagem descreve a construção de uma pagina através de comandos que são adicionados um após o outro. É possivel definir variaveis simbolizando as dimensões de paginas e
quadrinhos, definindo dessa maneira a posição desses quadrinhos.

```
var x = 2480

var y = 3508

define folha x y

Quadros são definidos atraves da posição de seus quatro vértices:

define quadro 0 0 40 40
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

