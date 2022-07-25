import * as THREE from "three";

export default class BaseModel {
  protected group: THREE.Group;
  protected syncLoaded: boolean;
  protected debug: boolean;
  protected scene: THREE.Scene | undefined;

  constructor() {
    this.group = new THREE.Group();
    this.syncLoaded = false;
    this.debug = false;
  }

  public get obj() {
    return this.group;
  }

  public init(scene: THREE.Scene) {
    this.scene = scene;
    scene.add(this.group);

    if (this.debug) {
      const box = new THREE.BoxHelper(this.group, 0xffff00);
      scene.add(box);
    }
  }

  public destroy() {}

  public animate() {}
}
