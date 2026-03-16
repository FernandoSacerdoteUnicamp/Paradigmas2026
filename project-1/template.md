# Template da Entrega Parcial

Segue abaixo o modelo de como deve ser apresentado e documentado o projeto. Há partes do modelo a seguir que têm uma marcação específica indicando que **não devem ser literalmente transcritas**:

Trecho entre `<...>` representa algo que deve ser substituído pelo indicado. Nesse caso, você não deve manter os símbolos `<...>`.
> Parágrafos que aparecem neste modo de citação representa algo que deve ser substituído pelo explicado.

No modelo a seguir são colocados exemplos ilustrativos, que serão substituídos pelos do seu projeto.

> # Modelo para Apresentação da Entrega Parcial do Projeto (Arquivo README.md)

# DSL `DSL Criação de Quadrinhos`

## Descrição Resumida da DSL

> Descrição resumida do tema do projeto. Sugestão de roteiro (cada item tipicamente tratado em uma ou poucas frases):
>
> Contextualização da linguagem:
>  DSL usada para criação de historia em quadrinhos de maneira automatizada.
> Motivação:
> Elementos visuais e narrativos são ótimos para ser descritos em linguagem natural mas não para linguagem de máquina.
> Relevância:
> A partir dessa linguagem seria possível fazer a criação de layouts de quadrinhos de maneira automatizada, integração com outras tecnologias assim como possivel narrativa
> interativa.

## Slides

> [link para o PDF da apresentação.](https://docs.google.com/presentation/d/1vxBakMYeWVePtD7YE5kNZg7C7IWeQy7AnbGvJanInRA/edit?usp=sharing)

## Sintaxe da Linguagem na Forma de Tutorial

> A linguagem descreve a construção de uma pagina através de comandos que são adicionados um após o outro. É possivel definir variaveis simbolizando as dimensões de paginas e
> quadrinhos, definindo dessa maneira a posição desses quadrinhos.
> var x = 2480
> var y = 3508
> define folha x y
> quadros são definidos atraves da posição de seus quatro vértices:
> define quadro 0 0 40 40

## Gramática da Linguagem

> S -> DefinirFolha | DefinirQuadro | DefinirImagem | Variavel | #.
> DefinirFolha -> Define Folha Exp Exp.
> DefinirQuadro -> Define Quadro Exp Exp Exp Exp.
> DefinirImagem -> Define Imagem palavra palavra.
> 
> Variavel -> Var Atr.
> Atr -> palavra = Exp | palavra , Atr , Exp.
> Exp -> numero | Exp Operador Exp | palavra.
> 
> Operador -> + | - | * | :.
> Define -> define.
> Var -> var.
> Quadro -> quadro.
> Imagem -> imagem.
> Folha -> folha.

## Exemplos Selecionados

> Coloque um conjunto de exemplos selecionados e os resultados alcançados.

# Referências Bibliográficas

> Lista de artigos, links e referências bibliográficas.
>
> Fiquem à vontade para escolher o padrão de referenciamento preferido pelo grupo.
