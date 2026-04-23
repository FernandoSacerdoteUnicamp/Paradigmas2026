const fs = require("fs");

// =========================
// NORMALIZAÇÃO
// =========================
function normalizeFileName(str) {
  return str
    .normalize("NFD")                 // separa acentos
    .replace(/[\u0300-\u036f]/g, "")  // remove acentos
    .toLowerCase()                    // lowercase
    .replace(/[^a-z0-9\s]/g, "")      // remove caracteres especiais
    .replace(/\s+/g, "_")             // espaços → _
    .trim();
}

// =========================
// RESOLUÇÃO DE PATHS
// =========================
function resolveBackground(name) {
    return `assets/backgrounds/${normalizeFileName(name)}.png`;
}

function resolveCharacter(name, emotion) {
    return `assets/characters/${normalizeFileName(name)}/${normalizeFileName(emotion)}.png`;
}

function resolveEffect(name) {
    return `assets/effects/${normalizeFileName(name)}.png`;
}

// =========================
// PARSER
// =========================
function parseDSL(input) {
    const lines = input.split("\n");

    const ast = {
        scenes: []
    };

    let currentScene = null;
    let currentPanel = null;

    for (let rawLine of lines) {
        let line = rawLine.trim();

        // Ignorar vazio ou comentário
        if (!line || line.startsWith("#")) continue;

        // =========================
        // CENA
        // =========================
        const sceneMatch = line.match(
            /^CENA\s+"(.+)"\s+\(Local:\s*"(.+)"\)/
            // ^CENA\s+         → linha começa com "CENA "
            // "(.+)"           → captura nome da cena
            // \(Local:\s*"     → literal "(Local: "
            // (.+)             → captura local
            // "\)              → fecha aspas e parênteses
        );

        if (sceneMatch) {
            currentScene = {
                name: sceneMatch[1],
                location: sceneMatch[2],
                panels: []
            };

            ast.scenes.push(currentScene);
            continue;
        }

        // =========================
        // QUADRO
        // =========================
        const panelMatch = line.match(
            /^QUADRO\s+(\d+)\s+\(Layout:\s*"(.+)"\)/
            // ^QUADRO\s+       → começa com "QUADRO "
            // (\d+)            → número do quadro
            // \(Layout:\s*"    → literal "(Layout: "
            // (.+)             → nome do layout
            // "\)              → fecha
        );

        if (panelMatch) {
            if (!currentScene) {
                throw new Error("QUADRO definido antes de CENA");
            }

            currentPanel = {
                number: Number(panelMatch[1]),
                layout: panelMatch[2],
                background: null,
                elements: []
            };

            currentScene.panels.push(currentPanel);
            continue;
        }

        // =========================
        // GARANTIA: precisa ter QUADRO antes
        // =========================
        if (!currentPanel) {
            throw new Error(`Elemento fora de QUADRO: ${line}`);
        }

        // =========================
        // BACKGROUND (CENARIO)
        // =========================
        const bgMatch = line.match(
            /^CENARIO:\s*"(.+)"/
            // ^CENARIO:        → começa com "CENARIO:"
            // \s*"             → espaço opcional + "
            // (.+)             → nome do cenário
            // "                → fecha aspas
        );

        if (bgMatch) {
            currentPanel.background = bgMatch[1];
            continue;
        }

        // =========================
        // RECORDATORIO
        // =========================
        const captionMatch = line.match(
            /^RECORDATORIO:\s*"(.+)"/
            // ^RECORDATORIO:   → palavra-chave
            // (.+)             → texto
        );

        if (captionMatch) {
            currentPanel.elements.push({
                type: "caption",
                text: captionMatch[1]
            });
            continue;
        }

        // =========================
        // EFEITO
        // =========================
        const effectMatch = line.match(
            /^EFEITO:\s*"(.+)"/
            // ^EFEITO:         → palavra-chave
            // (.+)             → nome do efeito
        );

        if (effectMatch) {
            currentPanel.elements.push({
                type: "effect",
                name: effectMatch[1]
            });
            continue;
        }

        // =========================
        // PERSONAGEM
        // =========================
        const characterMatch = line.match(
            /^(\w+)\s+\(Posicao:\s*"(.+)",\s*Sentimento:\s*"(.+)"\)/
            // (\w+)            → nome do personagem
            // Posicao: "..."   → posição
            // Sentimento: "..."→ emoção
        );

        if (characterMatch) {
            currentPanel.elements.push({
                type: "character",
                name: characterMatch[1],
                position: characterMatch[2],
                emotion: characterMatch[3]
            });
            continue;
        }

        // =========================
        // FALA
        // =========================
        const speechMatch = line.match(
            /^(\w+)\s+(diz|grita|pensa|sussurra):\s*"(.+)"/
            // (\w+)            → personagem
            // (diz|grita|...)  → ação válida (restrita!)
            // "(.+)"           → texto da fala
        );

        if (speechMatch) {
            currentPanel.elements.push({
                type: "speech",
                character: speechMatch[1],
                action: speechMatch[2],
                text: speechMatch[3]
            });
            continue;
        }

        // =========================
        // FALLBACK (debug)
        // =========================
        console.warn("Linha não reconhecida:", line);
    }

    return ast;
}

// =========================
// RENDER HTML
// =========================
function renderHTML(ast) {
    let html = `
  <html>
  <head>
    <style>
      body { font-family: Arial; background: #111; color: #fff; }
      .scene { margin-bottom: 40px; }
      .panel {
        width: 500px;
        height: 500px;

        position: relative; /* ESSENCIAL */
        overflow: hidden;

        border: 2px solid #fff;
        margin: 10px;
        }
      .background {
        position: absolute;
        inset: 0;

        background-size: cover;
        background-position: center;

        z-index: 0;
        }
      .character {
        position: absolute;
        z-index: 1;
        }

        .character img {
        width: 120px;
        }
      .effect {
        position: absolute;
        z-index: 2;
        top: 100px;
        right: 100px;
        }

        .effect img {
        width: 100px;
        }
        .speech {
        position: absolute;
        z-index: 3;

        top: 20px;
        right: 20px;

        background: white;
        color: black;
        padding: 10px;
        border-radius: 20px;
        max-width: 200px;
        }
        .speech::after {
        content: "";
        position: absolute;
        bottom: -10px;
        left: 20px;

        border-width: 10px;
        border-style: solid;
        border-color: white transparent transparent transparent;
        }
      .caption {
        background: #000;
        padding: 5px;
        margin-top: 5px;
      }
    </style>
  </head>
  <body>
  `;

    for (const scene of ast.scenes) {
        html += `<div class="scene">`;
        html += `<h2>${scene.name} - ${scene.location}</h2>`;

        for (const panel of scene.panels) {
            html += `<div class="panel">`;

            // BACKGROUND
            if (panel.background) {
                const src = resolveBackground(panel.background);
                html += `<div class="background" style="background-image: url('${src}')"></div>`;
            }

            for (const el of panel.elements) {
                // CHARACTER
                if (el.type === "character") {
                    const img = resolveCharacter(el.name, el.emotion);
                    const style = mapPosition(el.position);

                    html += `
                        <div class="character" style="${style}">
                            <img src="${img}" />
                        </div>
                        `;
                }

                // SPEECH
                if (el.type === "speech") {
                    html += `
            <div class="speech">
              <b>${el.character} (${el.action})</b>: ${el.text}
            </div>
          `;
                }

                // CAPTION
                if (el.type === "caption") {
                    html += `<div class="caption">${el.text}</div>`;
                }

                // EFFECT
                if (el.type === "effect") {
                    const effectImg = resolveEffect(normalizeFileName(el.name));

                    html += `
            <div class="effect">
              <img src="${effectImg}" />
            </div>
          `;
                }
            }

            html += `</div>`;
        }

        html += `</div>`;
    }

    html += `</body></html>`;
    return html;
}

function mapPosition(position) {
    switch (position.toLowerCase()) {
        case "esquerda":
            return "left: 20px; bottom: 20px;";
        case "direita":
            return "right: 20px; bottom: 20px;";
        case "centro":
            return "left: 50%; transform: translateX(-50%); bottom: 20px;";
        default:
            return "left: 20px; bottom: 20px;";
    }
}

// =========================
// EXECUÇÃO
// =========================
const input = fs.readFileSync("code.txt", "utf-8");

const ast = parseDSL(input);
console.log("AST gerada:", JSON.stringify(ast, null, 2));

const html = renderHTML(ast);

fs.writeFileSync("output.html", html);

console.log("HTML gerado com sucesso: output.html");