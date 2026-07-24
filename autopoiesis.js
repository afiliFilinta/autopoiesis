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
    instructionContinue: '<strong>DÖNGÜ TAMAMLANDI</strong><br>Geriye yalnızca düzlem kaldı.',
    moduleMeta: 'MODÜL', coreMeta: 'TAŞIYICI', destroyedMeta: 'YIKIM', reset: 'SIFIRLA', pause: 'DURAKLAT', resume: 'DEVAM ET',
    audioOn: 'SES AÇ', audioOff: 'SES KAPAT', languageLabel: 'Dil seçimi', exportLabel: 'Görünümü PNG olarak indir',
    canvasLabel: 'Üç boyutlu üretken yapı alanı',
    footerManifesto: 'Açık plan / üretken strüktür / sonsuz varyasyon',
    soundCredit: 'Ses: “Contemplation” — Joth / CC0',
    footerHelp: 'seçim: o noktadan üret &nbsp;·&nbsp; <kbd>CTRL</kbd> + seçim: kaldır &nbsp;·&nbsp; sürükle: döndür',
    statusReady: 'HAZIR', statusRunning: 'ÜRETİLİYOR', statusRunningProgress: 'ÜRETİLİYOR {current}/{total}',
    statusPaused: 'DURAKLATILDI', statusComplete: 'TAMAMLANDI', statusNoCells: 'UYGUN HÜCRE KALMADI',
    statusDeconstructing: 'ÇÖZÜLÜYOR', statusSupports: 'TAŞIYICILAR ÇÖZÜLÜYOR', statusVoid: 'HİÇLİK',
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
    instructionContinue: '<strong>THE CYCLE IS COMPLETE</strong><br>Only the plane remains.',
    moduleMeta: 'MODULES', coreMeta: 'SUPPORTS', destroyedMeta: 'DESTROYED', reset: 'RESET', pause: 'PAUSE', resume: 'RESUME',
    audioOn: 'SOUND ON', audioOff: 'SOUND OFF', languageLabel: 'Language selection', exportLabel: 'Download view as PNG',
    canvasLabel: 'Three-dimensional generative structure area',
    footerManifesto: 'Open plan / generative structure / infinite variation',
    soundCredit: 'Sound: “Contemplation” — Joth / CC0',
    footerHelp: 'select: construct from that point &nbsp;·&nbsp; <kbd>CTRL</kbd> + select: remove &nbsp;·&nbsp; drag: orbit',
    statusReady: 'READY', statusRunning: 'GENERATING', statusRunningProgress: 'GENERATING {current}/{total}',
    statusPaused: 'PAUSED', statusComplete: 'COMPLETE', statusNoCells: 'NO AVAILABLE CELLS',
    statusDeconstructing: 'DECONSTRUCTING', statusSupports: 'SUPPORTS COLLAPSING', statusVoid: 'VOID',
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
  destroyedCount: document.querySelector('#destroyed-count'),
  notice: document.querySelector('#notice'),
  backgroundAudio: document.querySelector('#background-audio'),
  threeVersion: document.querySelector('#three-version'),
  paletteButtons: [...document.querySelectorAll('[data-palette]')],
  languageButtons: [...document.querySelectorAll('[data-lang]')],
  axisLabels: [...document.querySelectorAll('.axis-labels span')],
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 1, 5, 4200);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
const controls = new OrbitControls(camera, renderer.domElement);
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const structureGroup = new THREE.Group();
const sceneBounds = new THREE.Box3();
const sceneCenter = new THREE.Vector3();
const sceneSize = new THREE.Vector3();
const cameraDesiredPosition = new THREE.Vector3();
const destructionLightTarget = new THREE.Vector3();
const constructionLightColor = new THREE.Color(0xfff0d8);
const destructionLightColor = new THREE.Color(0xff9c78);

let grid;
let ground;
let voxelGeometry;
let sunLight;
let fillLight;
let destructionLight;
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
let constructedCount = 0;
let constructionSinceDestruction = 0;
let destructionQueued = false;
let destroyedCount = 0;
let birthSequence = 0;
let collapsePhase = 'mass';
let interventionCount = 0;
let cameraInteractionActive = false;
let cameraAutoFrameAfter = 0;
let lastShadowExtent = 0;

const voxels = new Map();
const cores = new Set();
const growthCores = new Set();
const collapsingVoxels = new Map();
const backgroundAudio = elements.backgroundAudio;
backgroundAudio.loop = true;
backgroundAudio.preload = 'auto';
backgroundAudio.volume = 0;

let audioWanted = true;
let audioPlaying = true;
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
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.setAttribute('tabindex', '0');
  elements.viewport.prepend(renderer.domElement);

  scene.add(structureGroup);
  scene.add(new THREE.HemisphereLight(0xfff7e9, 0x273642, 0.72));

  sunLight = new THREE.DirectionalLight(0xfff0d8, 2.45);
  sunLight.position.set(480, 760, 320);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.bias = -0.00018;
  sunLight.shadow.normalBias = 0.035;
  sunLight.shadow.camera.near = 40;
  sunLight.shadow.camera.far = 2600;
  scene.add(sunLight, sunLight.target);

  fillLight = new THREE.DirectionalLight(0x9cb4d3, 0.38);
  fillLight.position.set(-400, 240, -360);
  scene.add(fillLight);

  destructionLight = new THREE.PointLight(0xd13b2f, 0, 520, 2);
  destructionLight.position.set(0, 80, 0);
  scene.add(destructionLight);

  controls.enableDamping = true;
  controls.dampingFactor = 0.045;
  controls.minDistance = 180;
  controls.maxDistance = 2600;
  controls.minPolarAngle = Math.PI * 0.12;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.zoomToCursor = true;
  controls.enablePan = false;
  controls.target.set(0, 20, 0);

  camera.position.set(620, 560, 820);
  camera.setFocalLength(45);
  controls.update();

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
  controls.addEventListener('start', () => {
    cameraInteractionActive = true;
  });
  controls.addEventListener('end', () => {
    cameraInteractionActive = false;
    cameraAutoFrameAfter = performance.now() + 4200;
  });
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
  document.addEventListener('click', startDefaultAudio, { capture: true });
  backgroundAudio.addEventListener('ended', recoverAudioPlayback);
  backgroundAudio.addEventListener('stalled', recoverAudioPlayback);
  backgroundAudio.addEventListener('pause', () => {
    audioPlaying = false;
    updateActionLabels();
  });
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
  elements.audio.setAttribute('aria-pressed', String(audioPlaying));
  elements.audio.textContent = t(audioPlaying ? 'audioOff' : 'audioOn');
  elements.pause.textContent = t(paused ? 'resume' : 'pause');
}

function startDefaultAudio(event) {
  if (!audioWanted || !backgroundAudio.paused) return;
  attemptDefaultAudio();
}

function attemptDefaultAudio() {
  if (!audioWanted || !backgroundAudio.paused) return;
  backgroundAudio.play().then(() => {
    audioPlaying = true;
    updateActionLabels();
    fadeAudio(0.2, 900);
  }).catch(() => {
    // Keep the default sound-on intent visible; the first user gesture retries playback.
    audioPlaying = true;
    updateActionLabels();
  });
}

async function toggleAudio() {
  if (audioPlaying || !backgroundAudio.paused) {
    audioWanted = false;
    audioPlaying = false;
    updateActionLabels();
    fadeAudio(0, 500, () => backgroundAudio.pause());
    return;
  }

  audioWanted = true;
  try {
    await backgroundAudio.play();
    audioPlaying = true;
    updateActionLabels();
    fadeAudio(0.2, 900);
  } catch {
    audioPlaying = false;
    updateActionLabels();
    showNotice(t('noticeAudioFailed'));
  }
}

function fadeAudio(targetVolume, duration, onComplete) {
  if (audioFadeFrame) cancelAnimationFrame(audioFadeFrame);
  const startVolume = backgroundAudio.volume;
  const startedAt = performance.now();

  function step(now) {
    const progress = THREE.MathUtils.clamp((now - startedAt) / duration, 0, 1);
    const eased = 1 - ((1 - progress) ** 3);
    backgroundAudio.volume = THREE.MathUtils.clamp(
      THREE.MathUtils.lerp(startVolume, targetVolume, eased),
      0,
      1,
    );
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
  if (!document.hidden && audioWanted) attemptDefaultAudio();
}

function recoverAudioPlayback() {
  if (!audioWanted) return;
  if (backgroundAudio.ended) backgroundAudio.currentTime = 0;
  attemptDefaultAudio();
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
    new THREE.MeshStandardMaterial({
      color: palette.background,
      emissive: palette.accent,
      emissiveIntensity: 0.025,
      roughness: 0.92,
      metalness: 0,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
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
  const seed = 'CORBUSIER-1923';

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
  const structureHit = raycaster.intersectObjects(structureGroup.children, false)[0];

  if (event.ctrlKey || event.metaKey) {
    if (status === 'running' || status === 'collapse') {
      showNotice(t('noticeDeleteWhileRunning'));
      return;
    }
    if (structureHit) removeVoxel(structureHit.object.userData.key);
    return;
  }

  if (structureHit && (status === 'running' || status === 'collapse')) {
    continueConstruction({ anchorKey: structureHit.object.userData.key });
    return;
  }

  const groundHit = raycaster.intersectObject(ground, false)[0];
  if (!groundHit) return;

  if (status === 'ready' || status === 'void') {
    startStructure(groundHit.point);
    return;
  }

  if (status === 'running' || status === 'collapse') {
    continueConstruction({ point: groundHit.point });
  }
}

function startStructure(point) {
  const settings = readSettings();
  cubeLength = settings.cubeLength;
  targetModuleCount = settings.iteration;
  targetCoreCount = Math.max(1, Math.round(targetModuleCount * settings.corePercentage / 100));
  constructedCount = 0;
  constructionSinceDestruction = 0;
  destructionQueued = false;
  destroyedCount = 0;
  birthSequence = 0;
  collapsePhase = 'mass';
  interventionCount = 0;
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

  if (addVoxel(start, 'core')) {
    constructedCount = 1;
    constructionSinceDestruction = 1;
  }
  setConfigurationLocked(true);
  elements.instruction.classList.add('is-hidden');
  elements.pause.disabled = false;
  updateActionLabels();
  setStatus('statusRunning');
  scheduleNextStep(runToken, settings.interval);
}

function continueConstruction({ anchorKey, point }) {
  const settings = readSettings();
  runToken += 1;
  interventionCount += 1;
  cancelAllCollapses();
  status = 'running';
  paused = false;
  collapsePhase = 'mass';
  growthCores.clear();

  let anchor = anchorKey ? voxels.get(anchorKey) : null;
  if (!anchor && point) {
    const position = {
      x: snapCoordinate(point.x),
      y: cubeLength / 2,
      z: snapCoordinate(point.z),
    };
    const key = positionKey(position);
    anchor = voxels.get(key);
    if (!anchor && addVoxel(position, 'core')) {
      anchor = voxels.get(key);
      constructedCount += 1;
    }
  }
  if (!anchor) return;

  promoteToCore(anchor);
  growthCores.add(anchor.key);
  targetModuleCount = constructedCount + settings.iteration;
  targetCoreCount = cores.size
    + Math.max(1, Math.round(settings.iteration * settings.corePercentage / 100));
  random = mulberry32(hashSeed(
    `${settings.seed}:${anchor.key}:${constructedCount}:${destroyedCount}`,
  ));

  setConfigurationLocked(true);
  elements.instruction.classList.add('is-hidden');
  elements.pause.disabled = false;
  updateActionLabels();
  updateCounters();
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
  voxel.mesh.material.transparent = false;
  voxel.mesh.material.opacity = 1;
  voxel.mesh.material.depthWrite = true;
  voxel.mesh.castShadow = false;
  voxel.mesh.material.needsUpdate = true;
  cores.add(voxel.key);
}

function snapCoordinate(value) {
  const snapped = Math.floor(value / cubeLength) * cubeLength + cubeLength / 2;
  const groundLimit = cubeLength * 10 - cubeLength / 2;
  return THREE.MathUtils.clamp(snapped, -groundLimit, groundLimit);
}

function scheduleNextStep(token, interval) {
  if (token !== runToken || paused || status !== 'running') return;
  if (constructedCount >= targetModuleCount) {
    beginFinalCollapse(token, interval);
    return;
  }

  const nextDelay = destructionQueued
    ? getDeconstructionInterval(interval)
    : getConstructionInterval(interval);

  window.setTimeout(() => {
    if (token !== runToken || paused || status !== 'running') return;

    if (destructionQueued && destroyOldestBlock(interval)) {
      destructionQueued = false;
      scheduleNextStep(token, interval);
      return;
    }

    const frontier = getFrontier();
    if (frontier.length === 0) {
      beginFinalCollapse(token, interval);
      return;
    }

    const position = frontier[Math.floor(random() * frontier.length)];
    if (addVoxel(position, chooseVoxelType())) {
      constructedCount += 1;
      constructionSinceDestruction += 1;
      if (constructionSinceDestruction >= getConstructionPerDestruction()) {
        constructionSinceDestruction = 0;
        destructionQueued = true;
      }
      updateCounters();
    }
    scheduleNextStep(token, interval);
  }, nextDelay);
}

function getConstructionInterval(baseInterval) {
  return Math.max(16, baseInterval * (1 + interventionCount * 0.38));
}

function getDeconstructionInterval(baseInterval) {
  return Math.max(18, baseInterval / (1 + interventionCount * 0.72));
}

function getConstructionPerDestruction() {
  return Math.max(2, 5 - interventionCount);
}

function getDeconstructionDuration(baseInterval, finalCollapse = false) {
  const baseDuration = finalCollapse
    ? Math.max(720, baseInterval * 7)
    : Math.max(620, baseInterval * 6);
  return Math.max(220, baseDuration / (1 + interventionCount * 0.48));
}

function getFrontier() {
  const candidates = new Map();
  for (const coreKey of growthCores) {
    const core = voxels.get(coreKey);
    if (!core) continue;
    collectOpenNeighbors(core, candidates);
  }
  if (candidates.size > 0) return [...candidates.values()];

  const originKey = growthCores.values().next().value;
  const origin = voxels.get(originKey);
  if (!origin) return [];

  let nearestDistance = Infinity;
  for (const coreKey of cores) {
    if (growthCores.has(coreKey)) continue;
    const core = voxels.get(coreKey);
    if (!core) continue;
    const localCandidates = new Map();
    collectOpenNeighbors(core, localCandidates);
    if (localCandidates.size === 0) continue;
    const distance = Math.abs(core.position.x - origin.position.x)
      + Math.abs(core.position.y - origin.position.y)
      + Math.abs(core.position.z - origin.position.z);
    if (distance > nearestDistance) continue;
    if (distance < nearestDistance) {
      nearestDistance = distance;
      candidates.clear();
    }
    for (const [key, position] of localCandidates) candidates.set(key, position);
  }
  return [...candidates.values()];
}

function collectOpenNeighbors(voxel, candidates) {
  for (const direction of DIRECTIONS) {
    const position = {
      x: voxel.position.x + direction.x * cubeLength,
      y: voxel.position.y + direction.y * cubeLength,
      z: voxel.position.z + direction.z * cubeLength,
    };
    const key = positionKey(position);
    if (!voxels.has(key) && isAllowedPosition(position)) candidates.set(key, position);
  }
}

function isAllowedPosition(position) {
  const isGroundLevel = Math.abs(position.y - cubeLength / 2) < 0.001;
  if (!isGroundLevel) return true;
  const groundLimit = cubeLength * 10 - cubeLength / 2;
  return Math.abs(position.x) <= groundLimit && Math.abs(position.z) <= groundLimit;
}

function chooseVoxelType() {
  const coresNeeded = targetCoreCount - cores.size;
  const placementsRemaining = targetModuleCount - constructedCount;
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

  voxels.set(key, {
    key,
    type,
    position: { ...position },
    mesh,
    bornOrder: birthSequence,
  });
  birthSequence += 1;
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
  finalizeVoxelRemoval(key, false);
  updateCounters();
  showNotice(t('noticeRemoved'));
}

function positionKey({ x, y, z }) {
  return `${x},${y},${z}`;
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
  collapsingVoxels.clear();
  cores.clear();
  growthCores.clear();
  constructedCount = 0;
  constructionSinceDestruction = 0;
  destructionQueued = false;
  destroyedCount = 0;
  birthSequence = 0;
  collapsePhase = 'mass';
  interventionCount = 0;
  setConfigurationLocked(false);
  elements.pause.disabled = true;
  updateActionLabels();
  elements.instruction.classList.remove('is-hidden');
  setInstruction('instruction');
  setStatus('statusReady');
  updateCounters();
}

function setConfigurationLocked(locked) {
  for (const input of [elements.iteration, elements.interval, elements.cubeLength, elements.core]) {
    input.disabled = locked;
  }
}

function selectPalette(name) {
  if (!PALETTES[name]) return;
  activePalette = name;
  const palette = PALETTES[name];
  scene.background = new THREE.Color(palette.background);
  rebuildConstructionPlane({ rebuildVoxelGeometry: voxels.size === 0 });
  updateAxisColors(palette);

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

function updateAxisColors(palette) {
  const colors = [palette.core, palette.block, palette.accent];
  elements.axisLabels.forEach((label, index) => {
    const color = colors[index];
    label.style.backgroundColor = `#${color.toString(16).padStart(6, '0')}`;
    label.style.color = getContrastColor(color);
  });
}

function getContrastColor(hexColor) {
  const red = (hexColor >> 16) & 255;
  const green = (hexColor >> 8) & 255;
  const blue = hexColor & 255;
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000;
  return luminance > 150 ? '#11110f' : '#ffffff';
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
  elements.destroyedCount.textContent = String(destroyedCount).padStart(3, '0');
  if (status === 'running') {
    setStatus('statusRunningProgress', { current: constructedCount, total: targetModuleCount });
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

function getOldestVoxel(type) {
  let oldest = null;
  for (const voxel of voxels.values()) {
    if (voxel.type !== type || collapsingVoxels.has(voxel.key)) continue;
    if (!oldest || voxel.bornOrder < oldest.bornOrder) oldest = voxel;
  }
  return oldest;
}

function destroyOldestBlock(interval) {
  const voxel = getOldestVoxel('block');
  if (!voxel) return false;
  return beginVoxelCollapse(voxel.key, getDeconstructionDuration(interval));
}

function beginVoxelCollapse(key, duration = 900) {
  const voxel = voxels.get(key);
  if (!voxel || collapsingVoxels.has(key)) return false;
  clearHover();
  voxel.mesh.material.transparent = true;
  voxel.mesh.material.depthWrite = false;
  voxel.mesh.material.emissive.setHex(PALETTES[activePalette].accent);
  voxel.mesh.material.needsUpdate = true;
  collapsingVoxels.set(key, {
    key,
    startedAt: performance.now(),
    duration,
    startY: voxel.mesh.position.y,
    spinDirection: (hashSeed(key) & 1) === 0 ? -1 : 1,
  });
  return true;
}

function cancelAllCollapses() {
  for (const key of collapsingVoxels.keys()) {
    const voxel = voxels.get(key);
    if (!voxel) continue;
    voxel.mesh.position.copy(voxel.position);
    voxel.mesh.rotation.set(0, 0, 0);
    voxel.mesh.scale.setScalar(1);
    voxel.mesh.material.opacity = 1;
    voxel.mesh.material.transparent = false;
    voxel.mesh.material.depthWrite = true;
    voxel.mesh.material.emissive.setHex(0x000000);
    voxel.mesh.material.emissiveIntensity = 0;
    voxel.mesh.material.needsUpdate = true;
  }
  collapsingVoxels.clear();
  destructionLight.intensity = 0;
}

function finalizeVoxelRemoval(key, countAsDestruction = true) {
  const voxel = voxels.get(key);
  if (!voxel) return;
  structureGroup.remove(voxel.mesh);
  voxel.mesh.material.dispose();
  voxels.delete(key);
  collapsingVoxels.delete(key);
  cores.delete(key);
  growthCores.delete(key);
  if (countAsDestruction) destroyedCount += 1;
  updateCounters();
}

function beginFinalCollapse(token, interval) {
  if (token !== runToken) return;
  status = 'collapse';
  paused = false;
  collapsePhase = 'mass';
  elements.pause.disabled = true;
  updateActionLabels();
  setStatus('statusDeconstructing');
  window.setTimeout(
    () => scheduleFinalCollapse(token, interval),
    Math.max(360, 1300 / (1 + interventionCount * 0.5)),
  );
}

function scheduleFinalCollapse(token, interval) {
  if (token !== runToken || status !== 'collapse') return;
  const type = collapsePhase === 'mass' ? 'block' : 'core';
  const candidate = getOldestVoxel(type);

  if (candidate) {
    beginVoxelCollapse(candidate.key, getDeconstructionDuration(interval, true));
    window.setTimeout(
      () => scheduleFinalCollapse(token, interval),
      Math.max(
        28,
        (interval * (collapsePhase === 'mass' ? 1.6 : 2.2))
          / (1 + interventionCount * 0.68),
      ),
    );
    return;
  }

  const typeStillCollapsing = [...collapsingVoxels.keys()]
    .some((key) => voxels.get(key)?.type === type);
  if (typeStillCollapsing) {
    window.setTimeout(() => scheduleFinalCollapse(token, interval), 120);
    return;
  }

  if (collapsePhase === 'mass') {
    collapsePhase = 'supports';
    setStatus('statusSupports');
    window.setTimeout(
      () => scheduleFinalCollapse(token, interval),
      Math.max(480, 1800 / (1 + interventionCount * 0.5)),
    );
    return;
  }

  if (voxels.size > 0 || collapsingVoxels.size > 0) {
    window.setTimeout(() => scheduleFinalCollapse(token, interval), 120);
    return;
  }
  finishVoid();
}

function finishVoid() {
  status = 'void';
  setStatus('statusVoid');
  setInstruction('instructionContinue');
  elements.instruction.classList.remove('is-hidden');
}

function updateCollapseAnimations(now) {
  destructionLightTarget.set(0, cubeLength, 0);
  let activeCount = 0;

  for (const [key, collapse] of collapsingVoxels) {
    const voxel = voxels.get(key);
    if (!voxel) continue;
    const progress = THREE.MathUtils.clamp(
      (now - collapse.startedAt) / collapse.duration,
      0,
      1,
    );
    const fall = progress * progress;
    const shrink = Math.max(0.025, 1 - fall * 0.96);
    voxel.mesh.position.y = collapse.startY - cubeLength * (fall * 2.6);
    voxel.mesh.rotation.x = fall * 0.75 * collapse.spinDirection;
    voxel.mesh.rotation.z = fall * 1.15 * collapse.spinDirection;
    voxel.mesh.scale.set(shrink, Math.max(0.018, 1 - fall * 1.18), shrink);
    voxel.mesh.material.opacity = 1 - fall;
    voxel.mesh.material.emissiveIntensity = 0.12 + Math.sin(progress * Math.PI) * 0.72;
    destructionLightTarget.add(voxel.mesh.position);
    activeCount += 1;
    if (progress >= 1) finalizeVoxelRemoval(key);
  }

  if (activeCount > 0) destructionLightTarget.multiplyScalar(1 / (activeCount + 1));
  destructionLight.position.lerp(destructionLightTarget, 0.08);
  destructionLight.intensity = THREE.MathUtils.lerp(
    destructionLight.intensity,
    activeCount > 0 ? 1150 + activeCount * 90 : 0,
    0.08,
  );
}

function updateCinematicCameraAndLights(now) {
  sceneBounds.makeEmpty();
  if (structureGroup.children.length > 0) sceneBounds.expandByObject(structureGroup);
  if (sceneBounds.isEmpty()) {
    sceneCenter.set(0, cubeLength, 0);
    sceneSize.set(cubeLength * 8, cubeLength * 4, cubeLength * 8);
  } else {
    sceneBounds.getCenter(sceneCenter);
    sceneBounds.getSize(sceneSize);
  }

  const dramaticPhase = status === 'collapse' || status === 'void';
  const targetY = dramaticPhase
    ? THREE.MathUtils.clamp(sceneCenter.y * 0.28, cubeLength * 0.35, cubeLength * 1.4)
    : THREE.MathUtils.clamp(sceneCenter.y * 0.48, cubeLength, cubeLength * 3);
  const maxDimension = Math.max(sceneSize.x, sceneSize.y, sceneSize.z, cubeLength * 8);
  const desiredDistance = THREE.MathUtils.clamp(
    (maxDimension * 0.76) / Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)),
    760,
    2200,
  );

  if (!cameraInteractionActive && now >= cameraAutoFrameAfter) {
    const orbitAngle = now * (dramaticPhase ? 0.000085 : 0.000045) + 0.72;
    const verticalRatio = dramaticPhase ? 0.2 : 0.42;
    const horizontalDistance = desiredDistance * Math.sqrt(1 - verticalRatio ** 2);
    controls.target.lerp(new THREE.Vector3(sceneCenter.x, targetY, sceneCenter.z), 0.018);
    cameraDesiredPosition.set(
      sceneCenter.x + Math.cos(orbitAngle) * horizontalDistance,
      targetY + desiredDistance * verticalRatio,
      sceneCenter.z + Math.sin(orbitAngle) * horizontalDistance,
    );
    camera.position.lerp(cameraDesiredPosition, dramaticPhase ? 0.014 : 0.009);
  }

  const lightAngle = now * (dramaticPhase ? 0.00011 : 0.000052) + 1.1;
  const lightRadius = Math.max(520, maxDimension * 1.35);
  sunLight.target.position.lerp(sceneCenter, 0.035);
  sunLight.position.set(
    sceneCenter.x + Math.cos(lightAngle) * lightRadius,
    sceneCenter.y + 620 + Math.sin(now * 0.0007) * 110,
    sceneCenter.z + Math.sin(lightAngle) * lightRadius,
  );
  sunLight.color.lerp(dramaticPhase ? destructionLightColor : constructionLightColor, 0.025);
  sunLight.intensity = THREE.MathUtils.lerp(
    sunLight.intensity,
    dramaticPhase ? 2.9 + Math.sin(now * 0.003) * 0.32 : 2.35,
    0.035,
  );
  fillLight.position.set(
    sceneCenter.x - Math.cos(lightAngle) * lightRadius * 0.72,
    sceneCenter.y + 180,
    sceneCenter.z - Math.sin(lightAngle) * lightRadius * 0.72,
  );
  fillLight.intensity = THREE.MathUtils.lerp(fillLight.intensity, dramaticPhase ? 0.18 : 0.42, 0.03);
  renderer.toneMappingExposure = THREE.MathUtils.lerp(
    renderer.toneMappingExposure,
    status === 'void' ? 0.72 : dramaticPhase ? 0.88 : 1.05,
    0.02,
  );

  const shadowExtent = THREE.MathUtils.clamp(maxDimension * 0.68, 240, 1050);
  if (Math.abs(shadowExtent - lastShadowExtent) > 20) {
    sunLight.shadow.camera.left = -shadowExtent;
    sunLight.shadow.camera.right = shadowExtent;
    sunLight.shadow.camera.top = shadowExtent;
    sunLight.shadow.camera.bottom = -shadowExtent;
    sunLight.shadow.camera.updateProjectionMatrix();
    lastShadowExtent = shadowExtent;
  }
}

function render(now = performance.now()) {
  updateCollapseAnimations(now);
  updateCinematicCameraAndLights(now);
  controls.update();
  renderer.render(scene, camera);
}
