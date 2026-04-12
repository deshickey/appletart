import { makeSongConfig } from './songconfig.js';

export default makeSongConfig({
  id: 'apple-tart',
  title: 'Apple Tart',
  subtitle: 'survive the kitchen',
  audioSrc: 'Apple Tart PERC.mp3',
  durationFallback: 206,

  sections: [
    { t: 0,   name: 'intro',    label: '' },
    { t: 12,  name: 'verse1',   label: 'verse i' },
    { t: 66,  name: 'chorus1',  label: 'chorus' },
    { t: 94,  name: 'verse2',   label: 'verse ii' },
    { t: 125, name: 'chorus2',  label: 'chorus' },
    { t: 146, name: 'comatose', label: 'chaos' },
    { t: 183, name: 'outro',    label: 'fin' },
  ],

  lyrics: [
    { t: 13,  text: "We fell apart like a fresh apple tart" },
    { t: 19,  text: "Raspberry crumble you made of my heart" },
    { t: 25,  text: "What did you need to know" },
    { t: 32,  text: "What did you ever need to know" },
    { t: 38,  text: "It was always the same, and there's no one to blame" },
    { t: 44,  text: "A black lump of coal is all that remains" },
    { t: 50,  text: "What did you need to know" },
    { t: 57,  text: "What did you ever really need to know" },
    { t: 65,  text: "You overdosed" },
    { t: 68,  text: "On fructose" },
    { t: 72,  text: "Chardonnay" },
    { t: 74,  text: "Tobacco" },
    { t: 94,  text: "You needed a man more manly than I" },
    { t: 100, text: "So you quickly disposed of the softer weak guy" },
    { t: 106, text: "What did you need to know" },
    { t: 113, text: "Why did you ever need to 🙀 know" },
    { t: 125, text: "You overdosed" },
    { t: 128, text: "On fructose" },
    { t: 131, text: "Chardonnay" },
    { t: 134, text: "Tobacco" },
    { t: 136, text: "And then you mend it all with lactose" },
    { t: 140, text: "You stayed in bed" },
    { t: 146, text: "Comatose" },
    { t: 183, text: "There was nothing more for me to give" },
    { t: 189, text: "You had a taste for meat and not something sweet" },
    { t: 194, text: "A carnivorous way to live" },
    { t: 198, text: "Is a popular alternative" },
  ],

  storyItems: [
    { t: 12,  type: 'appleTart',         label: 'Apple Tart' },
    { t: 18,  type: 'raspberryCrumble',  label: 'Raspberry Crumble' },
    { t: 43,  type: 'coal',              label: 'Lump of Coal' },
    { t: 66,  type: 'fructose',          label: 'Fructose' },
    { t: 73,  type: 'chardonnay',        label: 'Chardonnay' },
    { t: 75,  type: 'tobacco',           label: 'Tobacco' },
    { t: 100, type: 'softGuy',           label: 'The Soft Guy' },
    { t: 136, type: 'lactose',           label: 'Lactose' },
    { t: 146, type: 'bed',               label: 'The Bed' },
    { t: 189, type: 'meat',              label: 'The Meat' },
  ],

  sectionPalettes: {
    intro:    { bg: 0x1a1410, wall: 0x2a1e14, counter: 0x8b7355, accent: 0xc8961e },
    verse1:   { bg: 0x1e1610, wall: 0x2e2218, counter: 0x9b8365, accent: 0xdaa520 },
    chorus1:  { bg: 0x2a1208, wall: 0x3a1a10, counter: 0xa07050, accent: 0xe86030 },
    verse2:   { bg: 0x1a1410, wall: 0x2a1e14, counter: 0x8b7355, accent: 0xc8961e },
    chorus2:  { bg: 0x301008, wall: 0x401810, counter: 0xa06848, accent: 0xf04020 },
    comatose: { bg: 0x0a0e18, wall: 0x141e30, counter: 0x3a4058, accent: 0x4070c0 },
    outro:    { bg: 0x0a0a0a, wall: 0x1a1614, counter: 0x3a3430, accent: 0x605040 },
  },

  intensityMap: {
    chorus1: 1.0,
    chorus2: 1.3,
    verse2: 0.7,
    comatose: 0.5,
    outro: 0,
  },

  hazardMixes: {
    chorus1: [
      { type: 'rollingFruit', weight: 0.30 },
      { type: 'cleaver',      weight: 0.20 },
      { type: 'steamJet',     weight: 0.15 },
      { type: 'flourBomb',    weight: 0.15 },
      { type: 'hotSauce',     weight: 0.10 },
      { type: 'whisk',        weight: 0.10 },
    ],
    chorus2: [
      { type: 'rollingFruit', weight: 0.30 },
      { type: 'cleaver',      weight: 0.20 },
      { type: 'steamJet',     weight: 0.15 },
      { type: 'flourBomb',    weight: 0.15 },
      { type: 'hotSauce',     weight: 0.10 },
      { type: 'whisk',        weight: 0.10 },
    ],
    comatose: [
      { type: 'steamJet',  weight: 0.50 },
      { type: 'hotSauce',  weight: 0.50 },
    ],
  },

  storyTextureMap: {
    appleTart: 'storyAppleTart',
    raspberryCrumble: 'storyRaspberryCrumble',
    coal: 'storyCoal',
    fructose: 'storyFructose',
    chardonnay: 'storyChardonnay',
    tobacco: 'storyTobacco',
    softGuy: 'storysoftGuy',
    lactose: 'storyLactose',
    bed: 'storyBed',
    meat: 'storyMeat',
  },

  registerTextures(scene) {
    const g = scene.add.graphics();

    // Giant apple tart story item
    g.clear();
    g.fillStyle(0xc8b898); g.fillEllipse(60, 55, 62, 18);
    g.fillStyle(0xdaa520); g.fillEllipse(60, 48, 55, 22);
    g.fillStyle(0x8b4513); g.fillEllipse(60, 44, 45, 18);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      g.fillStyle(i % 2 === 0 ? 0xa0c040 : 0x80a030);
      g.fillEllipse(60 + Math.cos(a) * 30, 46 + Math.sin(a) * 10, 12, 7);
    }
    g.generateTexture('storyAppleTart', 120, 70);

    // Raspberry crumble story item
    g.clear();
    g.fillStyle(0xd4a060); g.fillEllipse(50, 40, 52, 16);
    g.fillStyle(0xc89030); g.fillEllipse(50, 36, 45, 14);
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
    g.fillRect(16, 60, 28, 50);
    g.fillRect(22, 10, 16, 52);
    g.fillStyle(0xe8dcc8); g.fillRect(18, 72, 24, 20);
    g.generateTexture('storyChardonnay', 60, 110);

    // Fructose — sugar bag
    g.clear();
    g.fillStyle(0xf0e8d0); g.fillRect(0, 0, 50, 60);
    g.fillStyle(0xe05020);
    g.fillRect(5, 15, 40, 20);
    g.generateTexture('storyFructose', 50, 60);

    // Tobacco — cigarette pack
    g.clear();
    g.fillStyle(0xc82020); g.fillRect(0, 0, 40, 50);
    g.fillStyle(0xf0e0c0); g.fillRect(0, 0, 40, 15);
    g.fillStyle(0xe8d0a0); g.fillRect(8, 4, 5, 12);
    g.generateTexture('storyTobacco', 40, 50);

    // Skinny nerd — the "softer weak guy" disposed of (man in a bin)
    g.clear();
    g.fillStyle(0x505050); g.fillRect(10, 20, 40, 40);
    g.fillStyle(0x606060); g.fillRect(8, 18, 44, 6);
    g.fillStyle(0x404040); g.fillRect(14, 56, 8, 4); g.fillRect(38, 56, 8, 4);
    g.fillStyle(0xf0c8a0); g.fillCircle(30, 10, 8);
    g.fillStyle(0x303030); g.fillCircle(27, 8, 2); g.fillCircle(33, 8, 2);
    g.fillStyle(0x303030); g.fillRect(25, 8, 10, 1);
    g.fillStyle(0x8b6040); g.fillRect(22, 2, 16, 4);
    g.fillStyle(0x70a0d0); g.fillRect(24, 18, 12, 6);
    g.generateTexture('storysoftGuy', 60, 60);

    // Lactose — milk carton
    g.clear();
    g.fillStyle(0xf0f0f0); g.fillRect(0, 10, 40, 50);
    g.fillStyle(0x4090e0); g.fillRect(0, 30, 40, 20);
    g.fillStyle(0xf0f0f0);
    g.beginPath(); g.moveTo(0, 10); g.lineTo(20, 0); g.lineTo(40, 10); g.closePath(); g.fill();
    g.generateTexture('storyLactose', 40, 60);

    // Bed — tiny bed
    g.clear();
    g.fillStyle(0x5a3a20); g.fillRect(0, 30, 80, 10);
    g.fillStyle(0xe8e0d0); g.fillRect(4, 14, 72, 18);
    g.fillStyle(0x7090c0); g.fillRect(4, 10, 72, 8);
    g.fillStyle(0xf0e8d8); g.fillRect(6, 8, 20, 10);
    g.fillStyle(0x4a2a14); g.fillRect(0, 0, 6, 40);
    g.generateTexture('storyBed', 80, 42);

    // Meat — steak on plate
    g.clear();
    g.fillStyle(0xe8e0d8); g.fillEllipse(40, 36, 42, 14);
    g.fillStyle(0x5a1a08); g.fillEllipse(40, 30, 30, 12);
    g.fillStyle(0x8a2a10); g.fillEllipse(38, 28, 22, 9);
    g.lineStyle(2, 0x2a0a04);
    g.lineBetween(28, 22, 26, 34); g.lineBetween(38, 22, 36, 34); g.lineBetween(48, 22, 46, 34);
    g.generateTexture('storyMeat', 80, 50);

    g.destroy();
  },
});
