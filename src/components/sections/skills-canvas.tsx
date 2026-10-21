"use client";

import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Skill } from "@/lib/skills";
import { PATHS } from "@/components/ui/skill-logos";

const CARD_W = 168;
const GAP = 28;
const PITCH = CARD_W + GAP;
const MAX_TILT = 12;
const DEPTH = 26;
const SCALE_STEP = 0.045;
const MIN_SCALE = 0.82;
const EDGE_GUTTER = 36;

const CUBE_SIZE = 64;
const CORNER_RADIUS = 4;
const SEGMENTS = 4;
const FACE_TEXTURE_SIZE = 256;
const LOGO_SIZE_RATIO = 0.6;
const MAX_ANISOTROPY = 4;

// Subtle per-face shading for depth; kept gentle so no face goes near-black
// (lighting supplies the rest of the depth cue).
const FACE_SHADES: Record<string, number> = {
  front: 1.0,
  back: 0.85,
  right: 0.92,
  left: 0.80,
  top: 1.0,
  bottom: 0.75,
};

// --- Idle spin tuning -------------------------------------------------------
const AUTO_ROTATION_SPEED = (Math.PI * 2) / 22; // one revolution per ~22s

// Pointer drag: radians of manual rotation per pixel of pointer travel.

function shadeColor(hex: string, factor: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = Math.round(Math.min(255, ((n >> 16) & 255)) * factor);
  const g = Math.round(Math.min(255, ((n >> 8) & 255)) * factor);
  const b = Math.round(Math.min(255, (n & 255)) * factor);
  return `rgb(${r}, ${g}, ${b})`;
}

function preloadLogoImages(): Promise<Map<string, HTMLImageElement>> {
  return new Promise((resolve) => {
    const images = new Map<string, HTMLImageElement>();
    const keys = Object.keys(PATHS);
    let loaded = 0;
    for (const key of keys) {
      const { d } = PATHS[key];
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF"><path d="${d}" /></svg>`;
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        images.set(key, img);
        loaded += 1;
        URL.revokeObjectURL(url);
        if (loaded === keys.length) resolve(images);
      };
      img.onerror = () => {
        loaded += 1;
        if (loaded === keys.length) resolve(images);
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
  maxAnisotropy: number
): THREE.Texture | null {
  const img = logoImages.get(logoKey);
  if (!img) return null;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = shadeColor(skillColor, shade);
  ctx.fillRect(0, 0, size, size);
  const logoSize = size * LOGO_SIZE_RATIO;
  const x = (size - logoSize) / 2;
  const y = (size - logoSize) / 2;
  ctx.drawImage(img, x, y, logoSize, logoSize);
  const texture = new THREE.CanvasTexture(canvas);
  // Canvas pixels are authored in sRGB; declare it so three.js color-manages
  // the logo/brand colors correctly (otherwise faces render muddy).
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}


function createCube(
  scene: THREE.Scene,
  skill: Skill,
  logoImages: Map<string, HTMLImageElement>,
  maxAnisotropy: number
): THREE.Mesh {
  const geometry = new RoundedBoxGeometry(
    CUBE_SIZE,
    CUBE_SIZE,
    CUBE_SIZE,
    SEGMENTS,
    CORNER_RADIUS
  );

  const materials: THREE.Material[] = [];
  const faceOrder = ["front", "back", "right", "left", "top", "bottom"];

  for (const face of faceOrder) {
    const shade = FACE_SHADES[face];
    const texture = createFaceTexture(
      skill.color,
      shade,
      skill.logoKey,
      logoImages,
      FACE_TEXTURE_SIZE,
      maxAnisotropy
    );

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xffffff),
      map: texture,
      transparent: false,
      roughness: 0.45,
      metalness: 0.08,
      flatShading: false,
    });

    materials.push(material);
  }

  const mesh = new THREE.Mesh(geometry, materials);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  mesh.position.set(0, 0, 0);
  mesh.rotation.set(0, 0, 0);

  scene.add(mesh);
  return mesh;
}

function resizeCamera(
  camera: THREE.PerspectiveCamera,
  width: number,
  height: number
) {
  if (width <= 0 || height <= 0) return;
  const fov = 60;
  const cameraZ = height / (2 * Math.tan((fov * Math.PI) / 360));
  camera.position.set(0, 0, cameraZ);
  camera.lookAt(0, 0, 0);
  camera.aspect = width / height;
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
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cubeMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const logoImagesRef = useRef<Map<string, HTMLImageElement> | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  const positionRef = useRef(position);
  const iconRotationsRef = useRef(iconRotations);
  const rotatingIconIdRef = useRef(rotatingIconId);
  const iconSpinPausedRef = useRef(iconSpinPaused);
  const reducedMotionRef = useRef(reducedMotion);
  const filteredSkillsRef = useRef(filteredSkills);

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
      if (!cancelled) logoImagesRef.current = images;
    });
    return () => { cancelled = true; };
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
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 2000);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.7);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-3, -2, 4);
    scene.add(fillLight);

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    const meshes = cubeMeshesRef.current;
    const buildCubes = () => {
      const images = logoImagesRef.current;
      if (!images) return;
      for (const skill of filteredSkillsRef.current) {
        meshes.set(skill.id, createCube(scene, skill, images, MAX_ANISOTROPY));
      }
      resizeCamera(camera, container.clientWidth, container.clientHeight);
    };

    if (logoImagesRef.current) {
      buildCubes();
    } else {
      const check = setInterval(() => {
        if (logoImagesRef.current) {
          clearInterval(check);
          buildCubes();
        }
      }, 16);
    };

    return () => {
      meshes.forEach((mesh) => {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            if ((mat as THREE.MeshStandardMaterial).map) {
              (mat as THREE.MeshStandardMaterial).map!.dispose();
            }
            mat.dispose();
          });
        }
      });
      meshes.clear();
      logoImagesRef.current = null;
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
        ? Math.max(0, Math.floor((halfStage - CARD_W / 2 - EDGE_GUTTER) / PITCH))
        : 2;
    const missingLeft = Math.max(0, maxFitDelta - positionRef.current);
    const missingRight = Math.max(0, maxFitDelta - (count - 1 - positionRef.current));
    const balanceShift = (missingRight - missingLeft) * (PITCH / 2);

    const currentIds = new Set(meshes.keys());
    const newIds = new Set(filteredSkillsRef.current.map((s) => s.id));

    for (const id of currentIds) {
      if (!newIds.has(id)) {
        const mesh = meshes.get(id)!;
        scene.remove(mesh);
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            if ((mat as THREE.MeshStandardMaterial).map) {
              (mat as THREE.MeshStandardMaterial).map!.dispose();
            }
            mat.dispose();
          });
        }
        meshes.delete(id);
      }
    }

    for (const skill of filteredSkillsRef.current) {
      if (!meshes.has(skill.id)) {
        meshes.set(skill.id, createCube(scene, skill, images, MAX_ANISOTROPY));
      }
    }

    for (const skill of filteredSkillsRef.current) {
      const mesh = meshes.get(skill.id);
      if (!mesh) continue;
      const index = filteredSkillsRef.current.findIndex((s) => s.id === skill.id);
      if (index < 0) continue;
      const delta = index - positionRef.current;
      const abs = Math.abs(delta);
      const hidden = abs > maxFitDelta;
      mesh.visible = !hidden;
      const x = delta * PITCH + balanceShift;
      const z = -Math.min(abs, 2) * DEPTH;
      const scale = Math.max(MIN_SCALE, Math.min(1, 1 - abs * SCALE_STEP));
      const tilt = Math.max(-1, Math.min(1, delta)) * MAX_TILT;
      mesh.position.set(x, 0, z);
      mesh.rotation.y = (tilt * Math.PI) / 180;
      mesh.scale.set(scale, scale, scale);
      const rot = iconRotationsRef.current[skill.id] ?? { rx: 0, ry: 0 };
      const isRotating = rotatingIconIdRef.current === skill.id;
      if (isRotating || rot.rx !== 0 || rot.ry !== 0) {
        mesh.rotation.x = (rot.rx * Math.PI) / 180;
        mesh.rotation.y += (rot.ry * Math.PI) / 180;
      } else {
        mesh.rotation.x = 0;
      }
    }
  }, [count, stageWidth]);

  useEffect(() => {
    updateCubeTransforms();
  }, [position, count, activeIndex, filteredSkills.length, stageWidth, updateCubeTransforms]);


  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const dragRef = useRef<{
    id: string;
    mesh: THREE.Mesh;
    startX: number;
    startY: number;
    startRx: number;
    startRy: number;
  } | null>(null);
  const inertiaRef = useRef<Record<string, { vx: number; vy: number } | null>>({});

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
      for (const [id, mesh] of meshes) {
        // Idle spin pauses while a React-level rotation gesture owns the cube,
        // while a drag targets it, or while a post-drag pause is active.
        if (rotatingIconIdRef.current !== id && !paused[id] && draggingId !== id) {
          mesh.rotation.y += AUTO_ROTATION_SPEED * dt;
        }
        const inertia = inertiaRef.current[id];
        if (inertia) {
          if (Math.abs(inertia.vx) > 0.01 || Math.abs(inertia.vy) > 0.01) {
            mesh.rotation.x = Math.max(
              -Math.PI / 2,
              Math.min(Math.PI / 2, mesh.rotation.x + inertia.vy * dt),
            );
            mesh.rotation.y += inertia.vx * dt;

            inertia.vx *= 0.95;
            inertia.vy *= 0.95;
          } else {
            inertiaRef.current[id] = null;
          }
        }
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

      const entries = Array.from(cubeMeshesRef.current.entries());
      const intersects = raycasterRef.current.intersectObjects(
        entries.map(([, mesh]) => mesh),
      );
      if (intersects.length === 0) return;

      const hit = entries.find(([, mesh]) => mesh === intersects[0].object);
      if (!hit) return;
      const [id, mesh] = hit;
      dragRef.current = {
        id,
        mesh,
        startX: e.clientX,
        startY: e.clientY,
        startRx: mesh.rotation.x,
        startRy: mesh.rotation.y,
      };
      e.preventDefault();
    },
    [],
  );

  const onCanvasPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    const sensitivity = 0.002;
    drag.mesh.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, drag.startRx - dy * sensitivity)
    );
    drag.mesh.rotation.y = drag.startRy + dx * sensitivity;
  }, []);

  const onCanvasPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (Math.abs(dx) > 12 || Math.abs(dy) > 12) {
      const sens = 0.4;
      inertiaRef.current[drag.id] = { vx: dx * sens, vy: dy * sens };
    }
    dragRef.current = null;
  }, []);

  const onCanvasPointerCancel = useCallback(() => {
    dragRef.current = null;
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      onPointerDown={onCanvasPointerDown}
      onPointerMove={onCanvasPointerMove}
      onPointerUp={onCanvasPointerUp}
      onPointerCancel={onCanvasPointerCancel}
      style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, zIndex: 1 }}
    />
  );
}



