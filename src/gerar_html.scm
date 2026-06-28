;; DSL para Quadrinhos - Gerador de HTML

(define (ensure-string x)
  (cond
    ((string? x) x)
    ((symbol? x) (symbol->string x))
    (else (error "Esperado string ou símbolo" x))))

(define (char-safe c)
  (if (or (char-alphabetic? c) (char-numeric? c))
      (string (char-downcase c))
      "_"))

(define (normalize s)
  (apply string-append
         (map char-safe (string->list (ensure-string s)))))

(define (bg-path name)
  (string-append "assets/backgrounds/" (normalize name) ".png"))

(define (char-path name emo)
  (string-append "assets/characters/"
                 (normalize name) "/"
                 (normalize emo) ".png"))

(define (effect-path name)
  (string-append "assets/effects/" (normalize name) ".png"))

(define (map-position pos)
  (let ((p (ensure-string pos)))
    (cond
     ((string=? p "esquerda") "left:20px; bottom:20px;")
     ((string=? p "direita")  "right:20px; bottom:20px;")
     ((string=? p "centro")   "left:50%; transform:translateX(-50%); bottom:20px;")
     (else "left:20px; bottom:20px;"))))

(define (cena nome local . bodies)
  (string-append
   "<div class='scene'><h2>"
   (ensure-string nome) " - " (ensure-string local)
   "</h2>"
   (apply string-append bodies)
   "</div>"))

(define (quadro num layout . bodies)
  (string-append
   "<div class='panel'>"
   (apply string-append bodies)
   "</div>"))

(define (cenario nome)
  (string-append
   "<div class='background' style='background-image:url(\""
   (bg-path nome)
   "\")'></div>"))

(define (personagem nome pos emo)
  (string-append
   "<div class='character' style='" (map-position pos) "'>"
   "<img src='" (char-path nome emo) "'/>"
   "</div>"))

(define (fala personagem-nome acao texto)
  (let ((acao-str (ensure-string acao))
        (char-str (ensure-string personagem-nome)))
    (string-append
     "<div class='speech' data-action='" acao-str "' data-character='" char-str "'><b>"
     char-str
     " (" acao-str ")</b>: "
     (ensure-string texto)
     "</div>")))

(define (efeito nome)
  (string-append
   "<div class='effect'>"
   "<img src='" (effect-path nome) "'/>"
   "</div>"))

(define (recordatorio texto)
  (string-append
   "<div class='caption'>"
   (ensure-string texto)
   "</div>"))

(define css "
  body { font-family: Arial; background: #111; color: #fff; padding: 20px; }
  .scene { margin-bottom: 40px; }
  .panel {
    width: 500px; height: 500px;
    position: relative; overflow: hidden;
    border: 2px solid #fff; margin: 10px;
    background: #333;
  }
  .background {
    position: absolute; inset: 0;
    background-size: cover; background-position: center;
    z-index: 0;
  }
  .character { position: absolute; z-index: 5; }
  .character img { width: 200px; }
  .effect { position: absolute; z-index: 4; bottom: 20px; right: 20px; }
  .effect img { width: 100px; }
  .speech {
    position: absolute; z-index: 6;
    background: white; color: black;
    padding: 10px; border-radius: 20px;
    max-width: 200px; font-size: 12px;
    border: 2px solid black;
  }

  .speech[data-character='Joao'] {
    top: 80px; left: 20px;
  }

  .speech[data-character='Maria'] {
    top: 80px; right: 10px;
  }
  .speech::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 20px;
    border-width: 10px;
    border-style: solid;
    border-color: white transparent transparent transparent;
  }
  /* Balão de pensamento em formato de nuvem */
  .speech[data-action='pensa'] {
    border-radius: 40px 40px 40px 40px;
    border: 2px solid black;
    background: white;
    color: black;
    padding: 15px 20px;
    position: relative;
  }

  /* Círculo maior (bolinha principal) */
  .speech[data-action='pensa']::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    border: 2px solid black;
    border-radius: 50%;
    bottom: -15px;
    left: 15px;
  }

  /* Círculo menor (bolinha menor) */
  .speech[data-action='pensa']::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    background: white;
    border: 2px solid black;
    border-radius: 50%;
    bottom: -28px;
    left: 8px;
  }
  .caption {
    background: #000;
    padding: 5px;
    font-style: italic;
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    box-sizing: border-box;
  }
")

;; === EXEMPLOS ===

(define exemplo1
  (cena "O Despertar do Poder" "Floresta Proibida"
    (quadro 1 "Topo_Largo"
      (cenario "floresta")
      (personagem "Joao" "esquerda" "em_guarda")
      (fala "Joao" "pensa" "Eu sinto uma presença... ela está perto.")
      (efeito "CRACK")
      (recordatorio "O silêncio da floresta é interrompido."))))

(define exemplo2
  (cena "Reencontro" "Cafeteria da Cidade"
    (quadro 1 "Normal"
      (cenario "cafeteria")
      (personagem "Joao" "esquerda" "em_guarda")
      (personagem "Maria" "direita" "feliz")
      (fala "Joao" "diz" "Quanto tempo, Maria!")
      (fala "Maria" "diz" "Que coincidência te encontrar por aqui!")
      (recordatorio "Um reencontro inesperado na cafeteria."))))


;; === GERAR HTML ===

(define html-completo
  (string-append
    "<html>\n"
    "<head>\n"
    "<meta charset='UTF-8'>\n"
    "<title>DSL de Quadrinhos - João e Maria</title>\n"
    "<style>\n" css "\n</style>\n"
    "</head>\n"
    "<body>\n"
    "<h1>🎭 DSL para Criação de Histórias em Quadrinhos</h1>\n"
    "<p>Exemplos gerados com <strong>Guile Scheme</strong></p>\n"
    "<hr/>\n"
    exemplo1 "\n"
    "<hr/>\n"
    exemplo2 "\n"
    "</body>\n"
    "</html>\n"))

;; Salvar em arquivo
(call-with-output-file "output.html"
  (lambda (port)
    (display html-completo port)))

(display "\n HTML gerado com sucesso: output.html\n")
