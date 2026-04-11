// ── Song timeline data ──
// All times in seconds. The game reads these to spawn items, hazards, and lyrics.

export const SONG_DURATION_FALLBACK = 206;

// Lyrics that appear on screen
export const lyrics = [
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
];

// Song sections — drive color palette and hazard intensity
export const sections = [
  { t: 0,   name: 'intro',    label: '' },
  { t: 12,  name: 'verse1',   label: 'verse i' },
  { t: 66,  name: 'chorus1',  label: 'chorus' },
  { t: 94,  name: 'verse2',   label: 'verse ii' },
  { t: 125, name: 'chorus2',  label: 'chorus' },
  { t: 146, name: 'comatose', label: 'chaos' },
  { t: 183, name: 'outro',    label: 'fin' },
];

// Timed story items that appear on the counter at specific song moments
// These are big set-piece objects the player encounters as they run
export const storyItems = [
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
];

// Color palettes per section
export const sectionPalettes = {
  intro:    { bg: 0x1a1410, wall: 0x2a1e14, counter: 0x8b7355, accent: 0xc8961e },
  verse1:   { bg: 0x1e1610, wall: 0x2e2218, counter: 0x9b8365, accent: 0xdaa520 },
  chorus1:  { bg: 0x2a1208, wall: 0x3a1a10, counter: 0xa07050, accent: 0xe86030 },
  verse2:   { bg: 0x1a1410, wall: 0x2a1e14, counter: 0x8b7355, accent: 0xc8961e },
  chorus2:  { bg: 0x301008, wall: 0x401810, counter: 0xa06848, accent: 0xf04020 },
  comatose: { bg: 0x0a0e18, wall: 0x141e30, counter: 0x3a4058, accent: 0x4070c0 },
  outro:    { bg: 0x0a0a0a, wall: 0x1a1614, counter: 0x3a3430, accent: 0x605040 },
};
