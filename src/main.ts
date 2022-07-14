import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * =======
 * 场景 & 相机
 * =======
 */
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
/** 场景 & 相机 */

/**
 * =======
 * 灯光
 * =======
 */
const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
// Parallel rays
const shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

shadowLight.position.set(0, 350, 350);
shadowLight.castShadow = true;

// define the visible area of the projected shadow
shadowLight.shadow.camera.left = -650;
shadowLight.shadow.camera.right = 650;
shadowLight.shadow.camera.top = 650;
shadowLight.shadow.camera.bottom = -650;
shadowLight.shadow.camera.near = 1;
shadowLight.shadow.camera.far = 1000;

// Shadow map size
shadowLight.shadow.mapSize.width = 2048;
shadowLight.shadow.mapSize.height = 2048;

// Add the lights to the scene
scene.add(hemisphereLight);
scene.add(shadowLight);
/** 灯光 */

const planeLoader = new GLTFLoader();
const planeModel = await planeLoader.loadAsync(
  "src/assets/models/cartoon_plane/scene.gltf"
);

planeModel.scene.scale.set(0.5, 0.5, 0.5);
scene.add(planeModel.scene);

const wheel = planeModel.scene.children[0];
const mixer = new THREE.AnimationMixer(wheel);
mixer.clipAction(planeModel.animations[0]).play();

animate();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  mixer.update(delta);

  planeModel.scene.rotation.y += 0.01;

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);
