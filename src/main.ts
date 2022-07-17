import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import makeCloud0 from "./assets/generate/cloud0";
import Stats from "stats.js";

/** 场景 & 相机 */
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(-20, 10, 0);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
/** 场景 & 相机 */

/** 辅助器 */
const gridHelper = new THREE.GridHelper(100, 10);
scene.add(gridHelper);
// 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.object.position.set(
//   camera.position.x,
//   camera.position.y,
//   camera.position.z
// );

// 性能监控
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

/** 灯光 */
const light1 = new THREE.DirectionalLight(0xffffff, 1.0);
light1.position.set(1, 1, 0).normalize();
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xff5566, 1.0);
light2.position.set(-3, -1, 0).normalize();
scene.add(light2);
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const fogColor = new THREE.Color(0xff5566);
scene.fog = new THREE.Fog(fogColor, 1, 200);
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
const cloudInstances: (THREE.Mesh | THREE.Group)[] = [];
createNewCloud();

async function createNewCloud() {
  const newClouds = await makeCloud0(3);

  for (const cloud of newClouds) {
    const scale = Math.random() * 0.3 + 0.8;
    cloud.scale.set(scale, scale, scale);
    cloud.position.x = Math.random() * 10 - 5;
    cloud.position.z = Math.random() * 10 - 5;
    cloud.position.y = Math.random() * 4 - 2;

    scene.add(cloud);
    cloudInstances.push(cloud);
  }
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

  stats.begin();

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

window.addEventListener("resize", onWindowResize, false);
