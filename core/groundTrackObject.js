"use strict"
class groundTrackObject extends trackobject {
  constructor(model, objData) {
    super(model, objData);
  }
  update(tick) {
    super.update(tick);
    // moving with the ground
//    if(!parent) {
      this.x += backgroundobject.inst.x_vel;
      this.y += backgroundobject.inst.y_vel;
//    }
  }
}