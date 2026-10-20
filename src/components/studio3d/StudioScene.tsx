import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  createMicrophoneRig,
  createMixingConsole,
  createSynthesisWorkstation,
  createAcousticShell,
} from './proceduralModels';

interface StudioSceneProps {
  scrollProgress: number; // 0.0 to 1.0
  activeSceneIndex: number;
}

// Module-scope reusable math helpers (Zero Garbage Collection)
const _cameraTarget = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3();
const _desiredPos = new THREE.Vector3();

import heroVaultEntranceImg from '../../assets/images/hero_vault_entrance_v2_1792444694845.jpg';
import heroVocalBoothImg from '../../assets/images/hero_vocal_booth_v2_1792444695212.jpg';
import heroRecordingRoomImg from '../../assets/images/hero_recording_room_v2_1792444696580.jpg';
import heroControlRoomImg from '../../assets/images/hero_control_room_v2_1792444696551.jpg';
import heroProductionLabImg from '../../assets/images/hero_production_lab_v2_1792444697086.jpg';
import heroArtistMasterImg from '../../assets/images/hero_artist_master_v2_1792444696981.jpg';

// High-resolution image assets generated for each studio environment
const STUDIO_PANORAMAS = [
  { id: 'vault', path: heroVaultEntranceImg, z: 0.0, w: 22, h: 12.5 },
  { id: 'vocal', path: heroVocalBoothImg, z: -22.0, w: 20, h: 11.5 },
  { id: 'recording', path: heroRecordingRoomImg, z: -46.0, w: 24, h: 13.5 },
  { id: 'control', path: heroControlRoomImg, z: -70.0, w: 22, h: 12.5 },
  { id: 'production', path: heroProductionLabImg, z: -94.0, w: 22, h: 12.5 },
  { id: 'artist_master', path: heroArtistMasterImg, z: -118.0, w: 22, h: 12.5 },
];

export default function StudioScene({ scrollProgress }: StudioSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Dynamic references
  const portalDoorLeftRef = useRef<THREE.Mesh | null>(null);
  const portalDoorRightRef = useRef<THREE.Mesh | null>(null);
  const tapeReelLeftRef = useRef<THREE.Mesh | null>(null);
  const tapeReelRightRef = useRef<THREE.Mesh | null>(null);
  const micGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  const progressRef = useRef(scrollProgress);
  progressRef.current = scrollProgress;

  const mouseOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x04060a);
    // Subtle distant fog that does NOT wash out backdrops
    scene.fog = new THREE.FogExp2(0x04060a, 0.009);

    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 400);
    camera.position.set(0, 1.8, 6.0);
    _currentLookAt.set(0, 1.6, 0);

    // 2. High-Performance Renderer Pipeline
    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Studio Environment Reflection Map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x05070e, 0.7);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.6);
    keyLight.position.set(6, 12, 10);
    keyLight.castShadow = !isHeadless;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 3.0, 50);
    rimLight.position.set(-8, 6, -18);
    scene.add(rimLight);

    // 5. Texture Loader with Max Anisotropy (Crisp 8K Studio Imagery)
    const textureLoader = new THREE.TextureLoader();
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    // Build Panoramic High-Definition Studio Portals
    STUDIO_PANORAMAS.forEach((item) => {
      textureLoader.load(item.path, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = maxAnisotropy;

        // Curved panoramic backdrop to envelop the camera
        const planeGeo = new THREE.PlaneGeometry(item.w, item.h, 16, 16);
        // Curve slightly on X edges for panoramic immersive wrap
        const posAttr = planeGeo.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          const x = posAttr.getX(i);
          posAttr.setZ(i, -Math.pow(x / (item.w * 0.5), 2) * 1.5);
        }
        planeGeo.computeVertexNormals();

        // Fog = false so images NEVER get washed out or hazy!
        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          fog: false,
          side: THREE.FrontSide,
        });

        const mesh = new THREE.Mesh(planeGeo, mat);
        mesh.position.set(0, item.h * 0.38, item.z - 4.5);
        scene.add(mesh);
      });
    });

    // 6. Scene 00 & 01: 3D Vault Architectural Entrance
    const vaultGroup = new THREE.Group();
    vaultGroup.position.set(0, 0, 0);

    const archMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      metalness: 0.92,
      roughness: 0.2,
    });

    // Vault Top Lintel
    const lintelGeo = new THREE.BoxGeometry(10, 1.0, 1.4);
    const lintel = new THREE.Mesh(lintelGeo, archMat);
    lintel.position.set(0, 5.2, 0);
    vaultGroup.add(lintel);

    // Vault Side Pillars
    const pillarGeo = new THREE.BoxGeometry(1.2, 5.2, 1.4);
    const pLeft = new THREE.Mesh(pillarGeo, archMat);
    pLeft.position.set(-4.5, 2.6, 0);
    vaultGroup.add(pLeft);

    const pRight = new THREE.Mesh(pillarGeo, archMat);
    pRight.position.set(4.5, 2.6, 0);
    vaultGroup.add(pRight);

    // Electric Cobalt Neon Waveform Trim
    const neonMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 2.2,
      roughness: 0.1,
    });
    const neonGeo = new THREE.BoxGeometry(8.6, 0.09, 0.09);
    const neonBar = new THREE.Mesh(neonGeo, neonMat);
    neonBar.position.set(0, 4.75, 0.72);
    vaultGroup.add(neonBar);

    // Sliding Architectural Vault Doors
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x0e1422,
      metalness: 0.88,
      roughness: 0.35,
    });
    const doorGeo = new THREE.BoxGeometry(4.0, 4.8, 0.25);

    const doorL = new THREE.Mesh(doorGeo, doorMat);
    doorL.position.set(-2.0, 2.4, 0.15);
    vaultGroup.add(doorL);
    portalDoorLeftRef.current = doorL;

    const doorR = new THREE.Mesh(doorGeo, doorMat);
    doorR.position.set(2.0, 2.4, 0.15);
    vaultGroup.add(doorR);
    portalDoorRightRef.current = doorR;

    scene.add(vaultGroup);

    // 7. Scene 02: 3D Procedural Studio Microphone in Vocal Booth (Z = -22)
    const micGroup = createMicrophoneRig();
    micGroup.position.set(0, 2.4, -20.8);
    micGroup.scale.set(1.15, 1.15, 1.15);
    micGroupRef.current = micGroup;
    scene.add(micGroup);

    // Acoustic glass partition window leading into recording hall
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xa5f3fc,
      transmission: 0.92,
      opacity: 0.9,
      transparent: true,
      roughness: 0.08,
      ior: 1.52,
      thickness: 0.3,
    });
    const glassGeo = new THREE.BoxGeometry(9.0, 4.8, 0.1);
    const glassWall = new THREE.Mesh(glassGeo, glassMat);
    glassWall.position.set(0, 2.6, -33.0);
    scene.add(glassWall);

    // 8. Scene 04: SSL 4000 Console in Control Room (Z = -70)
    const consoleGroup = createMixingConsole();
    consoleGroup.position.set(0, 0, -68.5);
    scene.add(consoleGroup);

    // 9. Scene 05: Modular Synthesis Station in Production Lab (Z = -94)
    const synthGroup = createSynthesisWorkstation();
    synthGroup.position.set(0, 0, -92.5);
    scene.add(synthGroup);

    // 10. Scene 06 & 07: Studer 2" Tape Reels in Master Suite (Z = -118)
    const tapeReelMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.12,
    });
    const reelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.05, 32);
    reelGeo.rotateX(Math.PI / 2);

    const reelL = new THREE.Mesh(reelGeo, tapeReelMat);
    reelL.position.set(-1.8, 2.6, -116.5);
    scene.add(reelL);
    tapeReelLeftRef.current = reelL;

    const reelR = new THREE.Mesh(reelGeo, tapeReelMat);
    reelR.position.set(-0.7, 2.6, -116.5);
    scene.add(reelR);
    tapeReelRightRef.current = reelR;

    // 11. Continuous Luminous 3D Audio Waveform Ribbon Threading All Spaces
    const curvePoints: THREE.Vector3[] = [
      new THREE.Vector3(0, 1.2, 5.0),
      new THREE.Vector3(-0.4, 2.1, -10.0),
      new THREE.Vector3(0.5, 1.9, -21.0),
      new THREE.Vector3(-0.8, 2.6, -34.0),
      new THREE.Vector3(0.9, 2.3, -45.0),
      new THREE.Vector3(-0.6, 1.8, -58.0),
      new THREE.Vector3(0.4, 2.1, -69.0),
      new THREE.Vector3(0.8, 2.5, -81.0),
      new THREE.Vector3(-0.5, 1.9, -93.0),
      new THREE.Vector3(0.6, 2.3, -105.0),
      new THREE.Vector3(0.0, 2.4, -117.0),
      new THREE.Vector3(0.0, 3.0, -140.0),
    ];
    const waveSpline = new THREE.CatmullRomCurve3(curvePoints);
    const waveGeo = new THREE.TubeGeometry(waveSpline, 220, 0.04, 12, false);
    const waveMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 1.6,
      roughness: 0.2,
      fog: false,
    });
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    scene.add(waveMesh);

    // 12. Floating Audio Atmosphere Particles
    const particleCount = 550;
    const particleGeo = new THREE.BufferGeometry();
    const posArr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArr[i] = (Math.random() - 0.5) * 16;
      posArr[i + 1] = Math.random() * 6 + 0.2;
      posArr[i + 2] = -Math.random() * 145 + 5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 13. Scene 08: 3D Grand Reveal Ring Emblem at Z = -142
    const grandGroup = new THREE.Group();
    grandGroup.position.set(0, 0, -142);
    const emblemGeo = new THREE.TorusGeometry(3.0, 0.14, 24, 64);
    const emblemMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.6,
      metalness: 0.9,
      roughness: 0.1,
      fog: false,
    });
    const emblem = new THREE.Mesh(emblemGeo, emblemMat);
    emblem.position.set(0, 3.4, 0);
    grandGroup.add(emblem);
    scene.add(grandGroup);

    // Pre-warm WebGL shaders once
    renderer.compile(scene, camera);

    // 14. Pointer Interaction for Subtle Camera Parallax
    const handlePointerMove = (e: PointerEvent) => {
      const px = (e.clientX / window.innerWidth) * 2 - 1;
      const py = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseOffsetRef.current = { x: px * 0.45, y: py * 0.35 };
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // 15. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 16. Silky Smooth Cinematic Render Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      const p = progressRef.current; // 0.0 to 1.0

      // Continuous Z dive deep into the studio from +6 to -142
      const targetZ = 6.0 - p * 148;
      const targetX = Math.sin(p * Math.PI * 3.5) * 0.7 + mouseOffsetRef.current.x;
      const targetY = 1.95 + Math.cos(p * Math.PI * 2.8) * 0.25 + mouseOffsetRef.current.y;

      // Exponential damping on camera position
      _desiredPos.set(targetX, targetY, targetZ);
      camera.position.x = THREE.MathUtils.damp(camera.position.x, _desiredPos.x, 4.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, _desiredPos.y, 4.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _desiredPos.z, 4.5, delta);

      // Camera look-at point sweeps forward along the corridor
      const lookZ = targetZ - 7.0;
      _cameraTarget.set(targetX * 0.3, 1.85, lookZ);
      _currentLookAt.x = THREE.MathUtils.damp(_currentLookAt.x, _cameraTarget.x, 5.0, delta);
      _currentLookAt.y = THREE.MathUtils.damp(_currentLookAt.y, _cameraTarget.y, 5.0, delta);
      _currentLookAt.z = THREE.MathUtils.damp(_currentLookAt.z, _cameraTarget.z, 5.0, delta);
      camera.lookAt(_currentLookAt);

      // Vault doors smoothly split and slide open as user starts scrolling
      const doorOpen = THREE.MathUtils.clamp(p * 9.0, 0, 1);
      if (portalDoorLeftRef.current && portalDoorRightRef.current) {
        portalDoorLeftRef.current.position.x = -2.0 - doorOpen * 3.2;
        portalDoorRightRef.current.position.x = 2.0 + doorOpen * 3.2;
      }

      // Spinning Studer tape reels
      if (tapeReelLeftRef.current && tapeReelRightRef.current) {
        tapeReelLeftRef.current.rotation.z += delta * 2.5;
        tapeReelRightRef.current.rotation.z += delta * 2.5;
      }

      // Subtle breath motion on vocal microphone
      if (micGroupRef.current) {
        micGroupRef.current.position.y = 2.4 + Math.sin(elapsedTime * 1.6) * 0.02;
      }

      // Gentle floating particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.02;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (renderer.domElement) renderer.domElement.remove();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
      style={{ touchAction: 'none' }}
    />
  );
}
