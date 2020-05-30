"use strict"
class aimbullet extends bullet {
  constructor(model, objData) {
    super(model, objData);
  }
  
  init() {
	super.init();
	let target = playermanager.inst.findplayer();
	// aim at player
	if(target)
	{
		let tx = target.x - this.x;
		let ty = target.y - this.y;
		let dir_s = Math.sqrt(tx * tx + ty * ty);
		let tcos = tx / dir_s;
		let tsin = ty / dir_s;

		let temp = -this.x_vel * tsin + this.y_vel * tcos;
		this.y_vel = this.x_vel * tcos + this.y_vel * tsin;
		this.x_vel = temp;
	}
  }
}