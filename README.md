# Ashen Frontier

**Ashen Frontier** is a browser-first 3D dark-fantasy action RPG by **K3RITO**.

## Current production direction

- React + Vite + Three.js runtime.
- Connected fantasy world with Ashen Frontier, Silent Grove, Broken Beacon, Forgotten Ruins and the Void Scar.
- Real CC0 GLB characters loaded through Three.js `GLTFLoader`.
- Data-driven enemies, items, skills, NPCs and quests.
- Combat with damage, defense, critical hits, dodge, abilities, enemy aggro and loot.
- NPC dialogue and quest progression.
- Inventory, rarity, equipment slots and consumable data.
- Versioned save system with reset, export and import.
- Desktop and mobile controls.
- Asset provenance tracked in `ASSET_LICENSES.md`.

## Run locally

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

## Free asset policy

The current external 3D runtime assets are CC0. The project prioritizes CC0/public-domain assets and open-source dependencies so that paid asset services are not required for the core game.

## License

Copyright © 2026 K3RITO. See individual asset and dependency licenses before redistribution.

## Credits

Design direction: K3RITO  
UI concept: K3RITO – Ashen Frontier  
3D runtime: Three.js  
External CC0 assets: documented in `ASSET_LICENSES.md`
