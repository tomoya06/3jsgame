import * as THREE from "three";

export default class BaseModel {
  protected group: THREE.Group;
  protected syncLoaded: boolean;

  constructor() {
    this.group = new THREE.Group();
    this.syncLoaded = false;
  }

  public get obj() {
    return this.group;
  }

  public init(scene: THREE.Scene) {
    scene.add(this.group);
  }

  public destroy() {}

  public animate() {}
}
