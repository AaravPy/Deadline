# LAST 60 SECONDS — v0.1.0

A standalone first-person 3D arcade survival shooter. The arena, weapon, and single stylized zombie are procedural geometry; no models, textures, or sound assets are downloaded. The renderer uses Three.js 0.186.0 from jsDelivr through an import map, so an internet connection is needed when the game loads. Serve this folder over HTTP and open `index.html` in a modern WebGL-capable browser.

## Play

- **WASD / arrow keys:** move
- **Mouse:** look and aim (the game requests pointer lock when you enter; when the host blocks it, moving the cursor over the arena still turns the camera)
- **Left mouse button:** fire; holding the button fires at the weapon's rate
- **R:** reload
- **Shift:** sprint
- **B:** open the armory during a run; time pauses while shopping
- **Escape:** pause / resume
- **Sound button:** mute or enable generated Web Audio effects

Survive for 60 seconds. Each zombie kill adds one lifetime kill credit, saved in this browser. Spend kill credits to permanently unlock the compact SMG, pump shotgun, or carbine; the header shows lifetime kills and the armory shows your kill bank. Zombies move in from the arena perimeter. A hit subtracts 9 health; the short damage interval limits rapid stacked damage. Your best survival time is stored in this browser.

## Structure

- `index.html` — semantic screens, HUD, controls, and the Three.js import map
- `style.css` — identity, responsive layout, reticle, and HUD
- `js/main.js` — renderer startup and WebGL fallback
- `js/game.js` — frame loop, state transitions, waves, scoring, collisions, and shooting
- `js/arena.js` — procedural industrial yard
- `js/player.js` — first-person movement and camera
- `js/weapon.js` — fictional gun catalog, models, ammo, reloads, recoil, and muzzle flash
- `js/zombie.js` — the single animated zombie type
- `js/input.js` — keyboard, mouse look, pointer lock, and firing
- `js/ui.js` — HUD and menu/pause/result screens
- `js/audio.js` — optional synthesized sound effects

## v0.1.0 limits

Desktop keyboard and mouse are the supported controls. The scene is built from procedural shapes and uses simple pursuit with local crowd separation rather than navigation around cover. Visual testing needs a browser with WebGL and access to the pinned Three.js CDN module.
