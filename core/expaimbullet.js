"use strict"
class expaimbullet extends bullet {
  constructor(model, objData) {
    super(model, objData);
  }
  
  init() {
	super.init();

	let target = null;
	// TODO nearest enimy?
	let distance = 65535;
	for(let i = 0; i < Const.MAX_GROUP; i++) {
		if((Const.game.hit_table[this.model.group] >> i) & 1) {
			for(let pobject of Const.game.object_group[i]) {
				let tx = pobject.x - this.x;
				let ty = pobject.y - this.y;
				if(Math.sqrt(tx * tx + ty * ty) < distance)
					target = pobject;
			}
		}
	}
	// change direction
	if(target) {
		let tx = target.x - this.x;
		let ty = target.y - this.y;
		let dir_s = Math.sqrt(tx * tx + ty * ty);
		let tcos = tx / dir_s;
		let tsin = ty / dir_s;

		let temp = -this.x_vel * tsin + this.y_vel * tcos;
		this.y_vel = this.x_vel * tcos + this.y_vel * tsin;
		this.x_vel = temp;
	} else {
		this.y_vel = -this.y_vel;
	}
	this.image_index = this._dir(this.x_vel, this.y_vel);
  }
}