import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/** 场景 & 相机 */
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.z = 10;
camera.position.y = 6;
camera.position.x = -10;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
/** 场景 & 相机 */

/** 辅助器 */
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);
// 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
const controls = new OrbitControls(camera, renderer.domElement);
controls.object.position.set(
  camera.position.x,
  camera.position.y,
  camera.position.z
);

/** 灯光 */
const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xff8c19);
directionalLight.position.set(0, 0, 1);
scene.add(directionalLight);
/** 灯光 */

/* 加载模型 */
// 飞机
const planeModel = await new GLTFLoader().loadAsync(
  "src/assets/models/cartoon_plane/scene.gltf"
);

const planeSize = 1;
planeModel.scene.scale.set(planeSize, planeSize, planeSize);
scene.add(planeModel.scene);

const wheel = planeModel.scene.children[0];
const mixer = new THREE.AnimationMixer(wheel);
mixer.clipAction(planeModel.animations[0]).play();

// 飞机动画
function animatePlane() {
  const delta = clock.getDelta();
  mixer.update(delta);
}

// 云
const NumsOfCloudModels = 1;
const cloudModelUrls = Array(NumsOfCloudModels)
  .fill(0)
  .map((_, idx) => `src/assets/models/clouds/cloud${idx + 1}/scene.gltf`);

// const cloudMetrial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const cloudModels = await Promise.all(
  cloudModelUrls.map(async (url) => {
    const model = await new GLTFLoader().loadAsync(url);
    return model;
  })
);

const cloudInstances: THREE.Group[] = [];
const numsOfClouds = 100;
for (let i = 0; i < numsOfClouds; i++) {
  createNewCloud();
}

function createNewCloud() {
  const pickedIdx = Math.floor(Math.random() * NumsOfCloudModels);
  const pickedModel = cloudModels[pickedIdx];
  const newCloud = pickedModel.scene.clone();
  newCloud.scale.set(1, 1, 1);
  newCloud.position.set(
    Math.random() * 10 - 5,
    1 + Math.random() * 0.2 - 0.1,
    Math.random() * 100 - 10
  );

  scene.add(newCloud);
  cloudInstances.push(newCloud);
}

// 云层动画
function animateCloud() {
  cloudInstances.forEach((cld) => {
    cld.position.z -= 0.01;
  });
}

/* 加载模型 */

animate();

function animate() {
  requestAnimationFrame(animate);

  /** 动画帧更新 */
  animateCloud();
  animatePlane();

  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);
