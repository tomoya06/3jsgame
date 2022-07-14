import * as THREE from "three";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
import { IVertices } from "../../interface";

// @see https://codepen.io/dennishadley/pen/KEXVWm?editors=0010
const getRandomInRange = function (min: number, max: number) {
  return Math.random() * (max - min) + min;
};

const createTuft = function (
  baseCloudSize: number,
  tuftSize: number,
  farSide: boolean
) {
  const calcTuftXPosition = function (cloudR: number, tuftR: number) {
    const minOffset = tuftR * 0.4;
    const maxOffset = tuftR;
    const offset = getRandomInRange(minOffset, maxOffset);
    return cloudR * 2 - (cloudR - tuftR) - offset;
  };

  const calcTuftZPosition = function (cloudR: number, tuftR: number) {
    const minOffset = tuftR * 0.4;
    const maxOffset = tuftR * 0.6;
    const offset = getRandomInRange(minOffset, maxOffset);
    const negative = Number(Math.random() >= 0.5);
    return offset * negative ? -1 : 1;
  };

  const tuft = new THREE.SphereGeometry(tuftSize, 10, 10);
  const tuftXPos =
    calcTuftXPosition(baseCloudSize, tuftSize) * (farSide ? -1 : 1);
  const tuftZPos = calcTuftZPosition(baseCloudSize, tuftSize);

  tuft.translate(tuftXPos, 0, tuftZPos);

  return tuft;
};

const map = (
  val: number,
  smin: number,
  smax: number,
  emin: number,
  emax: number
) => ((emax - emin) * (val - smin)) / (smax - smin) + emin;

export default function makeCloud() {
  // @see https://stackoverflow.com/a/67865461/8356786
  const jitter = (geo: THREE.BufferGeometry, per: number) => {
    const positionAttribute = geo.getAttribute("position");
    const point = new THREE.Vector3();
    const vertices: IVertices = {};

    for (let i = 0; i < positionAttribute.count; i++) {
      point.fromBufferAttribute(positionAttribute, i);
      const key = [point.x, point.y, point.z].join(",");
      if (!vertices[key]) {
        vertices[key] = {
          x: (point.x += map(Math.random(), 0, 1, -per, per)),
          y: (point.y += map(Math.random(), 0, 1, -per, per)),
          z: (point.z += map(Math.random(), 0, 1, -per, per)),
        };
      }

      const { x, y, z } = vertices[key];
      positionAttribute.setXYZ(i, x, y, z);
    }
  };
  const chopBottom = (geo: THREE.BufferGeometry, bottom: number) => {
    const positionAttribute = geo.getAttribute("position");
    const point = new THREE.Vector3();
    const vertices: IVertices = {};

    for (let i = 0; i < positionAttribute.count; i++) {
      point.fromBufferAttribute(positionAttribute, i);
      const key = [point.x, point.y, point.z].join(",");
      if (!vertices[key]) {
        vertices[key] = {
          x: point.x,
          y: point.y = Math.max(point.y, bottom),
          z: point.z,
        };
      }

      const { x, y, z } = vertices[key];
      positionAttribute.setXYZ(i, x, y, z);
    }
  };
  const numTufts = 2;

  const minCloudSize = 1.2;
  const maxCloudSize = 2.2;

  const baseCloudSize = getRandomInRange(minCloudSize, maxCloudSize);
  const baseCloud = new THREE.SphereGeometry(baseCloudSize, 10, 10);

  baseCloud.translate(0, 0, 0);

  const tufts: THREE.SphereGeometry[] = [];

  for (var i = 0; i < numTufts; i++) {
    const tuftSize = getRandomInRange(minCloudSize, baseCloudSize * 0.6);
    const tuft = createTuft(
      baseCloudSize,
      tuftSize,
      i % 2 === 0 ? false : true
    );
    tufts.push(tuft);
  }

  const geo = mergeBufferGeometries([baseCloud, ...tufts]);

  jitter(geo, 0.2);
  chopBottom(geo, -0.4);
  geo.computeVertexNormals();
  // geo.computeFlatVertexNormals();

  return new THREE.Mesh(
    geo,
    new THREE.MeshLambertMaterial({
      color: 0xffffff,
    })
  );
}
