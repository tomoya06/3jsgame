import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import Stats from "stats.js";
import makeCloud2 from "./assets/generate/cloud2";

let mixer: THREE.AnimationMixer;

/** 场景 & 相机 */
const clock = new THREE.Clock();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(-30, 15, 0);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
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

  const fogColor = new THREE.Color(0xff5566);
  scene.fog = new THREE.Fog(fogColor, 1, 200);
}

async function initPlane() {
  /* 加载模型 */
  // 飞机
  const planeModel = await new GLTFLoader().loadAsync(
    "src/assets/models/cartoon_plane/scene.gltf"
  );

  const planeSize = 2;
  planeModel.scene.scale.set(planeSize, planeSize, planeSize);
  scene.add(planeModel.scene);

  const wheel = planeModel.scene.children[0];
  mixer = new THREE.AnimationMixer(wheel);
  mixer.clipAction(planeModel.animations[0]).play();
}

// 飞机动画
function animatePlane() {
  const delta = clock.getDelta();
  mixer.update(delta);
}

const cloudInstances: (THREE.Mesh | THREE.Group)[] = [];

// 云
async function createNewCloud() {
  const newCloud = makeCloud2();
  newCloud.position.z = 15;
  newCloud.position.y = 2 - Math.random() * 4;
  newCloud.position.x = (5 - Math.random() * 10) * 3;
  cloudInstances.push(newCloud);
  scene.add(newCloud);
}

// 云层动画
function animateCloud() {
  cloudInstances.forEach((cld) => {
    cld.position.z -= 0.01;
  });
}

function generateClouds() {
  if (Math.random() < 0.005) {
    createNewCloud();
    console.log("new cloud generated");
  }

  // TODO: 如果云层已经消失在左侧 则删掉
}

/* 加载模型 */

async function init() {
  await initLights();
  await initGeneralHelper();
  await initPlane();

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  stats.begin();

  /** 生成新元素 */
  generateClouds();

  /** 动画帧更新 */
  animateCloud();
  animatePlane();

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
