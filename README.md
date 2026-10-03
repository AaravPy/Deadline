<div align="center">

# LAST 60 SECONDS

### ONE MINUTE. ONE YARD. NO SECOND CHANCES.

A first-person 3D survival game about holding your ground while the clock runs out.

**MOVE** `W A S D` &nbsp;·&nbsp; **AIM** `MOUSE` &nbsp;·&nbsp; **FIRE** `CLICK` &nbsp;·&nbsp; **RELOAD** `R`

</div>

---

## THE YARD IS OPEN

The horde is closing in. Keep moving, find your angle, and make every round count. Survive the full minute to win; lose your health and the run ends early.

The arena, weapons, and zombies are drawn in real time with procedural Three.js geometry. No models, textures, or audio files are bundled.

## PLAY

Serve the project folder over HTTP, then open the local address in a modern browser with WebGL support.

```bash
python -m http.server 8000
```

Open **http://localhost:8000**. The game loads Three.js 0.186.0 from jsDelivr, so an internet connection is required when you start it.

There is no build step or install command.

## CONTROLS

| Input | Action |
|:--|:--|
| `W A S D` / arrow keys | Move |
| Mouse | Look and aim |
| Left click | Fire; hold to keep firing |
| `R` | Reload |
| `Shift` | Sprint |
| `B` | Open the armory during a run |
| `Esc` | Pause or resume |
| Sound button | Toggle generated sound effects |

The game requests mouse lock when a run starts. Press `Esc` to release it. If the browser does not support pointer lock, move the cursor over the arena to aim.

## THE ARMORY

Kills are currency. Earn one kill credit for every zombie you take down, then spend credits to unlock a new weapon. Your lifetime kill count and unlocked guns are saved in this browser.

| Weapon | Price | Magazine | Feel |
|:--|--:|--:|:--|
| Yard Sidearm | Free | 12 | Balanced and dependable |
| Compact SMG | 4 kills | 30 | Fast fire, more rounds |
| Pump Shotgun | 7 kills | 6 | Wide spread, heavy impact |
| Yard Carbine | 12 kills | 24 | Accurate and hard hitting |

Open the shop from the top of the menu, or press `B` during a run. Time pauses while you shop.

## WHAT'S INSIDE

- A compact 3D arena with solid walls and obstacles
- Zombies that pursue the player and crowd around cover
- Four unlockable weapons with distinct firing and reload behavior
- Persistent kill credits and weapon unlocks in local storage
- Generated Web Audio effects; no sound assets to download
- Responsive menus, HUD, pause screen, armory, and end-of-run results

## PROJECT MAP

```text
.
├── index.html       Screens, HUD, controls, and Three.js import map
├── style.css        Layout, visual identity, and interface styling
└── js/
    ├── main.js      Renderer startup and WebGL fallback
    ├── game.js      Game loop, scoring, collisions, and state changes
    ├── arena.js     Yard layout and obstacle collision helpers
    ├── player.js    First-person movement and camera
    ├── weapon.js    Weapon models, firing, ammo, and reload animation
    ├── zombie.js    Zombie model and behavior
    ├── input.js     Keyboard, mouse look, pointer lock, and firing
    ├── ui.js        Menus, HUD, shop, and results
    └── audio.js     Synthesized sound effects
```

## NOTES

- Desktop keyboard and mouse are the supported controls.
- Progress is stored in the browser's local storage; it does not sync between devices.
- Three.js is pinned in the import map. The browser needs access to jsDelivr to load it.

---

<div align="center">

**KEEP THEM OFF YOU.**  
`60 SECONDS STARTS NOW.`

</div>
