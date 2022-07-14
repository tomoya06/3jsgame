/** 云层 */
const smokeLoader = new THREE.TextureLoader();
const smokeTexture = await smokeLoader.loadAsync(
  "src/assets/textures/smoke.png"
);
const cloudGeo = new THREE.PlaneBufferGeometry(10, 10);
const cloudMaterial = new THREE.MeshLambertMaterial({
  map: smokeTexture,
  transparent: true,
});
const cloudParticles: THREE.Mesh[] = [];
for (let p = 0; p < 50; p++) {
  const cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
  cloud.position.set(Math.random() * 10 - 5, 2, Math.random() * 10 - 5);
  cloud.rotation.x = 1.16;
  cloud.rotation.y = -0.12;
  cloud.rotation.z = Math.random() * 2 * Math.PI;
  cloud.material.opacity = 0.55;
  cloudParticles.push(cloud);
  // scene.add(cloud);
}
/** 云层 */

// 云层
cloudParticles.forEach((cl) => {
  cl.rotation.z -= 0.001;
});

export {};
