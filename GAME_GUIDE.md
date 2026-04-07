# Apple Tart — Game Guide

A side-scrolling kitchen platformer synced to the song *Apple Tart*. You play as a tiny chef running along a kitchen counter, dodging hazards and collecting tart slices while lyrics appear on screen.

---

## Project structure

```
appletart/
├── index.html          ← page shell, loads Phaser + game.js
├── game.js             ← all game logic (3 scenes, textures, physics)
├── songdata.js         ← lyrics, song sections, story items, color palettes
├── Apple Tart PERC.mp3 ← the song audio file
└── GAME_GUIDE.md       ← this file
```

---

## How the game works

### 1. Three Phaser scenes

The game is built on **Phaser 3** and has three scenes that run in sequence:

| Scene | Class | Purpose |
|-------|-------|---------|
| **Boot** | `BootScene` | Title screen with a PLAY button |
| **Game** | `GameScene` | The main gameplay |
| **End** | `EndScene` | Win/lose screen with score |

Scenes are registered in the Phaser config at the bottom of `game.js`:

```js
const config = {
  // ...
  scene: [BootScene, GameScene, EndScene],
};
new Phaser.Game(config);
```

### 2. The game world

The world is a long horizontal strip — a kitchen counter the chef runs across.

```
WORLD_WIDTH = 50000px  (about 3:26 of running at full speed)
COUNTER_HEIGHT = 100px (the brown counter at the bottom)
FLOOR_Y = screenHeight - COUNTER_HEIGHT
```

The camera follows the player horizontally and is bounded to the world width.

### 3. The song drives everything

An `<audio>` element plays the MP3. Every frame, the update loop reads `audioEl.currentTime` to know where we are in the song. That timestamp drives:

- **Which section** we're in (intro, verse, chorus, comatose, outro)
- **Which lyrics** to display
- **Which story items** to spawn
- **Hazard intensity** (how often obstacles appear)
- **Color palette** (background, wall, counter colors shift per section)

When the song ends → you win. If you lose all 5 lives → game over.

### 4. The update loop (`update()`)

Runs every frame (~60fps). Here's what it does in order:

1. **Section detection** — scans `sections[]` to find what part of the song we're in, updates the color palette
2. **Lyrics** — checks if a new lyric should appear, fades it in/out
3. **Story items** — spawns big set-piece objects (tart, crumble, coal, etc.) at the right song moment
4. **Timer display** — updates the clock HUD
5. **Player movement** — reads arrow keys / WASD, applies velocity and jump
6. **Fall respawn** — if player falls off the bottom, reposition and take damage
7. **Invincibility flicker** — blink the player sprite during i-frames
8. **Hazard spawning** — based on a timer and current section intensity
9. **Cleaver updates** — handles the multi-phase cleaver animation (warning → slam → hold → retract)
10. **Cleanup** — destroys off-screen hazards
11. **Win check** — if song time ≥ duration, trigger win

---

## How sprites are created

There are **no image files** — every sprite is drawn in code using Phaser's `Graphics` object, then saved as a texture with `generateTexture()`.

### The pattern

```js
createTextures() {
  const g = this.add.graphics();

  // 1. Clear any previous drawing
  g.clear();

  // 2. Draw shapes (coordinates are relative to 0,0)
  g.fillStyle(0xff0000);          // set fill color (hex)
  g.fillRect(x, y, width, height); // draw a rectangle
  g.fillCircle(cx, cy, radius);    // draw a circle
  g.fillEllipse(cx, cy, w, h);     // draw an ellipse

  // 3. Save it as a named texture
  g.generateTexture('mySprite', totalWidth, totalHeight);

  // 4. Later, use it:
  // this.add.image(x, y, 'mySprite');
  // or with physics:
  // this.physics.add.sprite(x, y, 'mySprite');

  g.destroy(); // clean up the graphics object when done
}
```

### Drawing commands available

| Method | What it draws |
|--------|--------------|
| `g.fillStyle(color, alpha)` | Sets the fill color for subsequent shapes |
| `g.fillRect(x, y, w, h)` | Filled rectangle |
| `g.fillCircle(cx, cy, r)` | Filled circle |
| `g.fillEllipse(cx, cy, w, h)` | Filled ellipse |
| `g.fillTriangle(x1,y1, x2,y2, x3,y3)` | Filled triangle |
| `g.beginPath(); g.moveTo(); g.lineTo(); g.closePath(); g.fill()` | Custom polygon |
| `g.lineStyle(thickness, color, alpha)` | Sets line style |
| `g.lineBetween(x1, y1, x2, y2)` | Draw a line |
| `g.strokeEllipse(cx, cy, w, h)` | Outline of an ellipse |

### The chef sprite (player) — line by line

```js
g.clear();
// Body (white chef coat)
g.fillStyle(0xf0ece4); g.fillRect(2, 10, 18, 20);
// Apron
g.fillStyle(0xe0d8c8); g.fillRect(5, 16, 12, 14);
// Head (skin tone)
g.fillStyle(0xf0c890); g.fillRect(4, 0, 14, 12);
// Eyes (two small dark squares)
g.fillStyle(0x1a1008); g.fillRect(7, 4, 3, 3); g.fillRect(12, 4, 3, 3);
// Chef hat (tall white rectangle + brim)
g.fillStyle(0xf5f0e8); g.fillRect(5, -12, 12, 14); g.fillRect(3, -2, 16, 4);
// Legs (dark trousers)
g.fillStyle(0x2a2a38); g.fillRect(4, 30, 6, 8); g.fillRect(12, 30, 6, 8);
// Shoes
g.fillStyle(0x1a1a1a); g.fillRect(3, 36, 8, 3); g.fillRect(11, 36, 8, 3);
// Save as 22×40 texture
g.generateTexture('chef', 22, 40);
```

The coordinate system starts at the top-left of the texture. Negative y values (like the hat at y=-12) are allowed — they just extend above the origin point.

---

## How to create a new character

### Step 1: Draw the texture

Add your drawing code inside `createTextures()`, before `g.destroy()`:

```js
// Example: a sous chef with a red bandana
g.clear();
// Body
g.fillStyle(0xf0ece4); g.fillRect(2, 10, 18, 20);
// Head
g.fillStyle(0xd4a870); g.fillRect(4, 0, 14, 12);
// Eyes
g.fillStyle(0x1a1008); g.fillRect(7, 4, 3, 3); g.fillRect(12, 4, 3, 3);
// Red bandana instead of hat
g.fillStyle(0xcc2222); g.fillRect(3, -2, 16, 6);
// Legs
g.fillStyle(0x2a2a38); g.fillRect(4, 30, 6, 8); g.fillRect(12, 30, 6, 8);
// Shoes
g.fillStyle(0x1a1a1a); g.fillRect(3, 36, 8, 3); g.fillRect(11, 36, 8, 3);
g.generateTexture('sousChef', 22, 40);
```

### Step 2: Use it as the player

In `create()`, change the player sprite key:

```js
// Was:
this.player = this.physics.add.sprite(200, FLOOR_Y - 60, 'chef');
// Now:
this.player = this.physics.add.sprite(200, FLOOR_Y - 60, 'sousChef');
```

### Step 3: Adjust the hitbox if needed

If your character is a different size, update the physics body:

```js
this.player.body.setSize(16, 34);   // hitbox width, height
this.player.body.setOffset(3, 6);   // offset from sprite top-left
```

---

## How to create a new background object

Add it inside `buildBackgroundObjects(FLOOR_Y)`:

```js
// Example: a clock on the wall
for (let x = 2000; x < WORLD_WIDTH; x += 5000 + Math.random() * 3000) {
  // Clock face
  const clock = this.add.circle(x, FLOOR_Y * 0.2, 30, 0xe8dcc8)
    .setScrollFactor(0.1, 1)  // slow parallax = far away
    .setDepth(-7)             // behind everything
    .setAlpha(0.3);           // faded
  this.bgGroup.add(clock);
}
```

**Key properties for background objects:**

| Property | What it does |
|----------|-------------|
| `.setScrollFactor(0.1, 1)` | Parallax speed. Lower = further away. Range: 0.08–0.4 |
| `.setDepth(-7)` | Draw order. More negative = further behind. Background uses -4 to -9 |
| `.setAlpha(0.3)` | Transparency. Lower = more faded/atmospheric |

### Current background layers (front to back)

| Depth | scrollFactor | Objects |
|-------|-------------|---------|
| -4 | 0.25–0.30 | Bottles, jars (close to counter) |
| -5 | 0.20 | Cabinets with handles |
| -6 | 0.15–0.18 | Shelves, stoves |
| -7 | 0.12 | Hanging pots and pans |
| -8 | 0.10 | Utensil racks, windows |
| -9 | 0.08 | Tile lines on wall |

---

## How to create a new obstacle / hazard

### Step 1: Create the texture

In `createTextures()`:

```js
// Example: a rolling lemon
g.clear();
g.fillStyle(0xe8d44d); g.fillCircle(12, 12, 12);
g.fillStyle(0xf0e060); g.fillCircle(10, 10, 5); // highlight
g.generateTexture('lemon', 24, 24);
```

### Step 2: Write the spawn function

Add a new method to `GameScene`:

```js
spawnRollingLemon() {
  const fromRight = Math.random() > 0.5;
  const spawnX = fromRight
    ? this.cameras.main.scrollX + this.W + 60    // off right edge
    : this.cameras.main.scrollX - 60;             // off left edge
  const speed = fromRight ? -150 : 150;

  const lemon = this.hazards.create(spawnX, this.FLOOR_Y - 12, 'lemon');
  lemon.body.setVelocityX(speed);
  lemon.body.setAllowGravity(false);  // rolls along the counter
  lemon.body.setSize(16, 16);         // slightly smaller hitbox than visual
  lemon.setDepth(4);

  // Optional: spin animation
  this.tweens.add({
    targets: lemon,
    angle: fromRight ? -360 : 360,
    duration: 1000,
    repeat: -1,
    ease: 'Linear',
  });
}
```

### Step 3: Register it in `spawnHazard()`

Add your hazard to the random selection:

```js
spawnHazard() {
  const roll = Math.random();
  if (roll < 0.30) this.spawnRollingFruit();
  else if (roll < 0.50) this.spawnCleaver();
  else if (roll < 0.65) this.spawnSteamJet();
  else if (roll < 0.75) this.spawnRollingLemon();  // ← new!
  // ...
}
```

### Key concepts for hazards

- **All hazards go in `this.hazards`** — this physics group auto-checks overlap with the player
- **`setAllowGravity(false)`** — prevents the hazard from falling
- **Hitbox vs visual size** — use `body.setSize(w, h)` to make the hitbox smaller than the sprite (more forgiving)
- **Off-screen cleanup** — the update loop automatically destroys hazards that scroll off-screen
- **Damage** — when a hazard overlaps the player, `hitPlayer()` is called automatically, which triggers `damagePlayer()` (lose a life, get 2.5s invincibility)

---

## How to create a new story item

Story items are big decorative objects tied to specific moments in the song. They appear on the counter ahead of the player when their timestamp is reached.

### Step 1: Draw the texture in `createTextures()`

```js
// Example: a birthday cake
g.clear();
g.fillStyle(0xf0e0c0); g.fillRect(10, 30, 60, 40);  // cake body
g.fillStyle(0xe8a0b0); g.fillRect(10, 26, 60, 8);    // frosting
g.fillStyle(0xf5d050); g.fillRect(38, 10, 4, 20);     // candle
g.fillStyle(0xff6600); g.fillCircle(40, 8, 4);         // flame
g.generateTexture('storyBirthday', 80, 70);
```

### Step 2: Add to songdata.js

```js
// In storyItems array:
{ t: 150, type: 'birthday', label: 'Birthday Cake' },
```

### Step 3: Register the texture mapping

In `spawnStoryItem()`, add to the `textureMap` object:

```js
const textureMap = {
  // ... existing items ...
  birthday: 'storyBirthday',  // ← new
};
```

---

## How to add a new song section

### Step 1: Add to `songdata.js`

```js
// In sections array (must be in time order):
{ t: 160, name: 'bridge', label: 'bridge' },

// Add a color palette:
bridge: { bg: 0x1a0a1e, wall: 0x2a1430, counter: 0x6a5070, accent: 0xa060c0 },
```

### Step 2: Set hazard intensity

In `getIntensity()` in `game.js`:

```js
if (s === 'bridge') return 0.8;  // 0 = no hazards, 1.3 = max chaos
```

### Step 3: Customize hazard mix (optional)

In `spawnHazard()`, add a section-specific branch:

```js
if (s === 'bridge') {
  // Only cleavers and whisks during the bridge
  if (roll < 0.6) this.spawnCleaver();
  else this.spawnSwingingWhisk();
}
```

---

## Existing hazard types

| Hazard | Texture key | Behavior |
|--------|------------|----------|
| **Rolling fruit** | `apple`, `raspberry` | Rolls horizontally across the counter from off-screen |
| **Cleaver** | `cleaver` | Warning shadow → slams down → holds → retracts. Multi-phase, manual hit detection |
| **Steam jet** | `steam` | 3–5 puffs rise from counter, expand and fade out |
| **Flour bomb** | `flourBomb` | Falls from above, shakes screen on impact |
| **Hot sauce puddle** | `hotSauce` | Sits on counter for ~8 seconds then fades |
| **Swinging whisk** | `whisk` | Pendulums back and forth 3 times from a rope above |

---

## Existing story items

| Song time | Type | Texture key |
|-----------|------|------------|
| 12s | Apple Tart | `storyAppleTart` |
| 18s | Raspberry Crumble | `storyRaspberryCrumble` |
| 43s | Lump of Coal | `storyCoal` |
| 66s | Fructose | `storyFructose` |
| 73s | Chardonnay | `storyChardonnay` |
| 75s | Tobacco | `storyTobacco` |
| 100s | The Knife | `storyKnife` |
| 136s | Lactose | `storyLactose` |
| 146s | The Bed | `storyBed` |
| 189s | The Meat | `storyMeat` |

---

## Quick reference: depth layers

| Depth | What's drawn there |
|-------|--------------------|
| -10 to -4 | Background (wall, cabinets, bottles, shelves, etc.) |
| 0 | Counter surface and edge highlight |
| 1 | Cleaver shadows, hot sauce puddles |
| 2 | Story items and their labels |
| 3 | Collectible tart slices, whisk ropes |
| 4 | Rolling fruit, steam puffs |
| 5 | Player, flour bombs, whisks, cleaver sprites |
| 6 | Particle emitter, cleaver sprite |
| 100 | HUD (lives, timer, lyrics, score, section label) |

---

## Player mechanics

| Property | Value |
|----------|-------|
| Move speed | 260 px/s (180 during comatose) |
| Jump force | -400 (−280 during comatose) |
| Gravity | 600 (world) + 300 (extra on player) = 900 total |
| Lives | 5 (max), restored by collecting tart slices |
| Invincibility | 2.5 seconds after taking damage |
| Controls | Arrow keys or WASD, Space/Up to jump |
