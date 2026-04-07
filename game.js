// ── Apple Tart — Phaser 3 ──
import { SONG_DURATION_FALLBACK, lyrics, sections, storyItems, sectionPalettes }
  from './songdata.js';

const COUNTER_HEIGHT = 100;
const WORLD_WIDTH = 50000;

// ─────────────────────────────────────────────
//  BOOT SCENE — start screen
// ─────────────────────────────────────────────
class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    this.cameras.main.setBackgroundColor('#0a0705');

    this.add.text(cx, cy - 60, 'Apple Tart', {
      fontFamily: 'Playfair Display, serif',
      fontStyle: 'italic',
      fontSize: '64px',
      color: '#e8c89a',
    }).setOrigin(0.5);

    this.add.text(cx, cy, 'survive the kitchen', {
      fontFamily: 'Courier Prime, monospace',
      fontSize: '16px',
      color: '#7a6a5a',
      letterSpacing: 2,
    }).setOrigin(0.5);

    const btn = this.add.text(cx, cy + 60, '[ PLAY ]', {
      fontFamily: 'Courier Prime, monospace',
      fontSize: '20px',
      color: '#e8c89a',
      letterSpacing: 4,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setColor('#fff'));
    btn.on('pointerout', () => btn.setColor('#e8c89a'));
    btn.on('pointerdown', () => this.scene.start('Game'));

    this.add.text(cx, cy + 120, '\u2190 \u2192 move   \u2022   Space / \u2191 jump   \u2022   Collect tart slices', {
      fontFamily: 'Courier Prime, monospace',
      fontSize: '12px',
      color: '#4a3a2a',
    }).setOrigin(0.5);
  }
}

// ─────────────────────────────────────────────
//  GAME SCENE — the main gameplay
// ─────────────────────────────────────────────
class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  // ── helpers to draw textures at boot ──
  createTextures() {
    const g = this.add.graphics();

    // Player — tiny chef with walk animation (individual frame textures)
    {
      // All Y coords shifted +12 so hat (originally at -12) starts at 0
      // Total height: 52 (hat top 0 to shoe bottom 51)
      const drawChef = (key, leftLegX, leftLegY, leftLegH, rightLegX, rightLegY, rightLegH) => {
        g.clear();
        // Hat
        g.fillStyle(0xf5f0e8); g.fillRect(5, 0, 12, 14); g.fillRect(3, 10, 16, 4);
        // Head
        g.fillStyle(0xf0c890); g.fillRect(4, 12, 14, 12);
        // Eyes
        g.fillStyle(0x1a1008); g.fillRect(7, 16, 3, 3); g.fillRect(12, 16, 3, 3);
        // Body
        g.fillStyle(0xf0ece4); g.fillRect(2, 22, 18, 20);
        // Apron
        g.fillStyle(0xe0d8c8); g.fillRect(5, 28, 12, 14);
        // Legs
        g.fillStyle(0x2a2a38);
        g.fillRect(leftLegX, leftLegY, 6, leftLegH);
        g.fillRect(rightLegX, rightLegY, 6, rightLegH);
        // Shoes
        g.fillStyle(0x1a1a1a);
        g.fillRect(leftLegX - 1, leftLegY + leftLegH, 8, 3);
        g.fillRect(rightLegX - 1, rightLegY + rightLegH, 8, 3);
        g.generateTexture(key, 22, 52);
      };

      // Frame 0: idle
      drawChef('chef0', 4, 42, 8, 12, 42, 8);
      // Frame 1: walk — left forward, right back
      drawChef('chef1', 2, 42, 8, 14, 40, 10);
      // Frame 2: walk — legs mid
      drawChef('chef2', 4, 41, 9, 12, 41, 9);
      // Frame 3: walk — right forward, left back
      drawChef('chef3', 2, 40, 10, 14, 42, 8);
      // Frame 4: walk — legs mid
      drawChef('chef4', 4, 41, 9, 12, 41, 9);
      // Frame 5: jump — legs tucked
      drawChef('chef5', 5, 42, 5, 11, 42, 5);

      g.clear();

      // Animations
      this.anims.create({ key: 'chef-idle', frames: [{ key: 'chef0' }], frameRate: 1, repeat: -1 });
      this.anims.create({ key: 'chef-walk', frames: [{ key: 'chef1' }, { key: 'chef2' }, { key: 'chef3' }, { key: 'chef4' }], frameRate: 10, repeat: -1 });
      this.anims.create({ key: 'chef-jump', frames: [{ key: 'chef5' }], frameRate: 1, repeat: -1 });
    }

    // Cutting board platform
    g.clear();
    g.fillStyle(0xb08850); g.fillRect(0, 0, 180, 18);
    g.fillStyle(0xc8a060); g.fillRect(0, 0, 180, 3);
    g.lineStyle(1, 0x503214, 0.2);
    for (let i = 14; i < 180; i += 14) { g.lineBetween(i, 0, i, 18); }
    g.generateTexture('cuttingBoard', 180, 18);

    // Cookbook platform
    g.clear();
    g.fillStyle(0x8b2020); g.fillRect(0, 0, 140, 22);
    g.fillStyle(0xf0e8d8); g.fillRect(4, 3, 132, 16);
    g.fillStyle(0x8b2020); g.fillRect(6, 2, 128, 2);
    g.generateTexture('book', 140, 22);

    // Spice tin platform
    g.clear();
    g.fillStyle(0x606878); g.fillRect(0, 0, 100, 20);
    g.fillStyle(0x707888); g.fillRect(0, 0, 100, 3);
    g.fillStyle(0xe8dcc8); g.fillRect(8, 5, 84, 10);
    g.generateTexture('tin', 100, 20);

    // Tart slice collectible
    g.clear();
    g.fillStyle(0xdaa520);
    g.beginPath(); g.moveTo(0, 20); g.lineTo(12, 0); g.lineTo(24, 20); g.closePath(); g.fill();
    g.fillStyle(0x8b6914);
    g.beginPath(); g.moveTo(4, 18); g.lineTo(12, 4); g.lineTo(20, 18); g.closePath(); g.fill();
    g.fillStyle(0x90b030);
    g.fillEllipse(12, 10, 10, 6);
    g.generateTexture('tartSlice', 24, 22);

    // Rolling apple
    g.clear();
    g.fillStyle(0xcc2222); g.fillCircle(20, 20, 20);
    g.fillStyle(0xff6666, 0.3); g.fillCircle(14, 14, 8);
    g.fillStyle(0x5a3a10); g.fillRect(18, 0, 4, 7);
    g.fillStyle(0x4a8a20); g.fillEllipse(24, 4, 8, 4);
    g.generateTexture('apple', 40, 40);

    // Rolling raspberry
    g.clear();
    g.fillStyle(0xc03060); g.fillCircle(14, 14, 14);
    g.fillStyle(0xd04070);
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      g.fillCircle(14 + Math.cos(a) * 7, 14 + Math.sin(a) * 7, 5);
    }
    g.generateTexture('raspberry', 28, 28);

    // Giant apple tart story item
    g.clear();
    g.fillStyle(0xc8b898); g.fillEllipse(60, 55, 62, 18); // dish
    g.fillStyle(0xdaa520); g.fillEllipse(60, 48, 55, 22); // crust
    g.fillStyle(0x8b4513); g.fillEllipse(60, 44, 45, 18); // filling
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      g.fillStyle(i % 2 === 0 ? 0xa0c040 : 0x80a030);
      g.fillEllipse(60 + Math.cos(a) * 30, 46 + Math.sin(a) * 10, 12, 7);
    }
    g.generateTexture('storyAppleTart', 120, 70);

    // Raspberry crumble story item
    g.clear();
    g.fillStyle(0xd4a060); g.fillEllipse(50, 40, 52, 16); // dish
    g.fillStyle(0xc89030); g.fillEllipse(50, 36, 45, 14); // crumble top
    g.fillStyle(0xc03060);
    for (let i = 0; i < 8; i++) {
      g.fillCircle(20 + Math.random() * 60, 28 + Math.random() * 16, 4 + Math.random() * 3);
    }
    g.generateTexture('storyRaspberryCrumble', 100, 56);

    // Coal
    g.clear();
    g.fillStyle(0x1a1a1a); g.fillCircle(16, 16, 16);
    g.fillStyle(0xb43c0a); g.fillCircle(12, 12, 6);
    g.fillStyle(0x2a2a2a);
    g.fillCircle(20, 10, 5); g.fillCircle(10, 20, 4);
    g.generateTexture('storyCoal', 32, 32);

    // Chardonnay bottle
    g.clear();
    g.fillStyle(0x2a4a20);
    g.fillRect(16, 60, 28, 50); // body
    g.fillRect(22, 10, 16, 52); // neck
    g.fillStyle(0xe8dcc8); g.fillRect(18, 72, 24, 20); // label
    g.generateTexture('storyChardonnay', 60, 110);

    // Fructose — sugar bag
    g.clear();
    g.fillStyle(0xf0e8d0); g.fillRect(0, 0, 50, 60);
    g.fillStyle(0xe05020);
    g.fillRect(5, 15, 40, 20); // label band
    g.generateTexture('storyFructose', 50, 60);

    // Tobacco — cigarette pack
    g.clear();
    g.fillStyle(0xc82020); g.fillRect(0, 0, 40, 50);
    g.fillStyle(0xf0e0c0); g.fillRect(0, 0, 40, 15); // flip top
    g.fillStyle(0xe8d0a0); g.fillRect(8, 4, 5, 12); // cigarette poking out
    g.generateTexture('storyTobacco', 40, 50);

    // Knife story item — big chef's knife
    g.clear();
    g.fillStyle(0x6a4420); g.fillRect(0, 20, 16, 30); // handle
    g.fillStyle(0xc0b090); g.fillCircle(8, 28, 3); g.fillCircle(8, 42, 3); // rivets
    g.fillStyle(0xd0d8e0);
    g.beginPath(); g.moveTo(4, 18); g.lineTo(60, 8); g.lineTo(65, 16); g.lineTo(8, 22); g.closePath(); g.fill();
    g.generateTexture('storyKnife', 66, 52);

    // Lactose — milk carton
    g.clear();
    g.fillStyle(0xf0f0f0); g.fillRect(0, 10, 40, 50);
    g.fillStyle(0x4090e0); g.fillRect(0, 30, 40, 20); // blue band
    g.fillStyle(0xf0f0f0);
    g.beginPath(); g.moveTo(0, 10); g.lineTo(20, 0); g.lineTo(40, 10); g.closePath(); g.fill();
    g.generateTexture('storyLactose', 40, 60);

    // Bed — tiny bed
    g.clear();
    g.fillStyle(0x5a3a20); g.fillRect(0, 30, 80, 10); // frame
    g.fillStyle(0xe8e0d0); g.fillRect(4, 14, 72, 18); // mattress
    g.fillStyle(0x7090c0); g.fillRect(4, 10, 72, 8); // blanket
    g.fillStyle(0xf0e8d8); g.fillRect(6, 8, 20, 10); // pillow
    // Headboard
    g.fillStyle(0x4a2a14); g.fillRect(0, 0, 6, 40);
    g.generateTexture('storyBed', 80, 42);

    // Meat — steak on plate
    g.clear();
    g.fillStyle(0xe8e0d8); g.fillEllipse(40, 36, 42, 14); // plate
    g.fillStyle(0x5a1a08); g.fillEllipse(40, 30, 30, 12); // steak
    g.fillStyle(0x8a2a10); g.fillEllipse(38, 28, 22, 9);
    g.lineStyle(2, 0x2a0a04);
    g.lineBetween(28, 22, 26, 34); g.lineBetween(38, 22, 36, 34); g.lineBetween(48, 22, 46, 34);
    g.generateTexture('storyMeat', 80, 50);

    // Cleaver
    g.clear();
    // Blade
    g.fillStyle(0xc0ccd8);
    g.fillRect(0, 0, 50, 70);
    // Rounded bottom-right
    g.fillStyle(0x0a0705); g.fillTriangle(50, 58, 50, 70, 36, 70);
    // Edge glint
    g.lineStyle(2, 0xffffff, 0.4); g.lineBetween(0, 70, 36, 70);
    // Handle
    g.fillStyle(0x6a4420); g.fillRect(14, -28, 22, 32);
    g.fillStyle(0xc0b090); g.fillCircle(25, -18, 3); g.fillCircle(25, -6, 3);
    // Bevel
    g.lineStyle(1, 0x000000, 0.08); g.lineBetween(8, 4, 8, 66);
    g.generateTexture('cleaver', 50, 74);

    // Crumb particle
    g.clear();
    g.fillStyle(0xc89030); g.fillRect(0, 0, 6, 6);
    g.generateTexture('crumb', 6, 6);

    // Steam cloud
    g.clear();
    g.fillStyle(0xd0d8e0);
    g.fillCircle(14, 16, 12);
    g.fillCircle(24, 12, 10);
    g.fillCircle(8, 10, 8);
    g.fillCircle(20, 20, 9);
    g.generateTexture('steam', 36, 30);

    // Flour bomb
    g.clear();
    g.fillStyle(0xf0ead8); g.fillRect(0, 4, 30, 36);
    g.fillStyle(0xc8b898); g.fillRect(2, 0, 26, 6); // top fold
    g.fillStyle(0xa08858); g.fillRect(8, 14, 14, 12); // label
    g.generateTexture('flourBomb', 30, 40);

    // Hot sauce puddle
    g.clear();
    g.fillStyle(0xc83020);
    g.fillEllipse(30, 8, 60, 16);
    g.fillStyle(0xe84030);
    g.fillEllipse(30, 6, 40, 10);
    g.generateTexture('hotSauce', 60, 16);

    // Whisk hazard
    g.clear();
    g.fillStyle(0xc0c0c8);
    // Handle
    g.fillRect(4, 0, 6, 24);
    // Wire loops
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI;
      g.lineStyle(2, 0xb0b0b8);
      g.strokeEllipse(7, 34 + i * 2, 10 + i * 3, 18);
    }
    g.generateTexture('whisk', 28, 56);

    g.destroy();
  }

  create() {
    this.createTextures();

    const W = this.scale.width;
    const H = this.scale.height;
    const FLOOR_Y = H - COUNTER_HEIGHT;

    this.FLOOR_Y = FLOOR_Y;
    this.W = W;
    this.H = H;
    this.songTime = 0;
    this.songDuration = SONG_DURATION_FALLBACK;
    this.lives = 5;
    this.score = 0;
    this.currentSection = 'intro';
    this.lastLyricIdx = -1;
    this.lastSectionIdx = -1;
    this.gameOver = false;
    this.storyItemsSpawned = new Set();
    this.hazardTimer = 0;

    // ── Background layers (parallax) ──
    this.cameras.main.setBackgroundColor(sectionPalettes.intro.bg);

    // Wall tile layer (slow parallax)
    this.wallTiles = this.add.tileSprite(0, 0, W, FLOOR_Y, '__DEFAULT')
      .setOrigin(0, 0).setScrollFactor(0).setAlpha(0);
    // We'll draw wall lines manually via a simple rectangle
    this.wallBg = this.add.rectangle(W / 2, FLOOR_Y / 2, W, FLOOR_Y, sectionPalettes.intro.wall)
      .setScrollFactor(0).setDepth(-10);

    // Background kitchen objects (parallax 0.2–0.4)
    this.bgGroup = this.add.group();
    this.buildBackgroundObjects(FLOOR_Y);

    // ── Counter surface ──
    this.counterBg = this.add.rectangle(WORLD_WIDTH / 2, FLOOR_Y + COUNTER_HEIGHT / 2,
      WORLD_WIDTH, COUNTER_HEIGHT, sectionPalettes.intro.counter).setDepth(0);
    // Counter edge highlight
    this.counterEdge = this.add.rectangle(WORLD_WIDTH / 2, FLOOR_Y + 3,
      WORLD_WIDTH, 6, 0xffffff).setAlpha(0.08).setDepth(0);

    // ── Platforms (static physics) ──
    this.platforms = this.physics.add.staticGroup();

    // Ground
    const ground = this.add.rectangle(WORLD_WIDTH / 2, FLOOR_Y + COUNTER_HEIGHT / 2,
      WORLD_WIDTH, COUNTER_HEIGHT, sectionPalettes.intro.counter).setVisible(false);
    this.physics.add.existing(ground, true);
    this.groundBody = ground;

    // Kitchen-item platforms — procedurally placed across entire world
    const platKeys = ['cuttingBoard', 'book', 'tin'];
    const platHeights = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
    for (let x = 300; x < WORLD_WIDTH - 200; x += 280 + Math.random() * 220) {
      const key = platKeys[Math.floor(Math.random() * platKeys.length)];
      const h = platHeights[Math.floor(Math.random() * platHeights.length)];
      const p = this.platforms.create(x, FLOOR_Y - h, key);
      p.refreshBody();
      p.body.checkCollision.down = false;
      p.body.checkCollision.left = false;
      p.body.checkCollision.right = false;
    }

    // ── Player ──
    this.player = this.physics.add.sprite(200, FLOOR_Y - 60, 'chef0');
    this.player.setCollideWorldBounds(false);
    this.player.body.setGravityY(300);
    this.player.body.setSize(16, 40);
    this.player.body.setOffset(3, 12);
    this.player.setDepth(5);

    this.physics.add.collider(this.player, ground);
    this.physics.add.collider(this.player, this.platforms);

    // ── Camera — follows player ──
    this.cameras.main.startFollow(this.player, true, 0.08, 0.05);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, H);
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, H + 100);

    // ── Collectibles ──
    this.collectibles = this.physics.add.group();
    for (let x = 350; x < WORLD_WIDTH - 200; x += 300 + Math.random() * 200) {
      const slice = this.collectibles.create(x, FLOOR_Y - 40 - Math.random() * 50, 'tartSlice');
      slice.body.setAllowGravity(false);
      slice.body.setSize(18, 16);
      slice.setDepth(3);
      this.tweens.add({
        targets: slice, y: slice.y - 6, duration: 1200, yoyo: true,
        repeat: -1, ease: 'Sine.easeInOut',
      });
    }
    this.physics.add.overlap(this.player, this.collectibles, this.collectSlice, null, this);

    // ── Hazard groups ──
    this.hazards = this.physics.add.group();
    this.physics.add.overlap(this.player, this.hazards, this.hitPlayer, null, this);

    // ── Story items group (non-physics, just visual) ──
    this.storyGroup = this.add.group();

    // ── Cleaver group (special handling) ──
    this.cleavers = [];

    // ── Particle emitter ──
    this.crumbEmitter = this.add.particles(0, 0, 'crumb', {
      speed: { min: 30, max: 120 },
      angle: { min: 200, max: 340 },
      lifespan: 800,
      gravityY: 200,
      scale: { start: 1, end: 0 },
      emitting: false,
    });
    this.crumbEmitter.setDepth(6);

    // ── HUD (fixed to camera) ──
    this.livesText = this.add.text(W - 24, 16, this.getLivesString(), {
      fontFamily: 'Courier Prime, monospace', fontSize: '18px', color: '#c0392b',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    this.timerText = this.add.text(W / 2, 16, '0:00', {
      fontFamily: 'Courier Prime, monospace', fontSize: '14px', color: '#7a6a5a',
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);

    this.titleText = this.add.text(24, 16, 'Apple Tart', {
      fontFamily: 'Playfair Display, serif', fontStyle: 'italic',
      fontSize: '18px', color: '#e8c89a',
    }).setScrollFactor(0).setDepth(100);

    this.lyricText = this.add.text(W / 2, H * 0.45, '', {
      fontFamily: 'Playfair Display, serif', fontStyle: 'italic',
      fontSize: '24px', color: '#e8c89a', align: 'center',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100).setAlpha(0);

    this.sectionText = this.add.text(W / 2, H - 30, '', {
      fontFamily: 'Courier Prime, monospace', fontSize: '11px',
      color: '#3a2a1a', letterSpacing: 3,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

    this.scoreText = this.add.text(W / 2, 36, 'Score: 0', {
      fontFamily: 'Courier Prime, monospace', fontSize: '12px', color: '#5a4a3a',
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);

    // ── Input ──
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // ── Audio ──
    this.audioEl = document.createElement('audio');
    this.audioEl.src = 'Apple Tart PERC.mp3';
    this.audioEl.preload = 'auto';
    this.audioEl.addEventListener('loadedmetadata', () => {
      if (this.audioEl.duration && isFinite(this.audioEl.duration)) {
        this.songDuration = this.audioEl.duration;
      }
    });
    this.audioEl.addEventListener('ended', () => {
      if (!this.gameOver) this.endGame(true);
    });
    this.audioEl.play().catch(() => {
      // Autoplay blocked — play on first input
      this.input.once('pointerdown', () => this.audioEl.play());
      this.input.keyboard.once('keydown', () => this.audioEl.play());
    });

    // ── Invincibility state ──
    this.invincibleUntil = 0;
  }

  // ── Build parallax background objects ──
  buildBackgroundObjects(FLOOR_Y) {
    const H = this.H;

    // Cabinets (upper wall)
    for (let x = 100; x < WORLD_WIDTH; x += 500 + Math.random() * 400) {
      const cab = this.add.rectangle(x, -20, 180 + Math.random() * 80, H * 0.35, 0x2a1e14)
        .setOrigin(0, 0).setScrollFactor(0.2, 1).setDepth(-5).setAlpha(0.7);
      this.bgGroup.add(cab);
      // Cabinet handles
      const handleY = -20 + H * 0.35 - 30;
      const handleX = x + 40 + Math.random() * 40;
      const handle = this.add.rectangle(handleX, handleY, 24, 4, 0xc0b090)
        .setScrollFactor(0.2, 1).setDepth(-5).setAlpha(0.5);
      this.bgGroup.add(handle);
    }

    // Shelves across the back wall
    for (let x = 80; x < WORLD_WIDTH; x += 800 + Math.random() * 600) {
      const shelfW = 200 + Math.random() * 150;
      const shelfY = FLOOR_Y * 0.3 + Math.random() * (FLOOR_Y * 0.25);
      const shelf = this.add.rectangle(x, shelfY, shelfW, 6, 0x5a4030)
        .setScrollFactor(0.15, 1).setDepth(-6).setAlpha(0.6);
      this.bgGroup.add(shelf);
      // Bracket
      const bracket = this.add.rectangle(x - shelfW * 0.3, shelfY + 8, 4, 16, 0x4a3020)
        .setScrollFactor(0.15, 1).setDepth(-6).setAlpha(0.4);
      this.bgGroup.add(bracket);
    }

    // Bottles (on counter behind action)
    const colors = [0x2a4a20, 0x4a1a2a, 0x3a2a10, 0x1a3a4a, 0x6a3a10, 0x2a2a4a];
    for (let x = 200; x < WORLD_WIDTH; x += 300 + Math.random() * 400) {
      const c = Phaser.Utils.Array.GetRandom(colors);
      const bh = 80 + Math.random() * 80;
      const bw = 25 + Math.random() * 20;
      const bottle = this.add.rectangle(x, FLOOR_Y - bh - 20, bw, bh, c)
        .setScrollFactor(0.3, 1).setDepth(-4).setAlpha(0.4);
      this.bgGroup.add(bottle);
      // Bottle neck
      const neck = this.add.rectangle(x, FLOOR_Y - bh - 20 - bh / 2, bw * 0.4, bh * 0.4, c)
        .setScrollFactor(0.3, 1).setDepth(-4).setAlpha(0.35);
      this.bgGroup.add(neck);
    }

    // Jars
    for (let x = 350; x < WORLD_WIDTH; x += 500 + Math.random() * 400) {
      const jar = this.add.rectangle(x, FLOOR_Y - 80 - Math.random() * 40, 50, 70, 0xb4c8b4)
        .setScrollFactor(0.25, 1).setDepth(-4).setAlpha(0.2);
      this.bgGroup.add(jar);
      // Jar lid
      const lid = this.add.rectangle(x, jar.y - 38, 56, 8, 0xc0b090)
        .setScrollFactor(0.25, 1).setDepth(-4).setAlpha(0.2);
      this.bgGroup.add(lid);
    }

    // Hanging pots and pans (from top)
    const potColors = [0x4a4a52, 0x706860, 0x8a7868, 0x5a5a62];
    for (let x = 500; x < WORLD_WIDTH; x += 700 + Math.random() * 600) {
      const pc = Phaser.Utils.Array.GetRandom(potColors);
      const pw = 60 + Math.random() * 40;
      // Hook line
      const hookLine = this.add.rectangle(x, 20, 2, 50 + Math.random() * 30, 0x3a3a3a)
        .setScrollFactor(0.12, 1).setDepth(-7).setAlpha(0.3);
      this.bgGroup.add(hookLine);
      // Pan body
      const pan = this.add.rectangle(x, hookLine.y + 40, pw, 14, pc)
        .setScrollFactor(0.12, 1).setDepth(-7).setAlpha(0.35);
      this.bgGroup.add(pan);
      // Handle
      const panHandle = this.add.rectangle(x + pw / 2 + 18, pan.y, 36, 6, 0x3a2a1a)
        .setScrollFactor(0.12, 1).setDepth(-7).setAlpha(0.3);
      this.bgGroup.add(panHandle);
    }

    // Hanging utensil rack
    for (let x = 300; x < WORLD_WIDTH; x += 1200 + Math.random() * 800) {
      const rackW = 120 + Math.random() * 80;
      const rackY = 15;
      const rack = this.add.rectangle(x, rackY, rackW, 4, 0x5a5a5a)
        .setScrollFactor(0.1, 1).setDepth(-8).setAlpha(0.3);
      this.bgGroup.add(rack);
      // Utensils hanging from rack
      const numUtensils = 3 + Math.floor(Math.random() * 3);
      for (let u = 0; u < numUtensils; u++) {
        const ux = x - rackW / 2 + (u + 0.5) * (rackW / numUtensils);
        const uLen = 30 + Math.random() * 20;
        const utensil = this.add.rectangle(ux, rackY + uLen / 2 + 4, 4, uLen, 0x707070)
          .setScrollFactor(0.1, 1).setDepth(-8).setAlpha(0.25);
        this.bgGroup.add(utensil);
      }
    }

    // Tile pattern on wall (horizontal lines)
    for (let y = FLOOR_Y * 0.6; y < FLOOR_Y; y += 40 + Math.random() * 20) {
      const tileLine = this.add.rectangle(WORLD_WIDTH / 2, y, WORLD_WIDTH, 1, 0xffffff)
        .setScrollFactor(0.08, 1).setDepth(-9).setAlpha(0.03);
      this.bgGroup.add(tileLine);
    }

    // Stove/oven shapes (big dark blocks behind counter)
    for (let x = 1500; x < WORLD_WIDTH; x += 3000 + Math.random() * 2000) {
      const stoveW = 200 + Math.random() * 100;
      const stoveH = FLOOR_Y * 0.5;
      const stove = this.add.rectangle(x, FLOOR_Y - stoveH / 2 - 10, stoveW, stoveH, 0x1a1a1e)
        .setScrollFactor(0.18, 1).setDepth(-6).setAlpha(0.5);
      this.bgGroup.add(stove);
      // Burner circles
      for (let b = 0; b < 2; b++) {
        const burner = this.add.circle(
          x - stoveW * 0.2 + b * stoveW * 0.4,
          FLOOR_Y - stoveH + 40,
          20, 0x2a2a2e
        ).setScrollFactor(0.18, 1).setDepth(-6).setAlpha(0.4);
        this.bgGroup.add(burner);
      }
    }

    // Window shapes with faint light
    for (let x = 800; x < WORLD_WIDTH; x += 4000 + Math.random() * 3000) {
      const winW = 120 + Math.random() * 60;
      const winH = 100 + Math.random() * 40;
      const winY = FLOOR_Y * 0.15;
      const win = this.add.rectangle(x, winY, winW, winH, 0x1a2a3a)
        .setScrollFactor(0.1, 1).setDepth(-8).setAlpha(0.3);
      this.bgGroup.add(win);
      // Window glow
      const glow = this.add.rectangle(x, winY, winW - 10, winH - 10, 0x3a4a5a)
        .setScrollFactor(0.1, 1).setDepth(-8).setAlpha(0.15);
      this.bgGroup.add(glow);
      // Window crossbar
      const crossH = this.add.rectangle(x, winY, winW, 3, 0x2a1e14)
        .setScrollFactor(0.1, 1).setDepth(-8).setAlpha(0.3);
      this.bgGroup.add(crossH);
      const crossV = this.add.rectangle(x, winY, 3, winH, 0x2a1e14)
        .setScrollFactor(0.1, 1).setDepth(-8).setAlpha(0.3);
      this.bgGroup.add(crossV);
    }
  }

  // ── Update loop ──
  update(time, delta) {
    if (this.gameOver) return;

    const dt = delta / 1000;
    this.songTime = this.audioEl.currentTime || 0;

    // ── Section detection ──
    for (let i = sections.length - 1; i >= 0; i--) {
      if (this.songTime >= sections[i].t && this.lastSectionIdx !== i) {
        this.lastSectionIdx = i;
        this.currentSection = sections[i].name;
        if (sections[i].label) {
          this.sectionText.setText(sections[i].label);
          this.tweens.add({
            targets: this.sectionText, alpha: 0.6, duration: 300, yoyo: true,
            hold: 1500, ease: 'Sine.easeIn',
          });
        }
        // Tint shift
        const pal = sectionPalettes[this.currentSection];
        this.cameras.main.setBackgroundColor(pal.bg);
        this.wallBg.setFillStyle(pal.wall);
        this.counterBg.setFillStyle(pal.counter);
        break;
      }
    }

    // ── Lyrics ──
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (this.songTime >= lyrics[i].t && this.lastLyricIdx < i) {
        this.lastLyricIdx = i;
        this.showLyric(lyrics[i].text);
        break;
      }
    }

    // ── Story items ──
    for (const item of storyItems) {
      if (this.songTime >= item.t && !this.storyItemsSpawned.has(item.t)) {
        this.storyItemsSpawned.add(item.t);
        this.spawnStoryItem(item);
      }
    }

    // ── Timer display ──
    const m = Math.floor(this.songTime / 60);
    const s = Math.floor(this.songTime % 60).toString().padStart(2, '0');
    const tm = Math.floor(this.songDuration / 60);
    const ts = Math.floor(this.songDuration % 60).toString().padStart(2, '0');
    this.timerText.setText(`${m}:${s} / ${tm}:${ts}`);

    // ── Player movement ──
    const onGround = this.player.body.blocked.down || this.player.body.touching.down;
    const speed = this.currentSection === 'comatose' ? 180 : 260;
    const jumpForce = this.currentSection === 'comatose' ? -280 : -400;

    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      this.player.body.setVelocityX(-speed);
      this.player.setFlipX(true);
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      this.player.body.setVelocityX(speed);
      this.player.setFlipX(false);
    } else {
      this.player.body.setVelocityX(this.player.body.velocity.x * 0.85);
    }

    if ((this.cursors.up.isDown || this.cursors.space.isDown || this.wasd.up.isDown) && onGround) {
      this.player.body.setVelocityY(jumpForce);
    }

    // Animations
    if (!onGround) {
      this.player.anims.play('chef-jump', true);
    } else if (Math.abs(this.player.body.velocity.x) > 20) {
      this.player.anims.play('chef-walk', true);
    } else {
      this.player.anims.play('chef-idle', true);
    }

    // Respawn if fallen
    if (this.player.y > this.H + 100) {
      this.player.setPosition(this.player.x, this.FLOOR_Y - 60);
      this.player.body.setVelocity(0, 0);
      this.damagePlayer();
    }

    // ── Invincibility flicker ──
    if (time < this.invincibleUntil) {
      this.player.setAlpha(Math.floor(time / 80) % 2 === 0 ? 0.3 : 1);
    } else {
      this.player.setAlpha(1);
    }

    // ── Spawn hazards ──
    this.hazardTimer -= dt;
    const intensity = this.getIntensity();
    if (intensity > 0 && this.hazardTimer <= 0) {
      this.hazardTimer = (2.5 - intensity * 0.5) + Math.random() * 1.0;
      this.spawnHazard();
    }

    // ── Update cleavers ──
    for (let i = this.cleavers.length - 1; i >= 0; i--) {
      const c = this.cleavers[i];
      c.timer += dt;
      if (c.phase === 'warning') {
        c.shadow.setAlpha(Math.min(0.5, c.timer / c.warnTime * 0.5));
        if (c.timer >= c.warnTime) {
          c.phase = 'slamming'; c.timer = 0;
          c.sprite.setVisible(true);
          c.sprite.setPosition(c.targetX, this.FLOOR_Y - 120);
          this.tweens.add({
            targets: c.sprite, y: this.FLOOR_Y - 40, duration: 120,
            ease: 'Cubic.easeIn',
            onComplete: () => {
              c.phase = 'holding'; c.timer = 0;
              // Check damage
              const bounds = c.sprite.getBounds();
              const pBounds = this.player.getBounds();
              if (Phaser.Geom.Rectangle.Overlaps(bounds, pBounds)) {
                this.damagePlayer();
              }
              // Impact flash
              this.cameras.main.shake(80, 0.005);
            }
          });
        }
      } else if (c.phase === 'holding') {
        if (c.timer >= 0.6) {
          c.phase = 'retracting'; c.timer = 0;
          this.tweens.add({
            targets: c.sprite, y: -100, duration: 400,
            ease: 'Cubic.easeOut',
            onComplete: () => {
              c.sprite.destroy();
              c.shadow.destroy();
              this.cleavers.splice(this.cleavers.indexOf(c), 1);
            }
          });
        }
      }
    }

    // ── Clean up off-screen hazards ──
    const camLeft = this.cameras.main.scrollX - 300;
    const camRight = this.cameras.main.scrollX + this.W + 300;
    this.hazards.children.each(h => {
      if (h.active && (h.x < camLeft || h.x > camRight)) h.destroy();
    });

    // ── Win condition ──
    if (this.songTime >= this.songDuration - 0.5) {
      this.endGame(true);
    }
  }

  // ── Hazard intensity per section ──
  getIntensity() {
    const s = this.currentSection;
    if (s === 'chorus1')  return 1.0;
    if (s === 'chorus2')  return 1.3;
    if (s === 'verse2')   return 0.7;
    if (s === 'comatose') return 0.5;
    if (s === 'outro')    return 0;
    return 0.4;
  }

  // ── Spawn hazard ──
  spawnHazard() {
    const roll = Math.random();
    const s = this.currentSection;
    if (s === 'chorus1' || s === 'chorus2') {
      // Choruses: more dangerous mix
      if (roll < 0.30) this.spawnRollingFruit();
      else if (roll < 0.50) this.spawnCleaver();
      else if (roll < 0.65) this.spawnSteamJet();
      else if (roll < 0.80) this.spawnFlourBomb();
      else if (roll < 0.90) this.spawnHotSaucePuddle();
      else this.spawnSwingingWhisk();
    } else if (s === 'comatose') {
      // Comatose: eerie, mostly steam and puddles
      if (roll < 0.50) this.spawnSteamJet();
      else this.spawnHotSaucePuddle();
    } else {
      // Verses/intro: standard mix
      if (roll < 0.40) this.spawnRollingFruit();
      else if (roll < 0.60) this.spawnCleaver();
      else if (roll < 0.75) this.spawnSteamJet();
      else if (roll < 0.90) this.spawnFlourBomb();
      else this.spawnHotSaucePuddle();
    }
  }

  spawnRollingFruit() {
    const isApple = Math.random() > 0.4;
    const key = isApple ? 'apple' : 'raspberry';
    const fromRight = Math.random() > 0.35;
    const spawnX = fromRight
      ? this.cameras.main.scrollX + this.W + 60
      : this.cameras.main.scrollX - 60;
    const speed = fromRight ? -(100 + Math.random() * 80) : (100 + Math.random() * 80);

    const fruit = this.hazards.create(spawnX, this.FLOOR_Y - (isApple ? 20 : 14), key);
    fruit.body.setVelocityX(speed);
    fruit.body.setAllowGravity(false);
    fruit.body.setSize(isApple ? 24 : 16, isApple ? 24 : 16); // forgiving hitbox
    fruit.setDepth(4);
    // Spin
    this.tweens.add({
      targets: fruit, angle: fromRight ? -360 : 360,
      duration: 1500, repeat: -1, ease: 'Linear',
    });
  }

  spawnCleaver() {
    const targetX = this.player.x + (Math.random() - 0.3) * 120;
    const shadow = this.add.ellipse(targetX, this.FLOOR_Y - 2, 60, 16, 0x000000, 0)
      .setDepth(1);
    const sprite = this.add.image(targetX, -100, 'cleaver').setVisible(false).setDepth(6);

    this.cleavers.push({
      targetX, shadow, sprite,
      phase: 'warning', timer: 0,
      warnTime: 1.2,
    });
  }

  // ── Steam jet — rises from counter, blocks path briefly ──
  spawnSteamJet() {
    const spawnX = this.player.x + 200 + Math.random() * 300;
    const numPuffs = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numPuffs; i++) {
      this.time.delayedCall(i * 200, () => {
        const puff = this.hazards.create(
          spawnX + (Math.random() - 0.5) * 30,
          this.FLOOR_Y - 10,
          'steam'
        );
        puff.body.setVelocityY(-80 - Math.random() * 60);
        puff.body.setVelocityX((Math.random() - 0.5) * 40);
        puff.body.setAllowGravity(false);
        puff.setAlpha(0.6);
        puff.setDepth(4);
        puff.body.setSize(20, 16);
        this.tweens.add({
          targets: puff, alpha: 0, scaleX: 2, scaleY: 2,
          duration: 1200, ease: 'Sine.easeOut',
          onComplete: () => puff.destroy(),
        });
      });
    }
  }

  // ── Flour bomb — falls from above, explodes into damage cloud ──
  spawnFlourBomb() {
    const targetX = this.player.x + (Math.random() - 0.3) * 250;
    const bomb = this.hazards.create(targetX, -40, 'flourBomb');
    bomb.body.setVelocityY(180 + Math.random() * 80);
    bomb.body.setVelocityX((Math.random() - 0.5) * 60);
    bomb.body.setAllowGravity(false);
    bomb.setDepth(5);
    bomb.body.setSize(22, 30);
    // Destroy when it hits counter level and create a dust burst
    this.time.delayedCall(1800, () => {
      if (bomb.active) {
        // Spawn dust burst (visual only, damage was from the bag itself)
        this.crumbEmitter.emitParticleAt(bomb.x, this.FLOOR_Y - 10, 8);
        this.cameras.main.shake(60, 0.003);
        bomb.destroy();
      }
    });
  }

  // ── Hot sauce puddle — sits on counter, slows and damages ──
  spawnHotSaucePuddle() {
    const spawnX = this.player.x + 300 + Math.random() * 400;
    const puddle = this.hazards.create(spawnX, this.FLOOR_Y - 8, 'hotSauce');
    puddle.body.setAllowGravity(false);
    puddle.body.setImmovable(true);
    puddle.body.setSize(40, 10);
    puddle.setDepth(1);
    puddle.setAlpha(0.8);
    // Puddle fades away after some time
    this.tweens.add({
      targets: puddle, alpha: 0, duration: 5000, delay: 3000,
      ease: 'Sine.easeIn',
      onComplete: () => puddle.destroy(),
    });
  }

  // ── Swinging whisk — pendulum motion from above ──
  spawnSwingingWhisk() {
    const pivotX = this.player.x + 200 + Math.random() * 300;
    const pivotY = 0;
    const ropeLen = this.FLOOR_Y * 0.6;

    // Rope visual (just a line)
    const rope = this.add.rectangle(pivotX, pivotY + ropeLen / 2, 2, ropeLen, 0x808080)
      .setDepth(3).setAlpha(0.4);

    const whisk = this.hazards.create(pivotX, pivotY + ropeLen, 'whisk');
    whisk.body.setAllowGravity(false);
    whisk.body.setSize(20, 40);
    whisk.setDepth(5);

    // Pendulum swing
    const amplitude = 120;
    const startAngle = Math.random() * Math.PI;
    this.tweens.add({
      targets: { angle: startAngle },
      angle: startAngle + Math.PI * 2,
      duration: 2000,
      repeat: 2,
      ease: 'Linear',
      onUpdate: (tween) => {
        const a = tween.getValue();
        whisk.x = pivotX + Math.sin(a) * amplitude;
        whisk.y = pivotY + ropeLen + (1 - Math.cos(a)) * 20;
        rope.setPosition((pivotX + whisk.x) / 2, (pivotY + whisk.y) / 2);
        rope.setAngle(Phaser.Math.RadToDeg(Math.atan2(whisk.x - pivotX, whisk.y - pivotY)) * -1);
      },
      onComplete: () => {
        rope.destroy();
        if (whisk.active) whisk.destroy();
      },
    });
  }

  // ── Story item spawning ──
  spawnStoryItem(item) {
    const spawnX = this.player.x + this.W * 0.6 + Math.random() * 200;
    const textureMap = {
      appleTart: 'storyAppleTart',
      raspberryCrumble: 'storyRaspberryCrumble',
      coal: 'storyCoal',
      fructose: 'storyFructose',
      chardonnay: 'storyChardonnay',
      tobacco: 'storyTobacco',
      knife: 'storyKnife',
      lactose: 'storyLactose',
      bed: 'storyBed',
      meat: 'storyMeat',
    };
    const key = textureMap[item.type];
    if (!key) return;

    const obj = this.add.image(spawnX, this.FLOOR_Y - 10, key).setOrigin(0.5, 1).setDepth(2);
    this.storyGroup.add(obj);

    // Label above item
    const label = this.add.text(spawnX, this.FLOOR_Y - obj.height - 16, item.label, {
      fontFamily: 'Playfair Display, serif', fontStyle: 'italic',
      fontSize: '14px', color: '#e8c89a',
    }).setOrigin(0.5).setAlpha(0).setDepth(2);

    // Fade in label when player gets close (via tween distance check in update would be complex,
    // so use a simple zone overlap)
    const zone = this.add.zone(spawnX, this.FLOOR_Y - 30, 200, 120);
    this.physics.add.existing(zone, true);
    this.physics.add.overlap(this.player, zone, () => {
      if (label.alpha < 0.9) {
        this.tweens.add({ targets: label, alpha: 1, duration: 400 });
      }
    });
  }

  // ── Collectible ──
  collectSlice(player, slice) {
    this.crumbEmitter.emitParticleAt(slice.x, slice.y, 10);
    slice.destroy();
    this.score += 100;
    this.scoreText.setText(`Score: ${this.score}`);
    if (this.lives < 5) {
      this.lives++;
      this.livesText.setText(this.getLivesString());
    }
  }

  // ── Damage ──
  hitPlayer(player, hazard) {
    if (this.time.now < this.invincibleUntil) return;
    hazard.destroy();
    this.damagePlayer();
  }

  damagePlayer() {
    if (this.time.now < this.invincibleUntil) return;
    this.lives--;
    this.livesText.setText(this.getLivesString());
    this.invincibleUntil = this.time.now + 2500;
    this.crumbEmitter.emitParticleAt(this.player.x, this.player.y, 12);
    this.cameras.main.shake(150, 0.008);

    if (this.lives <= 0) this.endGame(false);
  }

  // ── Lyrics ──
  showLyric(text) {
    this.lyricText.setText(text);
    this.tweens.killTweensOf(this.lyricText);
    this.lyricText.setAlpha(0);
    this.tweens.add({
      targets: this.lyricText,
      alpha: { from: 0, to: 0.85 },
      y: { from: this.H * 0.47, to: this.H * 0.45 },
      duration: 500, ease: 'Sine.easeOut',
      hold: 2500,
      yoyo: true,
    });
  }

  // ── End ──
  endGame(won) {
    this.gameOver = true;
    this.audioEl.pause();
    this.scene.start('End', {
      won,
      score: this.score,
      time: this.songTime,
      songDuration: this.songDuration,
    });
  }

  getLivesString() {
    return this.lives > 0 ? '\u2665 '.repeat(this.lives).trim() : '\u2715';
  }
}

// ─────────────────────────────────────────────
//  END SCENE
// ─────────────────────────────────────────────
class EndScene extends Phaser.Scene {
  constructor() { super('End'); }

  create(data) {
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    this.cameras.main.setBackgroundColor('#0a0705');

    const title = data.won ? 'FIN.' : 'Swept off the counter.';
    const m = Math.floor(data.time / 60);
    const s = Math.floor(data.time % 60).toString().padStart(2, '0');
    const sub = data.won
      ? `Score: ${data.score}`
      : `Survived ${m}:${s}`;

    this.add.text(cx, cy - 40, title, {
      fontFamily: 'Playfair Display, serif', fontStyle: 'italic',
      fontSize: '40px', color: '#e8c89a',
    }).setOrigin(0.5);

    this.add.text(cx, cy + 10, sub, {
      fontFamily: 'Courier Prime, monospace', fontSize: '14px', color: '#7a6a5a',
    }).setOrigin(0.5);

    const btn = this.add.text(cx, cy + 60, '[ PLAY AGAIN ]', {
      fontFamily: 'Courier Prime, monospace', fontSize: '18px',
      color: '#7a6a5a', letterSpacing: 3,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setColor('#e8c89a'));
    btn.on('pointerout', () => btn.setColor('#7a6a5a'));
    btn.on('pointerdown', () => this.scene.start('Game'));
  }
}

// ─────────────────────────────────────────────
//  PHASER CONFIG
// ─────────────────────────────────────────────
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: document.body,
  backgroundColor: '#0a0705',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      debug: false,
    },
  },
  scene: [BootScene, GameScene, EndScene],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

new Phaser.Game(config);
