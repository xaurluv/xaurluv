import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const statepath = path.join(__dirname, "../data/state.json");

export function attack() {
  const state = JSON.parse(fs.readFileSync(statepath, "utf8"));

  const enemy = state.enemy;
  const battle = state.battle;

  // Apply damage
  enemy.hp = Math.max(0, enemy.hp - battle.damage);

  // Count attack
  battle.attacks++;

  // Check regeneration
  if (enemy.hp <= enemy.maxhp * (battle.regen / 100)) {
    enemy.hp = enemy.maxhp;
    console.log("Enemy regenerated to full HP!");
  }

  // Save updated state
  fs.writeFileSync(statepath, JSON.stringify(state, null, 2));

  console.log(`Enemy HP: ${enemy.hp}/${enemy.maxhp}`);
  console.log(`Total attacks: ${battle.attacks}`);
}

attack();
