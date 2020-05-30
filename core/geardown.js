"use strict"
class geardown extends bullet {
  constructor(model, objData) {
    super(model, objData);
    
	this.collide_fix_x = this.x_vel * 80 / 100;
	this.collide_fix_y = this.y_vel * 80 / 100;
  }
  
  oncollide(shoot)
  {
  	this.x -= this.collide_fix_x;
  	this.y -= this.collide_fix_y;
  }
}