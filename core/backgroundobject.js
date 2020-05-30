"use strict"
class backgroundobject extends object{
  constructor(model, objData) {
    super(model, objData);
    this.y = -this.model.height + Const.SCR_HIGH;

    backgroundobject.inst = this;
    this.playsound(0, true);
    this.x = 0;
  }
  
  update(tick) {
    this.y += this.y_vel;
    if(this.y > 0)
      this.y = 0;

    if(this.state == objectState.AI_BIRTH) {
      this.state = objectState.AI_NORMAL;
    }
  }

  render() {
    this.drawimage(0, this.image_index, 0, 0)
  }
}