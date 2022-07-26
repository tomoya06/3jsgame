import * as THREE from "three";

export default function makeTree() {
  const mesh = new THREE.Group();

  var matTreeLeaves = new THREE.MeshPhongMaterial({
    color: 0x32a852,
    flatShading: true,
  });

  var geonTreeBase = new THREE.BoxGeometry(10, 20, 10);
  var matTreeBase = new THREE.MeshBasicMaterial({ color: 0x614719 });
  var treeBase = new THREE.Mesh(geonTreeBase, matTreeBase);
  mesh.add(treeBase);

  var geomTreeLeaves1 = new THREE.CylinderGeometry(1, 12 * 3, 12 * 3, 4);
  var treeLeaves1 = new THREE.Mesh(geomTreeLeaves1, matTreeLeaves);
  treeLeaves1.position.y = 20;
  mesh.add(treeLeaves1);

  var geomTreeLeaves2 = new THREE.CylinderGeometry(1, 9 * 3, 9 * 3, 4);
  var treeLeaves2 = new THREE.Mesh(geomTreeLeaves2, matTreeLeaves);
  treeLeaves2.position.y = 40;
  mesh.add(treeLeaves2);

  var geomTreeLeaves3 = new THREE.CylinderGeometry(1, 6 * 3, 6 * 3, 4);
  var treeLeaves3 = new THREE.Mesh(geomTreeLeaves3, matTreeLeaves);
  treeLeaves3.position.y = 55;
  mesh.add(treeLeaves3);

  mesh.scale.set(0.02, 0.02, 0.02);

  return mesh;
}
