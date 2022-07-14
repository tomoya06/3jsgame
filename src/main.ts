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
camera.position.z = 5;
camera.position.y = 3;
camera.position.x = -5;

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

/** 灯光 */
const light = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(light);
/** 灯光 */

/* 加载模型 */
// 飞机
const planeLoader = new GLTFLoader();
const planeModel = await planeLoader.loadAsync(
  "src/assets/models/cartoon_plane/scene.gltf"
);

planeModel.scene.scale.set(2, 2, 2);
scene.add(planeModel.scene);

const wheel = planeModel.scene.children[0];
const mixer = new THREE.AnimationMixer(wheel);
mixer.clipAction(planeModel.animations[0]).play();
/* 加载模型 */

animate();

function animate() {
  requestAnimationFrame(animate);

  /** 动画帧更新 */
  // 飞机
  const delta = clock.getDelta();
  mixer.update(delta);

  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);
