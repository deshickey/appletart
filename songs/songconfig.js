// ── Song config factory ──
// Returns a complete song config with sensible defaults.
// Songs with just audio will be playable immediately.

export function makeSongConfig(overrides) {
  return {
    id: overrides.id,
    title: overrides.title,
    subtitle: overrides.subtitle || '',
    audioSrc: overrides.audioSrc,
    durationFallback: overrides.durationFallback || 180,

    sections: overrides.sections || [
      { t: 0, name: 'main', label: '' },
    ],

    lyrics: overrides.lyrics || [],

    storyItems: overrides.storyItems || [],

    sectionPalettes: overrides.sectionPalettes || {
      main: { bg: 0x1a1410, wall: 0x2a1e14, counter: 0x8b7355, accent: 0xc8961e },
    },

    // Section name → intensity (0–2). Missing sections fall back to defaultIntensity.
    intensityMap: overrides.intensityMap || {},
    defaultIntensity: overrides.defaultIntensity ?? 0.4,

    // Section name → array of { type, weight } for weighted hazard selection.
    hazardMixes: overrides.hazardMixes || {},

    // Called in createTextures() to register song-specific story item textures.
    registerTextures: overrides.registerTextures || null,

    // Maps storyItem type → texture key.
    storyTextureMap: overrides.storyTextureMap || {},
  };
}
