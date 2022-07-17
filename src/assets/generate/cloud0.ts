import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default async function makeCloud0(cnt: number, useIdx?: number) {
  const ModelCnts = 4;
  const models = await Promise.all(
    Array(ModelCnts)
      .fill(1)
      .map((_, idx) => {
        return new GLTFLoader().loadAsync(
          `src/assets/models/clouds/Cloud_${idx+1}.glb`
        );
      })
  );

  const cloudInstances = [];

  for (let i = 0; i < cnt; i++) {
    const idx =
      typeof useIdx !== "undefined"
        ? useIdx
        : Math.floor(Math.random() * ModelCnts);
    const newCloud = models[idx].scene.clone();
    newCloud.rotateY((90 / 180) * Math.PI);
    cloudInstances.push(newCloud);
  }

  return cloudInstances;
}
