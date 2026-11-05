import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const statepath = path.join(root, "data/state.json");
const outputpath = path.join(root, "generated/battle.svg");

const backgroundpath = path.join(root, "assets/backgrounds/arena.png");
const playerpath = path.join(root, "assets/characters/player.gif");
const enemypath = path.join(root, "assets/characters/enemy.gif");

function imagebase64(filepath) {
  return fs.readFileSync(filepath).toString("base64");
}

function healthbar(x, y, hp, maxhp, width = 400) {
  const percentage = Math.max(0, Math.min(1, hp / maxhp));
  const fillwidth = width * percentage;

  return `
    <rect x="${x}" y="${y}" width="${width}" height="28"
          rx="8" fill="#222" stroke="#fff" stroke-width="2"/>

    <rect x="${x}" y="${y}" width="${fillwidth}" height="28"
          rx="8" fill="#55dc83"/>

    <text x="${x + width / 2}" y="${y + 20}"
          text-anchor="middle" fill="white"
          font-size="17" font-weight="bold">
      ${hp}/${maxhp} HP
    </text>
  `;
}

function render() {
  const state = JSON.parse(fs.readFileSync(statepath, "utf8"));

  const { player, enemy, battle } = state;

  const background = imagebase64(backgroundpath);
  const playergif = imagebase64(playerpath);
  const enemygif = imagebase64(enemypath);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink"
         width="1280"
         height="720"
         viewBox="0 0 1280 720">

      <image
        href="data:image/png;base64,${background}"
        x="0" y="0"
        width="1280" height="720"
      />

      <rect x="40" y="35" width="440" height="115"
            rx="16" fill="#101820" opacity="0.8"/>

      <rect x="800" y="35" width="440" height="115"
            rx="16" fill="#101820" opacity="0.8"/>

      <text x="70" y="75" fill="white"
            font-size="30" font-weight="bold">
        ${player.name}
      </text>

      <text x="830" y="75" fill="white"
            font-size="30" font-weight="bold">
        ${enemy.name}
      </text>

      ${healthbar(70, 95, player.hp, player.maxhp)}
      ${healthbar(830, 95, enemy.hp, enemy.maxhp)}

      <image
        href="data:image/gif;base64,${playergif}"
        x="240" y="340"
        width="256" height="256"
        preserveAspectRatio="xMidYMid meet"
      />

      <image
        href="data:image/gif;base64,${enemygif}"
        x="780" y="340"
        width="256" height="256"
        preserveAspectRatio="xMidYMid meet"
      />

      <rect x="490" y="640" width="300" height="55"
            rx="14" fill="#101820" opacity="0.85"/>

      <text x="640" y="676"
            text-anchor="middle"
            fill="white"
            font-size="24"
            font-weight="bold">
        ATTACKS: ${battle.attacks}
      </text>

    </svg>
  `;

  fs.mkdirSync(path.dirname(outputpath), { recursive: true });
  fs.writeFileSync(outputpath, svg.trim());

  console.log("Battlefield rendered!");
}

render();
