import fs from "node:fs";
import path from "node:path";

const inputPath = path.resolve("src/tokens/colors.figmasync.json");
const outputPath = path.resolve("src/styles/tokens.colors.css");

// kebab-case simple (mantiene números)
function toKebab(str) {
  return String(str)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

// Recorre el objeto y saca tokens con $type=color
function collectColors(obj, prefix = []) {
  const out = [];
  if (!obj || typeof obj !== "object") return out;

  // Token final
  if (obj.$type === "color" && obj.$value && obj.$value.hex) {
    const name = prefix.map(toKebab).join("-");
    const hex = obj.$value.hex.toUpperCase();
    const comps = obj.$value.components; // 0..1
    const r = Math.round(comps[0] * 255);
    const g = Math.round(comps[1] * 255);
    const b = Math.round(comps[2] * 255);

    out.push({
      name,
      hex,
      rgb: `${r} ${g} ${b}`, // para usar con /alpha en Tailwind si quieres
    });
    return out;
  }

  // Sigue bajando
  for (const [k, v] of Object.entries(obj)) {
    if (k === "$extensions") continue;
    out.push(...collectColors(v, [...prefix, k]));
  }
  return out;
}

function buildCssVars(tokens) {
  // hex + rgb
  return tokens
    .map(
      (t) =>
        `  --color-${t.name}: ${t.hex};\n  --color-${t.name}-rgb: ${t.rgb};`
    )
    .join("\n");
}

const raw = JSON.parse(fs.readFileSync(inputPath, "utf8"));

const lightTokens = collectColors(raw.Light ?? {});
const darkTokens = collectColors(raw.Dark ?? {});

const css = `/* AUTO-GENERATED from ${path.basename(inputPath)} — do not edit by hand */
:root {
${buildCssVars(lightTokens)}
}

.dark {
${buildCssVars(darkTokens)}
}
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, css, "utf8");

console.log(`✅ Generated: ${outputPath}`);
console.log(`   Light tokens: ${lightTokens.length}`);
console.log(`   Dark tokens:  ${darkTokens.length}`);
