"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Skill } from "@/lib/skills";
import { assertSkillLogoMappings, PATHS } from "@/components/ui/skill-logos";

const CARD_W = 168;
const GAP = 28;
const PITCH = CARD_W + GAP;
const MAX_TILT = 12;
const SCALE_STEP = 0.045;
const MIN_SCALE = 0.82;
const EDGE_GUTTER = 36;

const CUBE_SIZE = 72;
const CORNER_RADIUS = 7;
const SEGMENTS = 5;
const FACE_TEXTURE_SIZE = 256;
const LOGO_SIZE_RATIO = 0.62;
const MAX_ANISOTROPY = 4;

// RoundedBoxGeometry extends BoxGeometry, whose groups are emitted in this
// order: +X (right), -X (left), +Y (top), -Y (bottom), +Z (front), -Z (back).
// The material array MUST follow that exact order, otherwise every logo is
// painted on the wrong face (verified against three's BoxGeometry buildPlane
// order and by probing the generated groups).
const FACE_ORDER = ["right", "left", "top", "bottom", "front", "back"] as const;
type FaceName = (typeof FACE_ORDER)[number];

// Subtle per-face shading for depth; kept gentle so no face goes near-black
// (lighting supplies the rest of the depth cue).
const FACE_SHADES: Record<FaceName, number> = {
  right: 0.92,
  left: 0.8,
  top: 0.97,
  bottom: 0.74,
  front: 1.0,
  back: 0.86,
};

// --- Idle spin tuning -------------------------------------------------------
const AUTO_ROTATION_SPEED = (Math.PI * 2) / 22; // one revolution per ~22s
const SPIN_PERIOD_VARIATION = 0.12; // +/- 12% per cube, stays coordinated
const BASE_TILT_X_DEG = 7; // subtle, fixed tilt so the top face reads

// Pointer drag: radians of manual rotation per pixel of pointer travel.

// Select a high-contrast ink colour from an RGB or hex face colour.
// Supports both CSS colour forms returned by canvas implementations.
function contrastInkColor(faceColor: string): string {
  const parsed = parseColor(faceColor);
  if (!parsed) return "#FFFFFF";
  const [r, g, b] = parsed.map((value) => value / 255) as [
    number,
    number,
    number,
  ];
  const linear = (channel: number) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  const luminance =
    0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
  return luminance >= 0.43 ? "#0B1220" : "#FFFFFF";
}

// Parses "#rrggbb", "rgb(r,g,b)", or "rgba(r,g,b,a)" into channels.
function parseColor(color: string): [number, number, number] | null {
  const trimmed = color.trim();
  const hex = /^#?([0-9a-f]{6})$/i.exec(trimmed);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const rgb = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(trimmed);
  if (rgb) {
    return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  }
  return null;
}

function shadeColor(color: string, factor: number): string {
  const c = parseColor(color);
  if (!c) return color;
  const r = Math.round(Math.min(255, c[0] * factor));
  const g = Math.round(Math.min(255, c[1] * factor));
  const b = Math.round(Math.min(255, c[2] * factor));
  return `rgb(${r}, ${g}, ${b})`;
}

// Very dark official brand colours disappear against the navy page. Keep
// the brand hue where it exists; only pure/near-black surfaces get a subtle
// slate lift. Bright colours, including Prisma paper-white, remain unchanged.
function readableBrandColor(hex: string): string {
  const channels = parseColor(hex);
  if (!channels) return hex;
  const [r, g, b] = channels;
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  if (luminance >= 0.12) return hex;

  const maxChannel = Math.max(r, g, b);
  if (maxChannel < 12) return "#263144";

  // Scale near-black chromatic colours up without shifting their hue.
  const targetMax = 54;
  const scale = targetMax / maxChannel;
  return `rgb(${Math.round(Math.min(255, r * scale))}, ${Math.round(
    Math.min(255, g * scale),
  )}, ${Math.round(Math.min(255, b * scale))})`;
}

function svgViewBoxRatio(viewBox: string | undefined): number | null {
  if (!viewBox) return null;
  const numbers = viewBox
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  if (
    numbers.length !== 4 ||
    numbers.some((number) => !Number.isFinite(number))
  ) {
    return null;
  }
  const width = numbers[2];
  const height = numbers[3];
  return width > 0 && height > 0 ? width / height : null;
}

function buildLogoSvg(key: string): string | null {
  const asset = PATHS[key];
  if (!asset) return null;
  const viewBox = asset.viewBox ?? "0 0 24 24";
  const ratio = asset.aspectRatio ?? svgViewBoxRatio(viewBox) ?? 1;
  const width = Math.max(64, Math.round(FACE_TEXTURE_SIZE * ratio));
  const height = FACE_TEXTURE_SIZE;

  if (asset.svg) {
    // `svg` is trusted, local inner SVG markup. It is only authored in this
    // registry; no user-provided strings are inserted into SVG markup.
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}">${asset.svg}</svg>`;
  }

  const inner = asset.d
    ? `<path fill-rule="evenodd" d="${asset.d}"/>`
    : (asset.markup ?? "");
  const modeAttributes =
    asset.mode === "original" ? "" : 'fill="#FFFFFF" color="#FFFFFF"';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}" ${modeAttributes}>${inner}</svg>`;
}

function preloadLogoImages(): Promise<Map<string, HTMLImageElement>> {
  return new Promise((resolve) => {
    const images = new Map<string, HTMLImageElement>();
    const keys = Object.keys(PATHS);
    if (keys.length === 0) {
      resolve(images);
      return;
    }

    let settled = 0;
    const finishOne = () => {
      settled += 1;
      if (settled === keys.length) resolve(images);
    };

    for (const key of keys) {
      const svgString = buildLogoSvg(key);
      if (!svgString) {
        console.error(`[Skills] Missing logo asset for key: ${key}`);
        finishOne();
        continue;
      }
      const blob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        images.set(key, img);
        URL.revokeObjectURL(url);
        finishOne();
      };
      img.onerror = () => {
        console.error(`[Skills] Failed to load SVG texture for logo: ${key}`);
        URL.revokeObjectURL(url);
        finishOne();
      };
      img.src = url;
    }
  });
}

function createFaceTexture(
  skillColor: string,
  shade: number,
  logoKey: string,
  logoImages: Map<string, HTMLImageElement>,
  size: number,
  maxAnisotropy: number,
): THREE.Texture | null {
  const asset = PATHS[logoKey];
  const img = logoImages.get(logoKey);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = shadeColor(readableBrandColor(skillColor), shade);
  ctx.fillRect(0, 0, size, size);

  if (!asset || !img) {
    // Fail visibly as a neutral outline rather than hiding a broken mapping
    // behind a text abbreviation. The development console also reports the key.
    console.error(`[Skills] No loaded visual logo for key: ${logoKey}`);
    ctx.strokeStyle = contrastInkColor(ctx.fillStyle as string);
    ctx.lineWidth = Math.max(3, size * 0.025);
    ctx.beginPath();
    ctx.roundRect(
      size * 0.29,
      size * 0.29,
      size * 0.42,
      size * 0.42,
      size * 0.06,
    );
    ctx.stroke();
    return createCanvasTexture(canvas, maxAnisotropy);
  }

  const viewBoxRatio = svgViewBoxRatio(asset.viewBox);
  const imageRatio =
    asset.aspectRatio ??
    (img.naturalWidth > 0 && img.naturalHeight > 0
      ? img.naturalWidth / img.naturalHeight
      : (viewBoxRatio ?? 1));
  const safeRatio =
    Number.isFinite(imageRatio) && imageRatio > 0 ? imageRatio : 1;
  // Square symbols retain the established face size. Horizontal wordmarks fit
  // inside a wider safe area without being stretched into a square.
  const logoSizeRatio = asset.sizeRatio ?? LOGO_SIZE_RATIO;

  const maxWidth = size * (safeRatio > 1.15 ? 0.78 : logoSizeRatio);
  const maxHeight = size * (safeRatio < 0.78 ? 0.76 : logoSizeRatio);
  const drawWidth = Math.min(maxWidth, maxHeight * safeRatio);
  const drawHeight = drawWidth / safeRatio;
  const x = (size - drawWidth) / 2;
  const y = (size - drawHeight) / 2;

  if (asset.mode === "original") {
    // Subtle brand-colour glow, without recolouring the original SVG.
    if (asset.glowColor) {
      ctx.save();
      ctx.shadowColor = asset.glowColor;
      ctx.shadowBlur = size * 0.035;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.drawImage(img, x, y, drawWidth, drawHeight);
      ctx.restore();
    }

    // Keep the original artwork crisp and unchanged.
    ctx.drawImage(img, x, y, drawWidth, drawHeight);
  } else {
    // For monochrome brand paths and concept pictograms, tint only the opaque
    // logo pixels. This preserves holes/transparent regions and also supports
    // stroke-based icons without filling the entire path's bounding box.
    const buffer = document.createElement("canvas");
    buffer.width = size;
    buffer.height = size;
    const bctx = buffer.getContext("2d");
    if (!bctx) return createCanvasTexture(canvas, maxAnisotropy);
    bctx.drawImage(img, x, y, drawWidth, drawHeight);
    bctx.globalCompositeOperation = "source-in";
    bctx.fillStyle = contrastInkColor(ctx.fillStyle as string);
    bctx.fillRect(0, 0, size, size);
    ctx.drawImage(buffer, 0, 0);
  }

  return createCanvasTexture(canvas, maxAnisotropy);
}

function createCanvasTexture(
  canvas: HTMLCanvasElement,
  maxAnisotropy: number,
): THREE.Texture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

// A cube is a two-node transform so that layout rotation and the cube's own
// rotation stay independent:
//   pivot (Group)  -> position, layout tilt (Y), scale
//     mesh (Mesh)  -> the cube's own spin (Y) and manual tilt (X)
// This keeps the idle spin and manual drags from being overwritten whenever
// the carousel re-lays out the cubes.
type CubeEntry = {
  pivot: THREE.Group;
  mesh: THREE.Mesh;
  /** Per-cube spin speed multiplier, derived from the id so it is stable. */
  spinFactor: number;
  /** Accumulated idle spin around Y, in radians. */
  spinY: number;
  /** Pointer-drag rotation around X, in radians. */
  manualX: number;
  /** Pointer-drag rotation around Y, in radians. */
  manualY: number;
  /** Last applied React-owned rotation (degrees), used to detect a reset. */
  lastRx: number;
  lastRy: number;
};

// Releases the GPU resources owned by a cube (geometry, materials, textures).
function disposeCube(entry: CubeEntry) {
  entry.mesh.geometry.dispose();
  const materials = entry.mesh.material;
  if (Array.isArray(materials)) {
    materials.forEach((mat) => {
      const map = (mat as THREE.MeshStandardMaterial).map;
      if (map) map.dispose();
      mat.dispose();
    });
  }
}

function createCube(
  scene: THREE.Scene,
  skill: Skill,
  logoImages: Map<string, HTMLImageElement>,
  maxAnisotropy: number,
): CubeEntry {
  const geometry = new RoundedBoxGeometry(
    CUBE_SIZE,
    CUBE_SIZE,
    CUBE_SIZE,
    SEGMENTS,
    CORNER_RADIUS,
  );

  const materials: THREE.Material[] = [];

  // Material index must match RoundedBoxGeometry's group order exactly.
  for (const face of FACE_ORDER) {
    const shade = FACE_SHADES[face];
    const texture = createFaceTexture(
      skill.color,
      shade,
      skill.logoKey,
      logoImages,
      FACE_TEXTURE_SIZE,
      maxAnisotropy,
    );

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xffffff),
      map: texture,
      transparent: false,
      roughness: 0.55,
      metalness: 0.0,
      flatShading: false,
    });

    materials.push(material);
  }

  const mesh = new THREE.Mesh(geometry, materials);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  mesh.position.set(0, 0, 0);
  mesh.rotation.set(0, 0, 0);

  // A fixed, slight tilt so the top face reads and the cube never looks
  // perfectly flat-on. Applied to the pivot (layout) node.
  const pivot = new THREE.Group();
  pivot.add(mesh);
  pivot.rotation.x = (BASE_TILT_X_DEG * Math.PI) / 180;

  scene.add(pivot);

  // Stable per-cube spin factor derived from the id hash: keeps the cubes
  // visually coordinated (same slow speed) without perfect lockstep.
  let hash = 0;
  for (let i = 0; i < skill.id.length; i += 1) {
    hash = (hash * 31 + skill.id.charCodeAt(i)) % 1000;
  }
  const spinFactor = 1 + ((hash / 1000) * 2 - 1) * SPIN_PERIOD_VARIATION;

  return {
    pivot,
    mesh,
    spinFactor,
    spinY: 0,
    manualX: 0,
    manualY: 0,
    lastRx: 0,
    lastRy: 0,
  };
}

/**
 * Sizes the camera so that ONE WORLD UNIT EQUALS ONE CSS PIXEL at the
 * stage's Z = 0 plane. This is what keeps the WebGL cube and its DOM label
 * perfectly aligned: with a perspective camera, a cube 196px off-centre is
 * magnified by the camera distance and no longer sits over its own label.
 * An orthographic camera removes that coupling entirely; the carousel's
 * depth is conveyed by the per-card scale falloff, the layout tilt, and the
 * per-face shading instead.
 */
function resizeCamera(
  camera: THREE.OrthographicCamera,
  width: number,
  height: number,
) {
  if (width <= 0 || height <= 0) return;
  camera.left = -width / 2;
  camera.right = width / 2;
  camera.top = height / 2;
  camera.bottom = -height / 2;
  camera.near = -1000;
  camera.far = 1000;
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
}

interface SkillsCanvasProps {
  filteredSkills: Skill[];
  position: number;
  activeIndex: number;
  count: number;
  iconRotations: Record<string, { rx: number; ry: number }>;
  rotatingIconId: string | null;
  iconSpinPaused: Record<string, boolean>;
  reducedMotion: boolean;
  stageWidth: number;
}

export function SkillsCanvas(props: SkillsCanvasProps) {
  const {
    filteredSkills,
    position,
    activeIndex,
    count,
    iconRotations,
    rotatingIconId,
    iconSpinPaused,
    reducedMotion,
    stageWidth,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const cubeMeshesRef = useRef<Map<string, CubeEntry>>(new Map());
  const logoImagesRef = useRef<Map<string, HTMLImageElement> | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  const positionRef = useRef(position);
  const iconRotationsRef = useRef(iconRotations);
  const rotatingIconIdRef = useRef(rotatingIconId);
  const iconSpinPausedRef = useRef(iconSpinPaused);
  const reducedMotionRef = useRef(reducedMotion);
  const filteredSkillsRef = useRef(filteredSkills);
  const [imagesReady, setImagesReady] = useState(false);

  useEffect(() => {
    positionRef.current = position;
    iconRotationsRef.current = iconRotations;
    rotatingIconIdRef.current = rotatingIconId;
    iconSpinPausedRef.current = iconSpinPaused;
    reducedMotionRef.current = reducedMotion;
    filteredSkillsRef.current = filteredSkills;
  });

  useEffect(() => {
    let cancelled = false;
    preloadLogoImages().then((images) => {
      if (!cancelled) {
        logoImagesRef.current = images;
        setImagesReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const initialW = container.clientWidth;
    const initialH = container.clientHeight;
    if (initialW > 0 && initialH > 0) {
      renderer.setSize(initialW, initialH);
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1000, 1000);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
    fillLight.position.set(-3, -2, 4);
    scene.add(fillLight);

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    // Size the camera immediately so the first frame is correct and
    // raycasting works even before the logo textures finish loading.
    resizeCamera(camera, container.clientWidth, container.clientHeight);

    const meshes = cubeMeshesRef.current;

    return () => {
      meshes.forEach((entry) => disposeCube(entry));
      meshes.clear();
      logoImagesRef.current = null;
      setImagesReady(false);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  const handleResize = useCallback(() => {
    const container = containerRef.current;
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    resizeCamera(camera, width, height);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const updateCubeTransforms = useCallback(() => {
    const scene = sceneRef.current;
    const meshes = cubeMeshesRef.current;
    const images = logoImagesRef.current;
    if (!scene || !images) return;

    const halfStage = stageWidth / 2;
    const maxFitDelta =
      stageWidth > 0
        ? Math.max(
            0,
            Math.floor((halfStage - CARD_W / 2 - EDGE_GUTTER) / PITCH),
          )
        : 2;
    const missingLeft = Math.max(0, maxFitDelta - positionRef.current);
    const missingRight = Math.max(
      0,
      maxFitDelta - (count - 1 - positionRef.current),
    );
    const balanceShift = (missingRight - missingLeft) * (PITCH / 2);

    const currentIds = new Set(meshes.keys());
    const newIds = new Set(filteredSkillsRef.current.map((s) => s.id));

    for (const id of currentIds) {
      if (!newIds.has(id)) {
        const entry = meshes.get(id)!;
        scene.remove(entry.pivot);
        disposeCube(entry);
        meshes.delete(id);
      }
    }

    for (const skill of filteredSkillsRef.current) {
      if (!meshes.has(skill.id)) {
        meshes.set(skill.id, createCube(scene, skill, images, MAX_ANISOTROPY));
      }
    }

    for (const skill of filteredSkillsRef.current) {
      const entry = meshes.get(skill.id);
      if (!entry) continue;
      const index = filteredSkillsRef.current.findIndex(
        (s) => s.id === skill.id,
      );
      if (index < 0) continue;
      const delta = index - positionRef.current;
      const abs = Math.abs(delta);
      const hidden = abs > maxFitDelta;
      entry.pivot.visible = !hidden;
      const x = delta * PITCH + balanceShift;
      // The cube stays on the stage's Z = 0 plane so its on-screen X matches
      // the DOM label below it exactly. Depth is conveyed by the per-card
      // scale falloff, the layout tilt, and the lighting instead of by a
      // perspective shift that would desynchronise cube and label.
      const scale = Math.max(MIN_SCALE, Math.min(1, 1 - abs * SCALE_STEP));
      const tilt = Math.max(-1, Math.min(1, delta)) * MAX_TILT;
      // Layout lives on the pivot so the cube's own spin/manual rotation
      // (on the mesh) is never overwritten by a re-layout.
      entry.pivot.position.set(x, 0, 0);
      entry.pivot.rotation.y = (tilt * Math.PI) / 180;
      entry.pivot.scale.set(scale, scale, scale);
    }
  }, [count, stageWidth]);

  useEffect(() => {
    // Catch missing mappings when a category changes instead of silently
    // rendering abbreviation text or a misleading placeholder cube.
    assertSkillLogoMappings(filteredSkills.map((skill) => skill.logoKey));
    updateCubeTransforms();
  }, [
    position,
    count,
    activeIndex,
    filteredSkills,
    stageWidth,
    updateCubeTransforms,
  ]);

  useEffect(() => {
    if (imagesReady) updateCubeTransforms();
  }, [imagesReady, updateCubeTransforms]);

  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const dragRef = useRef<{
    id: string;
    entry: CubeEntry;
    startX: number;
    startY: number;
    startManualX: number;
    startManualY: number;
  } | null>(null);
  const inertiaRef = useRef<Record<string, { vx: number; vy: number } | null>>(
    {},
  );

  // RAF render loop. Live scene state is read through refs, so the loop is
  // created once inside this mount-only effect and never re-created.
  useEffect(() => {
    const loop = (time: number) => {
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      const meshes = cubeMeshesRef.current;
      if (!scene || !camera || !renderer) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const paused = iconSpinPausedRef.current;
      const draggingId = dragRef.current ? dragRef.current.id : null;
      const reduced = reducedMotionRef.current;

      for (const [id, entry] of meshes) {
        // Idle spin pauses while a React-level rotation gesture owns the cube,
        // while a drag targets it, or while a post-drag pause is active.
        // Under prefers-reduced-motion the cubes never auto-spin.
        const spinning =
          !reduced &&
          rotatingIconIdRef.current !== id &&
          !paused[id] &&
          draggingId !== id;
        if (spinning) {
          entry.spinY += AUTO_ROTATION_SPEED * entry.spinFactor * dt;
        }

        const inertia = inertiaRef.current[id];
        if (inertia) {
          if (Math.abs(inertia.vx) > 0.01 || Math.abs(inertia.vy) > 0.01) {
            entry.manualX = Math.max(
              -Math.PI / 2,
              Math.min(Math.PI / 2, entry.manualX + inertia.vy * dt),
            );
            entry.manualY += inertia.vx * dt;

            inertia.vx *= 0.95;
            inertia.vy *= 0.95;
          } else {
            inertiaRef.current[id] = null;
          }
        }

        // React-owned rotation (keyboard arrows / reset) is applied on top of
        // the accumulated spin + manual drag, and resets clear the manual
        // offsets so the cube returns to its resting orientation.
        const rot = iconRotationsRef.current[id] ?? { rx: 0, ry: 0 };
        if (rot.rx !== entry.lastRx || rot.ry !== entry.lastRy) {
          if (rot.rx === 0 && rot.ry === 0) {
            entry.manualX = 0;
            entry.manualY = 0;
          }
          entry.lastRx = rot.rx;
          entry.lastRy = rot.ry;
        }
        const reactX = (rot.rx * Math.PI) / 180;
        const reactY = (rot.ry * Math.PI) / 180;

        entry.mesh.rotation.x = entry.manualX + reactX;
        entry.mesh.rotation.y = entry.spinY + entry.manualY + reactY;
      }

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const onCanvasPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      const camera = cameraRef.current;
      if (!container || !camera) return;

      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);

      // Only visible cubes can be grabbed. Three's raycaster ignores
      // Object3D.visible, so cubes parked outside the stage would still
      // register hits and steal the drag from the cube under the pointer.
      const entries = Array.from(cubeMeshesRef.current.entries()).filter(
        ([, entry]) => entry.pivot.visible,
      );
      const intersects = raycasterRef.current.intersectObjects(
        entries.map(([, entry]) => entry.mesh),
      );
      if (intersects.length === 0) return;

      const hit = entries.find(
        ([, entry]) => entry.mesh === intersects[0].object,
      );
      if (!hit) return;
      const [id, entry] = hit;
      dragRef.current = {
        id,
        entry,
        startX: e.clientX,
        startY: e.clientY,
        startManualX: entry.manualX,
        startManualY: entry.manualY,
      };
      // Capture the pointer so the drag keeps tracking the cube, and stop
      // the event from reaching the stage: dragging a cube must NOT also
      // drag the carousel.
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Pointer capture is best-effort (e.g. the pointer was already
        // released); the drag still works via the move handler.
      }
      e.preventDefault();
      e.stopPropagation();
    },
    [],
  );

  const onCanvasPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      const sensitivity = 0.006;
      drag.entry.manualX = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, drag.startManualX - dy * sensitivity),
      );
      drag.entry.manualY = drag.startManualY + dx * sensitivity;
      // Apply immediately for responsive feedback (the RAF loop keeps it going).
      drag.entry.mesh.rotation.x = drag.entry.manualX;
      drag.entry.mesh.rotation.y = drag.entry.spinY + drag.entry.manualY;
    },
    [],
  );

  const onCanvasPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      if (Math.abs(dx) > 12 || Math.abs(dy) > 12) {
        const sens = 0.4;
        inertiaRef.current[drag.id] = { vx: dx * sens, vy: dy * sens };
      }
      dragRef.current = null;
    },
    [],
  );

  const onCanvasPointerCancel = useCallback(() => {
    dragRef.current = null;
  }, []);

  return (
    <div
      ref={containerRef}
      className="skills-canvas"
      onPointerDown={onCanvasPointerDown}
      onPointerMove={onCanvasPointerMove}
      onPointerUp={onCanvasPointerUp}
      onPointerCancel={onCanvasPointerCancel}
    />
  );
}
