/** Caminhos dos SVGs de marca. Nomes: public/brand/MANIFEST.md (fonte da verdade). */
export const logo = {
  horizontal: {
    onAubergineWarmWhite: "/brand/hive-horizontal-warm-white.svg",
    onAubergineAmber: "/brand/hive-horizontal-amber.svg",
    onLightTwoTone: "/brand/hive-horizontal-two-tone.svg",
    /** viewBox do SVG: 1738.4 × 619.3 */
    ratio: 1738.4 / 619.3,
  },
  symbol: {
    onAubergineWarmWhite: "/brand/hive-symbol-warm-white.svg",
    onAubergineAmber: "/brand/hive-symbol-amber.svg",
    onLightTwoTone: "/brand/hive-symbol-two-tone.svg",
    /** viewBox do SVG: 999 × 953 */
    ratio: 999 / 953,
  },
} as const;
