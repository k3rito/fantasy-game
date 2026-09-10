# Ashen Frontier Production Status

## Architecture

- React + Vite + Three.js.
- Game definitions are data-driven in `src/data/gameData.js`.
- Persistence is versioned in `src/game/save.js`.
- Three.js scene, combat, enemy AI and world interaction are isolated in `src/game/runtime.js`.
- DOM UI remains outside WebGL.
- CC0 GLB assets are loaded lazily through `GLTFLoader`.

## Implemented in this pass

- Five connected named regions: Ashen Frontier, Silent Grove, Broken Beacon, Forgotten Ruins and Void Scar.
- Roads, ruins, shrine, beacon, camp, environmental dressing and a distinct endgame gate.
- Real CC0 3D characters for player/NPC/enemy presentation.
- Multiple NPC archetypes with named roles and branching-style dialogue sequences.
- Data-driven quest definitions with prerequisites, objective kinds, progress and rewards.
- Combat stats, defense, critical-hit calculation, dodge, attack range, hit feedback, XP and loot.
- Enemy archetypes: skeleton, archer, beast, mage, elite and an endgame guardian variant.
- Skill tree with requirements, costs, passive effects and active abilities.
- Inventory, rarity, equipment slots, consumable and quest-item definitions.
- Versioned save migration plus save/reset/export/import UI.
- Desktop and mobile action controls.
- Asset provenance and license ledger.

## Verification limitation

The connected environment previously could not reach `registry.npmjs.org`, so a successful `npm install` / `npm run build` has not been claimed. GitHub Actions/Pages are also not treated as a build dependency because the account is currently payment-suspended.
