import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import Stats from "stats.js";
import { Sky } from "./models/sky";
import { Ground } from "./models/ground";
import { Plane } from "./models/plane";
import { Sun } from "./models/sun";
import timeSystem from "./system/time";
import Space from "./models/space";
import BaseModel from "./models/base";
import * as POSTPROCESSING from "postprocessing";

/** 场景 & 相机 */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  1,
  400
);
camera.position.set(-40, 200, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
document.body.appendChild(renderer.domElement);

const cone = new THREE.Mesh(
  new THREE.ConeGeometry(1, 2, 50),
  new THREE.MeshBasicMaterial({ color: 0x000000 })
);
cone.position.set(0, 180, -1);
cone.rotation.set(-0.5 * Math.PI, 0, 0);
scene.add(cone);
const circle = new THREE.Mesh(
  new THREE.OctahedronGeometry(0.4),
  new THREE.MeshBasicMaterial({ color: 0xfeefd5 })
);
circle.position.set(0, 180, 0);
scene.add(circle);
const godray = new POSTPROCESSING.GodRaysEffect(camera, circle, {
  resolutionScale: 1,
  density: 0.8,
  decay: 1,
  weight: 0.6,
  samples: 60,
  exposure: 0.1,
});
const renderPass = new POSTPROCESSING.RenderPass(scene, camera);
const effectPass = new POSTPROCESSING.EffectPass(camera, godray);
effectPass.renderToScreen = true;
const composer = new POSTPROCESSING.EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(effectPass);

// 性能监控
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);
/** 场景 & 相机 */

/** 辅助器 */
async function initGeneralHelper() {
  const gridHelper = new THREE.GridHelper(100, 10);
  scene.add(gridHelper);
  // 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  // 打坐标轴
  const fontMaterials = [
    new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
    new THREE.MeshPhongMaterial({ color: 0xffffff }), // side
  ];
  const font = await new FontLoader().loadAsync(
    "src/assets/fonts/helvetiker_regular.typeface.json"
  );
  [
    [10, 0, 0],
    [0, 10, 0],
    [0, 0, 10],
  ].map((ord) => {
    const geo = new TextGeometry(`[${ord.join(",")}]`, {
      font,
    });
    const mesh = new THREE.Mesh(geo, fontMaterials);
    mesh.position.set(ord[0], ord[1], ord[2]);
    mesh.scale.set(0.001, 0.001, 0.001);
    mesh.rotateY((-90 / 180) * Math.PI);
    scene.add(mesh);
  });
}

/** 灯光 */
function initLights() {}

const worldModels: BaseModel[] = [];
let plane: Plane;

async function initModels() {
  const [planeModel] = await Promise.all([
    new GLTFLoader().loadAsync("src/assets/models/cartoon_plane/scene.gltf"),
  ]);

  plane = new Plane(planeModel);

  worldModels.push(new Sky(), new Ground(), new Sun(), new Space(), plane);

  worldModels.forEach((obj) => obj.init(scene));
}

/* 加载模型 */
async function init() {
  await initLights();
  await initGeneralHelper();
  await initModels();

  camera.lookAt(plane.obj.position);

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  stats.begin();
  /** 内置系统更新 */
  timeSystem.animate();

  /** 动画帧更新 */
  worldModels.forEach((obj) => obj.animate());

  // renderer.render(scene, camera);
  composer.render();

  stats.end();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
window.addEventListener("resize", onWindowResize, false);
