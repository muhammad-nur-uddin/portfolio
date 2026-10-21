// Part 1: constants, face texture, material, lighting, per-cube anim state.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
const p = "src/components/sections/skills-canvas.tsx";
let s = fs.readFileSync(p, "utf8");
let ok = 0;
const miss = [];
function rep(oldText, newText) {
  if (s.includes(oldText)) { s = s.replace(oldText, newText); ok++; }
  else { miss.push(JSON.stringify(oldText.slice(0, 70))); }
}

// 1a. Spin constants replace the old 10 rad/s speed; soften face shades.
rep(
`const AUTO_ROTATION_SPEED = 10;`,
`// --- Idle spin tuning -------------------------------------------------------
// Slow, premium feel: one full revolution takes 20-24s, deterministic per
// skill, with a phase offset so the row never marches in lockstep.
const TWO_PI = Math.PI * 2;
const SPIN_DURATION_MIN = 20; // s per 360 deg revolution
const SPIN_DURATION_MAX = 24; // s per 360 deg revolution
// Fixed subtle downward tilt so front + side faces read while spinning.
const BASE_TILT_X_DEG = 14;
// Pointer drag: radians of manual rotation per pixel of pointer travel.
const DRAG_SENSITIVITY = 0.005;
const DRAG_RX_CAP = (60 * Math.PI) / 180; // clamp manual X tilt
// Release inertia: total drag -> release angular velocity factor.
const INERTIA_FACTOR = 3;
// Frame-time guard: clamp dt so background-tab throttling cannot cause jumps.
const MAX_FRAME_DT = 0.05;`
);

rep(
`const FACE_SHADES: Record<string, number> = {
  front: 1.0,
  back: 0.5,
  right: 0.85,
  left: 0.45,
  top: 1.25,
  bottom: 0.3,
};`,
`// Subtle per-face shading for depth; kept gentle so no face goes near-black
// (lighting supplies the rest of the depth cue).
const FACE_SHADES: Record<string, number> = {
  front: 1.0,
  back: 0.72,
  right: 0.88,
  left: 0.62,
  top: 1.0,
  bottom: 0.5,
};`
);

// 1b. createFaceTexture: anisotropy param + sRGB color space.
rep(
`  logoImages: Map<string, HTMLImageElement>,
  size: number
): THREE.Texture | null {`,
`  logoImages: Map<string, HTMLImageElement>,
  size: number,
  maxAnisotropy: number
): THREE.Texture | null {`
);
rep(
`  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;`,
`  const texture = new THREE.CanvasTexture(canvas);
  // Canvas pixels are authored in sRGB; declare it so three.js color-manages
  // the logo/brand colors correctly (otherwise faces render muddy).
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;`
);

// 1c. Module helpers: deterministic per-skill hash + anim state factory.
rep(
`interface SkillsCanvasProps {`,
`// Deterministic per-skill hash -> stable spin duration / start phase.
function hashId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Per-cube animation state. The RAF loop is the SOLE writer of mesh.rotation:
// it composes base (carousel tilt + keyboard) + idle spin phase + drag offsets.
// Pausing/resuming only stops advancing the phase, so orientation never snaps.
function makeAnimState(id: string) {
  const h = hashId(id);
  const duration =
    SPIN_DURATION_MIN + ((h % 1000) / 1000) * (SPIN_DURATION_MAX - SPIN_DURATION_MIN);
  return {
    phase: (((h >>> 8) % 1000) / 1000) * TWO_PI, // varied start orientation
    speed: TWO_PI / duration,
    baseRx: (BASE_TILT_X_DEG * Math.PI) / 180,
    baseRy: 0,
    dragRx: 0,
    dragRy: 0,
  };
}

interface SkillsCanvasProps {`
);

// 1d. createCube: anisotropy param, white base color when mapped.
rep(
`function createCube(
  scene: THREE.Scene,
  skill: Skill,
  logoImages: Map<string, HTMLImageElement>
): THREE.Mesh {`,
`function createCube(
  scene: THREE.Scene,
  skill: Skill,
  logoImages: Map<string, HTMLImageElement>,
  maxAnisotropy: number
): THREE.Mesh {`
);
rep(
`      logoImages,
      FACE_TEXTURE_SIZE
    );`,
`      logoImages,
      FACE_TEXTURE_SIZE,
      maxAnisotropy
    );`
);
rep(
`      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(skill.color),
        map: texture,
        transparent: texture ? true : false,
        alphaTest: texture ? 0.5 : 0,
        roughness: 0.6,
        metalness: 0.1,
        flatShading: false,
      });`,
`      // White base color when a texture is present: the map already carries
      // the (shaded) brand color, and \`color\` MULTIPLIES the map — tinting
      // it with the brand color squared the hue and turned dark brands
      // (black/navy) almost pitch black. Fallback keeps the raw brand color.
      const material = new THREE.MeshStandardMaterial({
        color: texture ? 0xffffff : new THREE.Color(skill.color),
        map: texture,
        roughness: 0.55,
        metalness: 0,
        flatShading: false,
      });`
);

fs.writeFileSync(p, s);
console.log("part1 applied:", ok, "missed:", miss.length);
for (const m of miss) console.log("  MISS " + m);
