import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import Stats from "stats.js";
import * as TWEEN from "@tweenjs/tween.js";
import { EnumDirection } from "./type";
import { Sky } from "./models/sky";

let mixer: THREE.AnimationMixer;
let plane: THREE.Object3D;

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
  scene.fog = new THREE.Fog(fogColor, 80, 150);
}

async function initPlane() {
  /* 加载模型 */
  // 飞机
  const planeModel = await new GLTFLoader().loadAsync(
    "src/assets/models/cartoon_plane/scene.gltf"
  );

  const planeSize = 2;
  planeModel.scene.scale.set(planeSize, planeSize, planeSize);
  plane = new THREE.Object3D();
  plane.add(planeModel.scene.clone());

  scene.add(plane);

  const wheel = plane.children[0];
  mixer = new THREE.AnimationMixer(wheel);
  mixer.clipAction(planeModel.animations[0]).play();
}

// 飞机动画
function animatePlane(t: number) {
  const delta = clock.getDelta();
  mixer.update(delta);

  TWEEN.update(t);
}

// 移动飞机
function movePlane(params: { direction: EnumDirection }) {
  const moveUnit = 5;
  const leanUnit = 20;
  let nextPos = plane.position;
  let midAngle = { x: 0, y: 0, z: 0 };
  switch (params.direction) {
    case EnumDirection.UP:
      nextPos = new THREE.Vector3(
        undefined,
        plane.position.y + moveUnit,
        undefined
      );
      midAngle = { x: THREE.MathUtils.degToRad(-leanUnit), y: 0, z: 0 };
      break;
    case EnumDirection.DOWN:
      nextPos = new THREE.Vector3(
        undefined,
        plane.position.y - moveUnit,
        undefined
      );
      midAngle = { x: THREE.MathUtils.degToRad(leanUnit), y: 0, z: 0 };
      break;
    case EnumDirection.LEFT:
      nextPos = new THREE.Vector3(
        plane.position.x + moveUnit,
        undefined,
        undefined
      );
      midAngle = { x: 0, y: 0, z: THREE.MathUtils.degToRad(-leanUnit) };
      break;
    case EnumDirection.RIGHT:
      nextPos = new THREE.Vector3(
        plane.position.x - moveUnit,
        undefined,
        undefined
      );
      midAngle = { x: 0, y: 0, z: THREE.MathUtils.degToRad(leanUnit) };
      break;
    case EnumDirection.FRONT:
      nextPos = new THREE.Vector3(
        undefined,
        undefined,
        plane.position.z + moveUnit
      );
      break;
    case EnumDirection.BACK:
      nextPos = new THREE.Vector3(
        undefined,
        undefined,
        plane.position.z - moveUnit
      );
      break;
  }
  const endAngle = { x: 0, y: 0, z: 0 };

  new TWEEN.Tween(plane.position)
    .delay(60)
    .to(nextPos, 600)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(({ x, y, z }) => {
      plane.position.x = x;
      plane.position.y = y;
      plane.position.z = z;
    })
    .start();
  new TWEEN.Tween(plane.rotation)
    .to(midAngle, 250)
    .easing(TWEEN.Easing.Cubic.Out)
    .delay(100)
    .chain(
      new TWEEN.Tween(plane.rotation)
        .to(endAngle, 250)
        .easing(TWEEN.Easing.Cubic.In)
    )
    .onUpdate(({ x, y, z }) => {
      plane.rotateX(x);
      plane.rotateY(y);
      plane.rotateZ(z);
    })
    .start();
}

const sky = new Sky();
sky.init(scene);

/* 加载模型 */

async function init() {
  await initLights();
  await initGeneralHelper();
  await initPlane();

  animate(0);

  setTimeout(() => {
    movePlane({ direction: EnumDirection.BACK });
  }, 1000);
}

function animate(t: number) {
  requestAnimationFrame(animate);

  stats.begin();

  /** 动画帧更新 */
  animatePlane(t);
  sky.animate();

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
