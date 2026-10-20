import * as THREE from 'three';

// Procedural 3-12 part studio models adhering to Three.js PBR standards

/**
 * Creates an authentic Neumann U87 style condenser microphone on a spider shockmount with pop filter
 */
export function createMicrophoneRig(): THREE.Group {
  const rig = new THREE.Group();

  // PBR Materials
  const nickelMat = new THREE.MeshStandardMaterial({
    color: 0xd8d8d8,
    metalness: 0.85,
    roughness: 0.22,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.95,
    roughness: 0.12,
  });

  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    metalness: 0.8,
    roughness: 0.35,
  });

  const goldCapsuleMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.9,
    roughness: 0.2,
    wireframe: true,
  });

  const popFilterMat = new THREE.MeshPhysicalMaterial({
    color: 0x09090b,
    transmission: 0.6,
    opacity: 0.85,
    transparent: true,
    roughness: 0.6,
  });

  // 1. Microphone Main Body (Nickel cylinder)
  const bodyGeo = new THREE.CylinderGeometry(0.24, 0.22, 1.1, 32);
  const body = new THREE.Mesh(bodyGeo, nickelMat);
  body.position.y = 0.55;
  body.castShadow = true;
  rig.add(body);

  // 2. Body Collar & Badge Band
  const collarGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.08, 32);
  const collar = new THREE.Mesh(collarGeo, darkMetalMat);
  collar.position.y = 0.6;
  rig.add(collar);

  // 3. Microphone Capsule Cage (Sloped top wire mesh)
  const cageGeo = new THREE.CylinderGeometry(0.26, 0.24, 0.75, 32);
  const cage = new THREE.Mesh(cageGeo, chromeMat);
  cage.position.y = 1.45;
  rig.add(cage);

  // 4. Gold Diaphragm inside cage
  const diaphragmGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.04, 24);
  diaphragmGeo.rotateX(Math.PI / 2);
  const diaphragm = new THREE.Mesh(diaphragmGeo, goldCapsuleMat);
  diaphragm.position.y = 1.45;
  rig.add(diaphragm);

  // 5. Spider Shockmount Inner Ring
  const innerRingGeo = new THREE.TorusGeometry(0.38, 0.03, 16, 32);
  innerRingGeo.rotateX(Math.PI / 2);
  const innerRing = new THREE.Mesh(innerRingGeo, darkMetalMat);
  innerRing.position.y = 0.7;
  rig.add(innerRing);

  // 6. Spider Shockmount Outer Ring
  const outerRingGeo = new THREE.TorusGeometry(0.62, 0.04, 16, 32);
  outerRingGeo.rotateX(Math.PI / 2);
  const outerRing = new THREE.Mesh(outerRingGeo, darkMetalMat);
  outerRing.position.y = 0.7;
  rig.add(outerRing);

  // 7. Shockmount Bands (8 procedural struts)
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const bandGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.26, 8);
    const band = new THREE.Mesh(bandGeo, darkMetalMat);
    band.position.set(Math.cos(angle) * 0.5, 0.7, Math.sin(angle) * 0.5);
    band.rotation.y = angle;
    band.rotation.z = Math.PI / 4;
    rig.add(band);
  }

  // 8. Pop Filter Double Ring & Translucent Screen
  const popArmGeo = new THREE.TorusGeometry(0.48, 0.02, 16, 32);
  const popFrame = new THREE.Mesh(popArmGeo, darkMetalMat);
  popFrame.position.set(0, 1.45, 0.52);
  rig.add(popFrame);

  const popMeshGeo = new THREE.CircleGeometry(0.46, 32);
  const popMesh = new THREE.Mesh(popMeshGeo, popFilterMat);
  popMesh.position.set(0, 1.45, 0.52);
  rig.add(popMesh);

  // 9. Gooseneck Arm & Stand Coupler
  const gooseneckCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, 0.6, 0),
    new THREE.Vector3(-0.35, 1.0, 0.3),
    new THREE.Vector3(0, 1.45, 0.52)
  );
  const gooseneckGeo = new THREE.TubeGeometry(gooseneckCurve, 20, 0.02, 8, false);
  const gooseneck = new THREE.Mesh(gooseneckGeo, darkMetalMat);
  rig.add(gooseneck);

  // 10. Heavy Cast Iron Studio Stand Base & Telescoping Mast
  const mastGeo = new THREE.CylinderGeometry(0.04, 0.05, 3.2, 16);
  const mast = new THREE.Mesh(mastGeo, chromeMat);
  mast.position.set(0, -0.9, 0);
  mast.castShadow = true;
  rig.add(mast);

  const baseGeo = new THREE.CylinderGeometry(0.7, 0.75, 0.15, 32);
  const base = new THREE.Mesh(baseGeo, darkMetalMat);
  base.position.set(0, -2.45, 0);
  base.receiveShadow = true;
  rig.add(base);

  return rig;
}

/**
 * Creates a professional Solid State Logic style 4000 G+ mixing console with faders, meters & nearfield monitors
 */
export function createMixingConsole(): THREE.Group {
  const consoleGroup = new THREE.Group();

  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x1f242d,
    metalness: 0.4,
    roughness: 0.6,
  });

  const faceplateMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.75,
    roughness: 0.28,
  });

  const armrestMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.1,
    roughness: 0.75,
  });

  const faderSilverMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.95,
    roughness: 0.15,
  });

  const vuMeterGlowMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xd97706,
    emissiveIntensity: 0.75,
    roughness: 0.2,
  });

  // 1. Console Main Frame Chassis
  const chassisGeo = new THREE.BoxGeometry(6.4, 1.2, 2.2);
  const chassis = new THREE.Mesh(chassisGeo, chassisMat);
  chassis.position.y = 0.6;
  chassis.castShadow = true;
  consoleGroup.add(chassis);

  // 2. Leather Padded Armrest
  const armrestGeo = new THREE.CylinderGeometry(0.12, 0.12, 6.4, 24);
  armrestGeo.rotateZ(Math.PI / 2);
  const armrest = new THREE.Mesh(armrestGeo, armrestMat);
  armrest.position.set(0, 1.15, 1.05);
  consoleGroup.add(armrest);

  // 3. Sloped Channel Strip Faceplate
  const faceplateGeo = new THREE.BoxGeometry(6.2, 0.08, 1.6);
  const faceplate = new THREE.Mesh(faceplateGeo, faceplateMat);
  faceplate.position.set(0, 1.18, 0.15);
  faceplate.rotation.x = -0.15;
  consoleGroup.add(faceplate);

  // 4. Console Fader Rows (32 channel faders)
  for (let i = 0; i < 24; i++) {
    const xPos = -2.8 + i * 0.24;
    // Fader track slot
    const faderGeo = new THREE.BoxGeometry(0.04, 0.05, 0.14);
    const faderCap = new THREE.Mesh(faderGeo, faderSilverMat);
    const zOffset = 0.6 + (Math.sin(i * 1.5) * 0.18);
    faderCap.position.set(xPos, 1.25, zOffset);
    faderCap.rotation.x = -0.15;
    consoleGroup.add(faderCap);
  }

  // 5. Overbridge Metering Pod
  const meterBridgeGeo = new THREE.BoxGeometry(6.2, 0.65, 0.4);
  const meterBridge = new THREE.Mesh(meterBridgeGeo, chassisMat);
  meterBridge.position.set(0, 1.65, -0.75);
  consoleGroup.add(meterBridge);

  // 6. Glowing Analog VU Meters on bridge
  for (let i = 0; i < 8; i++) {
    const vuGeo = new THREE.BoxGeometry(0.42, 0.28, 0.02);
    const vu = new THREE.Mesh(vuGeo, vuMeterGlowMat);
    vu.position.set(-2.45 + i * 0.7, 1.65, -0.54);
    consoleGroup.add(vu);
  }

  // 7. Left & Right Studio Monitors (Yamaha / ATC style)
  [-2.8, 2.8].forEach((xOffset) => {
    const speakerGroup = new THREE.Group();
    speakerGroup.position.set(xOffset, 2.2, -0.75);

    const cabinetGeo = new THREE.BoxGeometry(0.55, 0.85, 0.45);
    const cabinetMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0c,
      metalness: 0.2,
      roughness: 0.8,
    });
    const cabinet = new THREE.Mesh(cabinetGeo, cabinetMat);
    speakerGroup.add(cabinet);

    // White Bass Cone (Yamaha NS-10 icon)
    const coneGeo = new THREE.CylinderGeometry(0.18, 0.16, 0.04, 24);
    coneGeo.rotateX(Math.PI / 2);
    const coneMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.1,
      roughness: 0.3,
    });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.set(0, -0.15, 0.23);
    speakerGroup.add(cone);

    // Tweeter Dome
    const tweeterGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const tweeterMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.2,
    });
    const tweeter = new THREE.Mesh(tweeterGeo, tweeterMat);
    tweeter.position.set(0, 0.2, 0.22);
    speakerGroup.add(tweeter);

    consoleGroup.add(speakerGroup);
  });

  return consoleGroup;
}

/**
 * Creates grand piano and studio drum kit for the Live Recording Room
 */
export function createLiveRoomInstruments(): THREE.Group {
  const instruments = new THREE.Group();

  // Grand Piano Materials (High gloss Steinway black lacquer)
  const lacquerMat = new THREE.MeshPhysicalMaterial({
    color: 0x050505,
    metalness: 0.1,
    roughness: 0.08,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });

  const goldCastIronMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.92,
    roughness: 0.25,
  });

  // Piano Body Shell
  const pianoBodyGeo = new THREE.BoxGeometry(2.4, 0.6, 3.2);
  const pianoBody = new THREE.Mesh(pianoBodyGeo, lacquerMat);
  pianoBody.position.set(-3.2, 1.4, 0);
  pianoBody.castShadow = true;
  instruments.add(pianoBody);

  // Piano Lid Prop (open)
  const lidGeo = new THREE.BoxGeometry(2.35, 0.06, 3.1);
  const lid = new THREE.Mesh(lidGeo, lacquerMat);
  lid.position.set(-3.2, 1.9, 0);
  lid.rotation.z = 0.35;
  instruments.add(lid);

  // Cast Iron Harp Plate inside
  const harpGeo = new THREE.BoxGeometry(2.0, 0.04, 2.6);
  const harp = new THREE.Mesh(harpGeo, goldCastIronMat);
  harp.position.set(-3.2, 1.6, 0);
  instruments.add(harp);

  // Piano Legs (3 fluted pillars)
  [
    [-4.1, 0.7, -1.3],
    [-2.3, 0.7, -1.3],
    [-3.2, 0.7, 1.3],
  ].forEach(([x, y, z]) => {
    const legGeo = new THREE.CylinderGeometry(0.08, 0.06, 1.4, 16);
    const leg = new THREE.Mesh(legGeo, lacquerMat);
    leg.position.set(x, y, z);
    instruments.add(leg);
  });

  // Drum Kit (Studio Gretsch Custom)
  const drumGroup = new THREE.Group();
  drumGroup.position.set(3.2, 0, 0);

  const mapleWoodMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    metalness: 0.1,
    roughness: 0.4,
  });

  const cymbalBrassMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.95,
    roughness: 0.18,
  });

  const drumChromeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.95,
    roughness: 0.1,
  });

  // Bass Drum (Kick)
  const kickGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.9, 32);
  kickGeo.rotateZ(Math.PI / 2);
  const kick = new THREE.Mesh(kickGeo, mapleWoodMat);
  kick.position.set(0, 0.75, 0);
  kick.castShadow = true;
  drumGroup.add(kick);

  // Snare Drum
  const snareGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.28, 24);
  const snare = new THREE.Mesh(snareGeo, drumChromeMat);
  snare.position.set(-0.85, 1.15, 0.3);
  drumGroup.add(snare);

  // Mounted Toms
  const tom1Geo = new THREE.CylinderGeometry(0.35, 0.35, 0.35, 24);
  const tom1 = new THREE.Mesh(tom1Geo, mapleWoodMat);
  tom1.position.set(-0.35, 1.6, -0.1);
  tom1.rotation.z = -0.2;
  drumGroup.add(tom1);

  const tom2Geo = new THREE.CylinderGeometry(0.38, 0.38, 0.38, 24);
  const tom2 = new THREE.Mesh(tom2Geo, mapleWoodMat);
  tom2.position.set(0.35, 1.6, -0.1);
  tom2.rotation.z = 0.2;
  drumGroup.add(tom2);

  // Cymbals (Ride & Crash)
  [
    [-1.2, 1.8, -0.4, 0.55],
    [1.2, 1.9, -0.3, 0.65],
  ].forEach(([cx, cy, cz, radius]) => {
    const cymbalGeo = new THREE.CylinderGeometry(radius, radius, 0.015, 32);
    const cymbal = new THREE.Mesh(cymbalGeo, cymbalBrassMat);
    cymbal.position.set(cx, cy, cz);
    cymbal.rotation.x = 0.12;
    drumGroup.add(cymbal);

    // Stand rod
    const rodGeo = new THREE.CylinderGeometry(0.02, 0.02, cy, 12);
    const rod = new THREE.Mesh(rodGeo, drumChromeMat);
    rod.position.set(cx, cy / 2, cz);
    drumGroup.add(rod);
  });

  instruments.add(drumGroup);
  return instruments;
}

/**
 * Creates modern synthesis lab workstation: Modular rack, MPC drum pads, MIDI keyboard
 */
export function createSynthesisWorkstation(): THREE.Group {
  const lab = new THREE.Group();

  const deskMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.3,
    roughness: 0.7,
  });

  const synthPanelMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.85,
    roughness: 0.25,
  });

  const padActiveMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.8,
    roughness: 0.3,
  });

  // Studio Production Desk
  const deskGeo = new THREE.BoxGeometry(4.8, 0.1, 1.8);
  const desk = new THREE.Mesh(deskGeo, deskMat);
  desk.position.set(0, 1.0, 0);
  lab.add(desk);

  // Modular Eurorack System (Angled vertical case)
  const rackCaseGeo = new THREE.BoxGeometry(2.4, 1.6, 0.4);
  const rackCase = new THREE.Mesh(rackCaseGeo, synthPanelMat);
  rackCase.position.set(-1.0, 1.85, -0.5);
  rackCase.rotation.x = -0.15;
  lab.add(rackCase);

  // Glowing Patch Cables across modular synth
  const cableColors = [0x38bdf8, 0xa855f7, 0xf59e0b, 0x10b981];
  for (let i = 0; i < 6; i++) {
    const xStart = -1.9 + Math.random() * 0.8;
    const yStart = 1.3 + Math.random() * 0.9;
    const xEnd = -0.9 + Math.random() * 0.8;
    const yEnd = 1.3 + Math.random() * 0.9;

    const cableCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(xStart, yStart, -0.3),
      new THREE.Vector3((xStart + xEnd) / 2, Math.min(yStart, yEnd) - 0.4, -0.1),
      new THREE.Vector3((xStart + xEnd) / 2, Math.min(yStart, yEnd) - 0.2, -0.2),
      new THREE.Vector3(xEnd, yEnd, -0.3)
    );

    const cableGeo = new THREE.TubeGeometry(cableCurve, 16, 0.012, 6, false);
    const cableMat = new THREE.MeshStandardMaterial({
      color: cableColors[i % cableColors.length],
      emissive: cableColors[i % cableColors.length],
      emissiveIntensity: 0.4,
      roughness: 0.5,
    });
    const cable = new THREE.Mesh(cableGeo, cableMat);
    lab.add(cable);
  }

  // 16-Pad MPC Drum Sampler
  const mpcGeo = new THREE.BoxGeometry(0.9, 0.12, 0.7);
  const mpc = new THREE.Mesh(mpcGeo, synthPanelMat);
  mpc.position.set(1.4, 1.1, 0.2);
  mpc.rotation.x = -0.1;
  lab.add(mpc);

  // 4x4 Grid of velocity pads
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const padGeo = new THREE.BoxGeometry(0.1, 0.02, 0.1);
      const pad = new THREE.Mesh(padGeo, padActiveMat);
      pad.position.set(1.2 + col * 0.13, 1.17, 0.05 + row * 0.12);
      pad.rotation.x = -0.1;
      lab.add(pad);
    }
  }

  // 61-Key MIDI Keyboard Controller
  const kbChassisGeo = new THREE.BoxGeometry(2.6, 0.08, 0.6);
  const kbChassis = new THREE.Mesh(kbChassisGeo, synthPanelMat);
  kbChassis.position.set(0, 1.08, 0.35);
  lab.add(kbChassis);

  // White Piano Keys
  const keysGeo = new THREE.BoxGeometry(2.4, 0.04, 0.35);
  const keysMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
  const keys = new THREE.Mesh(keysGeo, keysMat);
  keys.position.set(0, 1.12, 0.42);
  lab.add(keys);

  return lab;
}

/**
 * Creates 3D acoustic room boundary with timber diffusers and architectural glass
 */
export function createAcousticShell(width = 14, depth = 18, height = 7, color = 0x0f172a): THREE.Group {
  const room = new THREE.Group();

  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x141822,
    metalness: 0.2,
    roughness: 0.45,
  });

  const wallMat = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.1,
    roughness: 0.85,
  });

  const slatMat = new THREE.MeshStandardMaterial({
    color: 0x272018, // Warm acoustic walnut
    metalness: 0.05,
    roughness: 0.65,
  });

  // Polished Acoustic Floor
  const floorGeo = new THREE.PlaneGeometry(width, depth);
  floorGeo.rotateX(-Math.PI / 2);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.receiveShadow = true;
  room.add(floor);

  // Ceiling
  const ceilGeo = new THREE.PlaneGeometry(width, depth);
  ceilGeo.rotateX(Math.PI / 2);
  const ceil = new THREE.Mesh(ceilGeo, wallMat);
  ceil.position.y = height;
  room.add(ceil);

  // Acoustic Wall Slats (vertical timber diffusers)
  const slatCount = 18;
  const slatSpacing = depth / slatCount;
  for (let i = 0; i < slatCount; i++) {
    const zPos = -depth / 2 + i * slatSpacing;
    const slatGeo = new THREE.BoxGeometry(0.12, height, 0.18);
    // Left wall slats
    const leftSlat = new THREE.Mesh(slatGeo, slatMat);
    leftSlat.position.set(-width / 2 + 0.1, height / 2, zPos);
    room.add(leftSlat);
    // Right wall slats
    const rightSlat = new THREE.Mesh(slatGeo, slatMat);
    rightSlat.position.set(width / 2 - 0.1, height / 2, zPos);
    room.add(rightSlat);
  }

  return room;
}
