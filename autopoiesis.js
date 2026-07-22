import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const PALETTES = {
  structure: { core: 0xd13b2f, block: 0xbeb8ab, accent: 0x1c1c1a, background: 0xd8d5cc },
  purist: { core: 0x154da0, block: 0xeee9da, accent: 0xe9b72f, background: 0xd9d5c9 },
  glass: { core: 0x274f45, block: 0xa9c4c8, accent: 0x343a3c, background: 0xd4d7d2 },
  symmetry: { core: 0xb9475c, block: 0xf1c9b6, accent: 0x36847f, background: 0xe5d8c9 },
  hotel: { core: 0x7d294b, block: 0xe8aab5, accent: 0xd7a620, background: 0xdfd0c2 },
  noir: { core: 0xefc51d, block: 0x242321, accent: 0xc72e28, background: 0xc9c3b8 },
  western: { core: 0xa62c25, block: 0xd39648, accent: 0x25292a, background: 0xd8c4a7 },
  neon: { core: 0xd61f5c, block: 0x17636b, accent: 0xe9b72f, background: 0x26373a },
  albers: { core: 0xd94b2b, block: 0xd8a62a, accent: 0x6d1e1e, background: 0xddd1ba },
  mondrian: { core: 0xd9261c, block: 0xf2efe4, accent: 0x1646a0, background: 0xd8d6cf },
  barragan: { core: 0xb51f63, block: 0xd8a43c, accent: 0x244b6b, background: 0xd9c8aa },
  gray: { core: 0x242424, block: 0xd7cbb3, accent: 0x7c9a9a, background: 0xd4d2ca },
  perriand: { core: 0x29433a, block: 0xa85d37, accent: 0xe7d8b7, background: 0xc9cbc4 },
  delaunay: { core: 0xe55b2a, block: 0x2b5e9b, accent: 0xf0c438, background: 0xd8d3c4 },
  klee: { core: 0xa94832, block: 0x7d8a68, accent: 0xd6a84a, background: 0xd2c6ad },
  moholy: { core: 0x254f8f, block: 0xb8c1c4, accent: 0x1c2225, background: 0xd9dde0 },
};

const TRANSLATIONS = {
  tr: {
    manifesto: 'Kurallar biçimi üretir.<br>Boşluk sistemi görünür kılar.',
    spatialSystem: 'MEKÂNSAL SİSTEM', parameters: 'PARAMETRELER',
    moduleCountLabel: 'Modül sayısı', rhythmLabel: 'Ritim <small>ms</small>',
    scaleLabel: 'Ölçek <small>br</small>', coreLabel: 'Çekirdek <small>%</small>', seedLabel: 'Üretim tohumu',
    materialSystem: 'Malzeme düzeni', materialHint: 'çekirdek / kütle / vurgu',
    paletteStructure: 'STRÜKTÜR', paletteStructureDesc: 'Kömür / beton / kırmızı',
    palettePurist: 'PÜRİST', palettePuristDesc: 'Kobalt / kemik / sarı',
    paletteGlass: 'CAM EV', paletteGlassDesc: 'Çelik / cam / yeşil',
    paletteSymmetry: 'PASTEL SİMETRİ', paletteSymmetryDesc: 'Anderson esintisi',
    paletteHotel: 'GRAND OTEL', paletteHotelDesc: 'Bordo / pudra / altın',
    paletteNoir: 'SARI NOIR', paletteNoirDesc: 'Tarantino esintisi',
    paletteWestern: 'ÇÖL FİNALİ', paletteWesternDesc: 'Kızıl / okra / kömür',
    paletteNeon: 'NEON GECE', paletteNeonDesc: 'Fuşya / petrol / altın',
    paletteAlbers: 'ALBERS ETÜDÜ', paletteAlbersDesc: 'Vermilyon / okra / bordo',
    paletteMondrian: 'DE STIJL GRID', paletteMondrianDesc: 'Mondrian esintisi',
    paletteBarragan: 'BARRAGÁN AVLUSU', paletteBarraganDesc: 'Fuşya / okra / mavi',
    paletteGray: 'GRAY E-1027', paletteGrayDesc: 'Siyah / parşömen / krom',
    palettePerriand: 'ALPİN MODERN', palettePerriandDesc: 'Perriand esintisi',
    paletteDelaunay: 'EŞZAMANLI RİTİM', paletteDelaunayDesc: 'Delaunay esintisi',
    paletteKlee: 'KLEE POLİFONİ', paletteKleeDesc: 'Pas / adaçayı / altın',
    paletteMoholy: 'IŞIK-MEKÂN', paletteMoholyDesc: 'Moholy-Nagy esintisi',
    instruction: '<strong>BAŞLANGIÇ NOKTASINI SEÇ</strong><br>Izgara üzerinde bir noktaya dokun.',
    instructionContinue: '<strong>BÜYÜMEYİ SÜRDÜR</strong><br>Herhangi bir kattaki modülü yeni başlangıç olarak seç.',
    moduleMeta: 'MODÜL', coreMeta: 'ÇEKİRDEK', reset: 'SIFIRLA', pause: 'DURAKLAT', resume: 'DEVAM ET',
    audioOn: 'SES AÇ', audioOff: 'SES KAPAT', languageLabel: 'Dil seçimi', exportLabel: 'Görünümü PNG olarak indir',
    canvasLabel: 'Üç boyutlu üretken yapı alanı',
    footerManifesto: 'Açık plan / üretken strüktür / sonsuz varyasyon',
    soundCredit: 'Ses: “Contemplation” — Joth / CC0',
    footerHelp: '<kbd>CTRL</kbd> + seçim: modülü kaldır &nbsp;·&nbsp; sürükle: görünümü döndür &nbsp;·&nbsp; kaydır: yaklaş',
    statusReady: 'HAZIR', statusRunning: 'ÜRETİLİYOR', statusRunningProgress: 'ÜRETİLİYOR {current}/{total}',
    statusPaused: 'DURAKLATILDI', statusComplete: 'TAMAMLANDI', statusNoCells: 'UYGUN HÜCRE KALMADI',
    noticeDeleteWhileRunning: 'Üretim sürerken modül kaldırılamaz. Önce duraklatın.',
    noticeRemoved: 'Modül ve üretim kaydı kaldırıldı.',
    noticeAudioFailed: 'Tarayıcı sesi başlatamadı. Ses düğmesine yeniden dokunun.',
    noticeExportFailed: 'Görünüm dışa aktarılamadı.',
  },
  en: {
    manifesto: 'Rules generate form.<br>Space makes the system visible.',
    spatialSystem: 'SPATIAL SYSTEM', parameters: 'PARAMETERS',
    moduleCountLabel: 'Module count', rhythmLabel: 'Rhythm <small>ms</small>',
    scaleLabel: 'Scale <small>unit</small>', coreLabel: 'Core <small>%</small>', seedLabel: 'Generation seed',
    materialSystem: 'Material order', materialHint: 'core / mass / accent',
    paletteStructure: 'STRUCTURE', paletteStructureDesc: 'Coal / concrete / red',
    palettePurist: 'PURIST', palettePuristDesc: 'Cobalt / bone / yellow',
    paletteGlass: 'GLASS HOUSE', paletteGlassDesc: 'Steel / glass / green',
    paletteSymmetry: 'PASTEL SYMMETRY', paletteSymmetryDesc: 'Anderson-inspired',
    paletteHotel: 'GRAND HOTEL', paletteHotelDesc: 'Burgundy / blush / gold',
    paletteNoir: 'YELLOW NOIR', paletteNoirDesc: 'Tarantino-inspired',
    paletteWestern: 'DESERT FINALE', paletteWesternDesc: 'Crimson / ochre / coal',
    paletteNeon: 'NEON NIGHT', paletteNeonDesc: 'Fuchsia / petrol / gold',
    paletteAlbers: 'ALBERS STUDY', paletteAlbersDesc: 'Vermilion / ochre / burgundy',
    paletteMondrian: 'DE STIJL GRID', paletteMondrianDesc: 'Mondrian-inspired',
    paletteBarragan: 'BARRAGÁN COURT', paletteBarraganDesc: 'Fuchsia / ochre / blue',
    paletteGray: 'GRAY E-1027', paletteGrayDesc: 'Black / parchment / chrome',
    palettePerriand: 'ALPINE MODERN', palettePerriandDesc: 'Perriand-inspired',
    paletteDelaunay: 'SIMULTANEOUS RHYTHM', paletteDelaunayDesc: 'Delaunay-inspired',
    paletteKlee: 'KLEE POLYPHONY', paletteKleeDesc: 'Rust / sage / gold',
    paletteMoholy: 'LIGHT-SPACE', paletteMoholyDesc: 'Moholy-Nagy-inspired',
    instruction: '<strong>SELECT A STARTING POINT</strong><br>Touch a point on the grid.',
    instructionContinue: '<strong>CONTINUE THE GROWTH</strong><br>Select a module on any level as the new origin.',
    moduleMeta: 'MODULES', coreMeta: 'CORES', reset: 'RESET', pause: 'PAUSE', resume: 'RESUME',
    audioOn: 'SOUND ON', audioOff: 'SOUND OFF', languageLabel: 'Language selection', exportLabel: 'Download view as PNG',
    canvasLabel: 'Three-dimensional generative structure area',
    footerManifesto: 'Open plan / generative structure / infinite variation',
    soundCredit: 'Sound: “Contemplation” — Joth / CC0',
    footerHelp: '<kbd>CTRL</kbd> + select: remove module &nbsp;·&nbsp; drag: orbit view &nbsp;·&nbsp; scroll: zoom',
    statusReady: 'READY', statusRunning: 'GENERATING', statusRunningProgress: 'GENERATING {current}/{total}',
    statusPaused: 'PAUSED', statusComplete: 'COMPLETE', statusNoCells: 'NO AVAILABLE CELLS',
    noticeDeleteWhileRunning: 'Modules cannot be removed while generating. Pause first.',
    noticeRemoved: 'Module and generation record removed.',
    noticeAudioFailed: 'The browser could not start audio. Try the sound button again.',
    noticeExportFailed: 'The view could not be exported.',
  },
};

const DIRECTIONS = [
  { x: 1, y: 0, z: 0 },
  { x: -1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: 0, y: 0, z: 1 },
  { x: 0, y: 0, z: -1 },
];

const elements = {
  viewport: document.querySelector('#canvas'),
  instruction: document.querySelector('#instruction'),
  instructionCopy: document.querySelector('#instruction-copy'),
  iteration: document.querySelector('#iteration'),
  interval: document.querySelector('#interval'),
  cubeLength: document.querySelector('#cubeLength'),
  core: document.querySelector('#core'),
  seed: document.querySelector('#seed'),
  pause: document.querySelector('#pause'),
  reset: document.querySelector('#reset'),
  audio: document.querySelector('#audio'),
  export: document.querySelector('#export'),
  status: document.querySelector('#status'),
  moduleCount: document.querySelector('#module-count'),
  coreCount: document.querySelector('#core-count'),
  notice: document.querySelector('#notice'),
  threeVersion: document.querySelector('#three-version'),
  paletteButtons: [...document.querySelectorAll('[data-palette]')],
  languageButtons: [...document.querySelectorAll('[data-lang]')],
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, 1, 1, 10000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
const controls = new OrbitControls(camera, renderer.domElement);
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const structureGroup = new THREE.Group();

let grid;
let ground;
let voxelGeometry;
let cubeLength = 40;
let activePalette = 'structure';
let status = 'ready';
let paused = false;
let hoveredMesh = null;
let pointerOrigin = null;
let runToken = 0;
let noticeTimer = null;
let random = Math.random;
let targetModuleCount = 50;
let targetCoreCount = 20;

const voxels = new Map();
const cores = new Set();
const growthCores = new Set();
const backgroundAudio = new Audio(`${import.meta.env.BASE_URL}audio/contemplation.mp3`);
backgroundAudio.loop = true;
backgroundAudio.preload = 'metadata';
backgroundAudio.volume = 0;

let audioWanted = true;
let audioFadeFrame = null;
let currentLanguage = localStorage.getItem('autopoiesis-language-v2') === 'tr' ? 'tr' : 'en';
let statusState = { key: 'statusReady', variables: {} };

init();

function init() {
  elements.threeVersion.textContent = `R${THREE.REVISION}`;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('tabindex', '0');
  elements.viewport.prepend(renderer.domElement);

  scene.add(structureGroup);
  scene.add(new THREE.HemisphereLight(0xf9f5ea, 0x77756f, 2.3));

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
  keyLight.position.set(480, 760, 320);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.left = -900;
  keyLight.shadow.camera.right = 900;
  keyLight.shadow.camera.top = 900;
  keyLight.shadow.camera.bottom = -900;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x9cb4d3, 1.1);
  fillLight.position.set(-400, 240, -360);
  scene.add(fillLight);

  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.minDistance = 180;
  controls.maxDistance = 2600;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.target.set(0, 60, 0);

  camera.position.set(620, 560, 820);
  camera.lookAt(controls.target);

  selectPalette(activePalette);
  bindEvents();
  applyLanguage(currentLanguage);
  updateCounters();
  attemptDefaultAudio();

  const resizeObserver = new ResizeObserver(resizeRenderer);
  resizeObserver.observe(elements.viewport);
  renderer.setAnimationLoop(render);
}

function bindEvents() {
  renderer.domElement.addEventListener('pointerdown', (event) => {
    pointerOrigin = { x: event.clientX, y: event.clientY };
  });

  renderer.domElement.addEventListener('pointerup', (event) => {
    if (!pointerOrigin) return;
    const distance = Math.hypot(event.clientX - pointerOrigin.x, event.clientY - pointerOrigin.y);
    pointerOrigin = null;
    if (distance <= 5) handleCanvasSelection(event);
  });

  renderer.domElement.addEventListener('pointermove', handlePointerMove);
  renderer.domElement.addEventListener('pointerleave', clearHover);
  elements.pause.addEventListener('click', togglePause);
  elements.reset.addEventListener('click', resetStructure);
  elements.audio.addEventListener('click', toggleAudio);
  elements.export.addEventListener('click', exportImage);
  elements.cubeLength.addEventListener('change', handleScaleChange);

  for (const button of elements.paletteButtons) {
    button.addEventListener('click', () => selectPalette(button.dataset.palette));
  }

  for (const button of elements.languageButtons) {
    button.addEventListener('click', () => applyLanguage(button.dataset.lang));
  }

  for (const input of [elements.iteration, elements.interval, elements.cubeLength, elements.core]) {
    input.addEventListener('blur', () => validateInput(input));
  }

  document.addEventListener('visibilitychange', handleVisibilityChange);
  document.addEventListener('pointerdown', startDefaultAudio, { capture: true, once: true });
}

function t(key, variables = {}) {
  const template = TRANSLATIONS[currentLanguage][key] ?? TRANSLATIONS.tr[key] ?? key;
  return Object.entries(variables).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template,
  );
}

function applyLanguage(language) {
  if (!TRANSLATIONS[language]) return;
  currentLanguage = language;
  localStorage.setItem('autopoiesis-language-v2', language);
  document.documentElement.lang = language;

  for (const node of document.querySelectorAll('[data-i18n]')) {
    node.textContent = t(node.dataset.i18n);
  }
  for (const node of document.querySelectorAll('[data-i18n-html]')) {
    node.innerHTML = t(node.dataset.i18nHtml);
  }
  for (const button of elements.languageButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.lang === language));
  }

  document.querySelector('.language-switch').setAttribute('aria-label', t('languageLabel'));
  renderer.domElement.setAttribute('aria-label', t('canvasLabel'));
  elements.export.setAttribute('aria-label', t('exportLabel'));
  updateActionLabels();
  elements.status.textContent = t(statusState.key, statusState.variables);
}

function setInstruction(key) {
  elements.instructionCopy.dataset.i18nHtml = key;
  elements.instructionCopy.innerHTML = t(key);
}

function updateActionLabels() {
  elements.audio.setAttribute('aria-pressed', String(audioWanted));
  elements.audio.textContent = t(audioWanted ? 'audioOff' : 'audioOn');
  elements.pause.textContent = t(paused ? 'resume' : 'pause');
}

function startDefaultAudio(event) {
  if (!audioWanted || event.target.closest('#audio')) return;
  attemptDefaultAudio();
}

function attemptDefaultAudio() {
  if (!audioWanted || !backgroundAudio.paused) return;
  backgroundAudio.play().then(() => fadeAudio(0.2, 900)).catch(() => {
    // Audible autoplay is commonly blocked; the first pointer gesture retries it.
  });
}

async function toggleAudio() {
  audioWanted = !audioWanted;
  elements.audio.setAttribute('aria-pressed', String(audioWanted));
  updateActionLabels();

  if (!audioWanted) {
    fadeAudio(0, 500, () => backgroundAudio.pause());
    return;
  }

  try {
    await backgroundAudio.play();
    fadeAudio(0.2, 900);
  } catch {
    audioWanted = false;
    elements.audio.setAttribute('aria-pressed', 'false');
    updateActionLabels();
    showNotice(t('noticeAudioFailed'));
  }
}

function fadeAudio(targetVolume, duration, onComplete) {
  if (audioFadeFrame) cancelAnimationFrame(audioFadeFrame);
  const startVolume = backgroundAudio.volume;
  const startedAt = performance.now();

  function step(now) {
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = 1 - ((1 - progress) ** 3);
    backgroundAudio.volume = THREE.MathUtils.lerp(startVolume, targetVolume, eased);
    if (progress < 1) {
      audioFadeFrame = requestAnimationFrame(step);
    } else {
      audioFadeFrame = null;
      onComplete?.();
    }
  }

  audioFadeFrame = requestAnimationFrame(step);
}

function handleVisibilityChange() {
  if (document.hidden) {
    backgroundAudio.pause();
  } else if (audioWanted) {
    backgroundAudio.play().then(() => fadeAudio(0.2, 350)).catch(() => {});
  }
}

function resizeRenderer() {
  const { width, height } = elements.viewport.getBoundingClientRect();
  if (!width || !height) return;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function rebuildConstructionPlane({ rebuildVoxelGeometry = true } = {}) {
  const palette = PALETTES[activePalette];
  if (grid) {
    scene.remove(grid);
    grid.geometry.dispose();
    grid.material.dispose();
  }
  if (ground) {
    scene.remove(ground);
    ground.geometry.dispose();
    ground.material.dispose();
  }
  if (rebuildVoxelGeometry && voxelGeometry) voxelGeometry.dispose();

  const size = cubeLength * 20;
  grid = new THREE.GridHelper(size, 20, palette.accent, palette.accent);
  grid.material.transparent = true;
  grid.material.opacity = 0.58;
  grid.position.y = -0.4;
  scene.add(grid);

  ground = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.ShadowMaterial({ color: 0x11110f, opacity: 0.16 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.userData.isGround = true;
  scene.add(ground);

  if (rebuildVoxelGeometry) {
    voxelGeometry = new THREE.BoxGeometry(cubeLength, cubeLength, cubeLength);
  }
}

function readSettings() {
  const iteration = clampInteger(elements.iteration.value, 1, 500, 50);
  const interval = clampInteger(elements.interval.value, 0, 2000, 90);
  const scale = clampInteger(elements.cubeLength.value, 1, 10, 4);
  const corePercentage = clampInteger(elements.core.value, 20, 80, 40);
  const seed = elements.seed.value.trim() || 'AUTOPOIESIS';

  elements.iteration.value = iteration;
  elements.interval.value = interval;
  elements.cubeLength.value = scale;
  elements.core.value = corePercentage;
  elements.seed.value = seed;

  return { iteration, interval, cubeLength: scale * 10, corePercentage, seed };
}

function clampInteger(rawValue, min, max, fallback) {
  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.round(parsed)));
}

function validateInput(input) {
  const settings = readSettings();
  if (input === elements.cubeLength && status === 'ready' && settings.cubeLength !== cubeLength) {
    cubeLength = settings.cubeLength;
    rebuildConstructionPlane();
  }
}

function handleScaleChange() {
  if (status !== 'ready') return;
  const settings = readSettings();
  if (settings.cubeLength === cubeLength) return;
  cubeLength = settings.cubeLength;
  rebuildConstructionPlane();
}

function handleCanvasSelection(event) {
  updateRaycaster(event);

  if (event.ctrlKey || event.metaKey) {
    if (status === 'running') {
      showNotice(t('noticeDeleteWhileRunning'));
      return;
    }
    const hit = raycaster.intersectObjects(structureGroup.children, false)[0];
    if (hit) removeVoxel(hit.object.userData.key);
    return;
  }

  if (status === 'complete') {
    const hit = raycaster.intersectObjects(structureGroup.children, false)[0];
    if (hit) extendStructure(hit.object.userData.key);
    return;
  }

  if (status !== 'ready') return;
  const hit = raycaster.intersectObject(ground, false)[0];
  if (!hit) return;
  startStructure(hit.point);
}

function startStructure(point) {
  const settings = readSettings();
  cubeLength = settings.cubeLength;
  targetModuleCount = settings.iteration;
  targetCoreCount = Math.max(1, Math.round(targetModuleCount * settings.corePercentage / 100));
  random = mulberry32(hashSeed(settings.seed));
  status = 'running';
  paused = false;
  runToken += 1;
  growthCores.clear();

  const start = {
    x: snapCoordinate(point.x),
    y: cubeLength / 2,
    z: snapCoordinate(point.z),
  };

  addVoxel(start, 'core');
  setConfigurationLocked(true);
  elements.instruction.classList.add('is-hidden');
  elements.pause.disabled = false;
  updateActionLabels();
  setStatus('statusRunning');
  scheduleNextStep(runToken, settings.interval);
}

function extendStructure(anchorKey) {
  const anchor = voxels.get(anchorKey);
  if (!anchor) return;
  const settings = readSettings();

  promoteToCore(anchor);
  growthCores.clear();
  growthCores.add(anchorKey);
  targetModuleCount = voxels.size + settings.iteration;
  targetCoreCount = cores.size + Math.max(1, Math.round(settings.iteration * settings.corePercentage / 100));
  random = mulberry32(hashSeed(`${settings.seed}:${anchorKey}:${voxels.size}`));
  status = 'running';
  paused = false;
  runToken += 1;

  elements.instruction.classList.add('is-hidden');
  elements.pause.disabled = false;
  updateActionLabels();
  setStatus('statusRunningProgress', { current: voxels.size, total: targetModuleCount });
  scheduleNextStep(runToken, settings.interval);
}

function promoteToCore(voxel) {
  if (voxel.type === 'core') return;
  const palette = PALETTES[activePalette];
  voxel.type = 'core';
  voxel.mesh.userData.type = 'core';
  voxel.mesh.material.color.setHex(palette.core);
  voxel.mesh.material.roughness = 0.48;
  voxel.mesh.material.metalness = 0.18;
  voxel.mesh.material.wireframe = true;
  voxel.mesh.material.needsUpdate = true;
  voxel.mesh.castShadow = false;
  cores.add(voxel.key);
  updateCounters();
}

function snapCoordinate(value) {
  const snapped = Math.floor(value / cubeLength) * cubeLength + cubeLength / 2;
  const groundLimit = cubeLength * 10 - cubeLength / 2;
  return THREE.MathUtils.clamp(snapped, -groundLimit, groundLimit);
}

function scheduleNextStep(token, interval) {
  if (token !== runToken || paused || status !== 'running') return;
  if (voxels.size >= targetModuleCount) {
    finishStructure();
    return;
  }

  window.setTimeout(() => {
    if (token !== runToken || paused || status !== 'running') return;
    const frontier = getFrontier();
    if (frontier.length === 0) {
      finishStructure('statusNoCells');
      return;
    }

    const position = frontier[Math.floor(random() * frontier.length)];
    addVoxel(position, chooseVoxelType());
    scheduleNextStep(token, interval);
  }, interval);
}

function getFrontier() {
  const candidates = new Map();
  for (const coreKey of growthCores) {
    const core = voxels.get(coreKey);
    if (!core) continue;
    for (const direction of DIRECTIONS) {
      const position = {
        x: core.position.x + direction.x * cubeLength,
        y: core.position.y + direction.y * cubeLength,
        z: core.position.z + direction.z * cubeLength,
      };
      const key = positionKey(position);
      if (!voxels.has(key) && isAllowedPosition(position)) candidates.set(key, position);
    }
  }
  return [...candidates.values()];
}

function isAllowedPosition(position) {
  const isGroundLevel = Math.abs(position.y - cubeLength / 2) < 0.001;
  if (!isGroundLevel) return true;
  const groundLimit = cubeLength * 10 - cubeLength / 2;
  return Math.abs(position.x) <= groundLimit && Math.abs(position.z) <= groundLimit;
}

function chooseVoxelType() {
  const coresNeeded = targetCoreCount - cores.size;
  const placementsRemaining = targetModuleCount - voxels.size;
  if (coresNeeded <= 0) return 'block';
  if (coresNeeded >= placementsRemaining) return 'core';
  return random() < coresNeeded / placementsRemaining ? 'core' : 'block';
}

function addVoxel(position, type) {
  const key = positionKey(position);
  if (voxels.has(key)) return false;

  const palette = PALETTES[activePalette];
  const material = new THREE.MeshStandardMaterial({
    color: type === 'core' ? palette.core : palette.block,
    roughness: type === 'core' ? 0.48 : 0.82,
    metalness: type === 'core' ? 0.18 : 0.02,
    wireframe: type === 'core',
  });
  const mesh = new THREE.Mesh(voxelGeometry, material);
  mesh.position.set(position.x, position.y, position.z);
  mesh.castShadow = type === 'block';
  mesh.receiveShadow = true;
  mesh.userData = { key, type };
  structureGroup.add(mesh);

  voxels.set(key, { key, type, position: { ...position }, mesh });
  if (type === 'core') {
    cores.add(key);
    growthCores.add(key);
  }
  updateCounters();
  return true;
}

function removeVoxel(key) {
  const voxel = voxels.get(key);
  if (!voxel) return;
  clearHover();
  structureGroup.remove(voxel.mesh);
  voxel.mesh.material.dispose();
  voxels.delete(key);
  cores.delete(key);
  growthCores.delete(key);
  updateCounters();
  showNotice(t('noticeRemoved'));
}

function positionKey({ x, y, z }) {
  return `${x},${y},${z}`;
}

function finishStructure(statusKey = 'statusComplete') {
  status = 'complete';
  paused = false;
  elements.pause.disabled = true;
  updateActionLabels();
  setStatus(statusKey);
  setInstruction('instructionContinue');
  elements.instruction.classList.remove('is-hidden');
}

function togglePause() {
  if (status !== 'running') return;
  paused = !paused;
  if (paused) {
    runToken += 1;
    updateActionLabels();
    setStatus('statusPaused');
  } else {
    updateActionLabels();
    setStatus('statusRunning');
    runToken += 1;
    scheduleNextStep(runToken, readSettings().interval);
  }
}

function resetStructure() {
  runToken += 1;
  paused = false;
  status = 'ready';
  clearHover();
  for (const voxel of voxels.values()) voxel.mesh.material.dispose();
  structureGroup.clear();
  voxels.clear();
  cores.clear();
  growthCores.clear();
  setConfigurationLocked(false);
  elements.pause.disabled = true;
  updateActionLabels();
  elements.instruction.classList.remove('is-hidden');
  setInstruction('instruction');
  setStatus('statusReady');
  updateCounters();
}

function setConfigurationLocked(locked) {
  for (const input of [elements.iteration, elements.interval, elements.cubeLength, elements.core, elements.seed]) {
    input.disabled = locked;
  }
}

function selectPalette(name) {
  if (!PALETTES[name]) return;
  activePalette = name;
  const palette = PALETTES[name];
  scene.background = new THREE.Color(palette.background);
  rebuildConstructionPlane({ rebuildVoxelGeometry: voxels.size === 0 });

  for (const voxel of voxels.values()) {
    voxel.mesh.material.color.setHex(voxel.type === 'core' ? palette.core : palette.block);
    if (voxel.mesh === hoveredMesh) {
      voxel.mesh.material.emissive.setHex(palette.accent);
    }
    voxel.mesh.material.needsUpdate = true;
  }
  for (const button of elements.paletteButtons) {
    const selected = button.dataset.palette === name;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  }
}

function handlePointerMove(event) {
  updateRaycaster(event);
  const hit = raycaster.intersectObjects(structureGroup.children, false)[0];
  const nextMesh = hit?.object ?? null;
  if (nextMesh === hoveredMesh) return;
  clearHover();
  if (!nextMesh) return;
  hoveredMesh = nextMesh;
  hoveredMesh.material.emissive.setHex(PALETTES[activePalette].accent);
  hoveredMesh.material.emissiveIntensity = 0.42;
}

function clearHover() {
  if (!hoveredMesh) return;
  hoveredMesh.material.emissive.setHex(0x000000);
  hoveredMesh.material.emissiveIntensity = 0;
  hoveredMesh = null;
}

function updateRaycaster(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
}

function updateCounters() {
  elements.moduleCount.textContent = String(voxels.size).padStart(3, '0');
  elements.coreCount.textContent = String(cores.size).padStart(3, '0');
  if (status === 'running') {
    setStatus('statusRunningProgress', { current: voxels.size, total: targetModuleCount });
  }
}

function setStatus(key, variables = {}) {
  statusState = { key, variables };
  elements.status.textContent = t(key, variables);
}

function showNotice(message) {
  window.clearTimeout(noticeTimer);
  elements.notice.textContent = message;
  elements.notice.classList.add('is-visible');
  noticeTimer = window.setTimeout(() => elements.notice.classList.remove('is-visible'), 2600);
}

function exportImage() {
  renderer.render(scene, camera);
  renderer.domElement.toBlob((blob) => {
    if (!blob) {
      showNotice(t('noticeExportFailed'));
      return;
    }
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `autopoiesis-${elements.seed.value.trim() || 'structure'}.png`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, 'image/png');
}

function hashSeed(seed) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  return function seededRandom() {
    let value = seed += 0x6d2b79f5;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function render() {
  controls.update();
  renderer.render(scene, camera);
}
