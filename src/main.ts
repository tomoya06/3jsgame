import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import Stats from "stats.js";
import { Sky } from "./models/sky";
import { Ground } from "./models/ground";
import { Plane } from "./models/plane";

/** 场景 & 相机 */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(-40, 200, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
document.body.appendChild(renderer.domElement);

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
function initLights() {
  const light1 = new THREE.DirectionalLight(0xffffff, 1.0);
  const light1Helper = new THREE.DirectionalLightHelper(light1);
  light1.position.set(1, 1, 0).normalize();
  scene.add(light1);
  scene.add(light1Helper);

  const light2 = new THREE.DirectionalLight(0xff5566, 1.0);
  light2.position.set(-3, -1, 0).normalize();
  const light2Helper = new THREE.DirectionalLightHelper(light2);
  scene.add(light2);
  scene.add(light2Helper);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  const fogColor = new THREE.Color(0xffffff);
  scene.fog = new THREE.Fog(fogColor, 80, 200);
}

let sky: Sky, ground: Ground, plane: Plane;

async function initModels() {
  const [planeModel] = await Promise.all([
    new GLTFLoader().loadAsync("src/assets/models/cartoon_plane/scene.gltf"),
  ]);

  sky = new Sky();
  sky.init(scene);

  ground = new Ground();
  ground.init(scene);

  plane = new Plane(planeModel);
  plane.init(scene);
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

  /** 动画帧更新 */
  plane.animate();
  sky.animate();
  ground.animate();

  // controls.update();
  renderer.render(scene, camera);

  stats.end();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
window.addEventListener("resize", onWindowResize, false);

window.addEventListener("keydown", (e) => {});
