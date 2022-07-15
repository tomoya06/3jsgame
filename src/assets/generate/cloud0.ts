import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default async function makeCloud0() {
  const NumsOfCloudModels = 1;
  const cloudModelUrls = Array(NumsOfCloudModels)
    .fill(0)
    .map((_, idx) => `src/assets/models/polyclouds/AnyConv.com__Cloud_${idx+1}.gltf`);
  
  const cloudMetrial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const cloudModels = await Promise.all(
    cloudModelUrls.map(async (url) => {
      const model = await new GLTFLoader().loadAsync(url);
      return model;
    })
  );

  return null;
}

