"use strict"
class bigtracertobject extends tracer_object {
  constructor(model, objData) {
    super(model, objData);
    
    this.sens = Const.PLAYER_TRACERT_SENS;
  }
  
  FindTarget() {
	let distance = 65535;
	for(let i = 0; i < Const.MAX_GROUP; i++) {
		if((Const.game.hit_table[this.model.group] >> i) & 1) {
			for(let pobject of Const.game.object_group[i]) {
				let tx = pobject.x - this.x;
				let ty = pobject.y - this.y;
				if(Math.sqrt(tx * tx + ty * ty) < distance)
					this.target = pobject;
			}
		}
	}
  }
}