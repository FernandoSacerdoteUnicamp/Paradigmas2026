// ==========================================
// PARSER: DSL TEXTUAL → SCHEME-LIKE
// ==========================================

// =========================
// PARSER PRINCIPAL
// =========================
function parseDSLtoScheme(input) {
  const lines = input.split("\n");

  const stack = [];
  const root = [];

  let currentScene = null;
  let currentPanel = null;

  for (let rawLine of lines) {
    let line = rawLine.trim();

    if (!line || line.startsWith("#")) continue;

    // =========================
    // CENA
    // =========================
    let match = line.match(/^CENA\s+"(.+)"\s+\(Local:\s*"(.+)"\)/);
    if (match) {
      currentScene = [
        "cena",
        match[1],
        match[2]
      ];

      root.push(currentScene);
      currentPanel = null;
      continue;
    }

    // =========================
    // QUADRO
    // =========================
    match = line.match(/^QUADRO\s+(\d+)\s+\(Layout:\s*"(.+)"\)/);
    if (match) {
      if (!currentScene) throw new Error("QUADRO sem CENA");

      currentPanel = [
        "quadro",
        Number(match[1]),
        match[2]
      ];

      currentScene.push(currentPanel);
      continue;
    }

    if (!currentPanel) {
      throw new Error("Elemento fora de QUADRO: " + line);
    }

    // =========================
    // CENARIO
    // =========================
    match = line.match(/^CENARIO:\s*"(.+)"/);
    if (match) {
      currentPanel.push(["cenario", match[1]]);
      continue;
    }

    // =========================
    // PERSONAGEM
    // =========================
    match = line.match(/^(\w+)\s+\(Posicao:\s*"(.+)",\s*Sentimento:\s*"(.+)"\)/);
    if (match) {
      currentPanel.push([
        "personagem",
        match[1],
        match[2],
        match[3]
      ]);
      continue;
    }

    // =========================
    // FALA
    // =========================
    match = line.match(/^(\w+)\s+(diz|grita|pensa|sussurra):\s*"(.+)"/);
    if (match) {
      currentPanel.push([
        "fala",
        match[1],
        match[2],
        match[3]
      ]);
      continue;
    }

    // =========================
    // EFEITO
    // =========================
    match = line.match(/^EFEITO:\s*"(.+)"/);
    if (match) {
      currentPanel.push([
        "efeito",
        match[1]
      ]);
      continue;
    }

    // =========================
    // RECORDATORIO
    // =========================
    match = line.match(/^RECORDATORIO:\s*"(.+)"/);
    if (match) {
      currentPanel.push([
        "recordatorio",
        match[1]
      ]);
      continue;
    }

    console.warn("Linha ignorada:", line);
  }

  return root;
}

// =========================
// EXEMPLO DE USO
// =========================
const input = `
CENA "Reencontro" (Local: "Cafeteria")

QUADRO 1 (Layout: "padrao")
CENARIO: "cafe"

Joao (Posicao: "esquerda", Sentimento: "feliz")
Maria (Posicao: "direita", Sentimento: "neutra")

Joao diz: "Oi!"
Maria pensa: "Será que falo algo?"
EFEITO: "brilho"
RECORDATORIO: "Algumas horas depois..."
`;

const ast = parseDSLtoScheme(input);

console.log(JSON.stringify(ast, null, 2));