"use strict"
class pickup_object extends object {
  constructor(model, objData) {
    super(model, objData);
    
	this.bounce_count = 0;
	this.pickuptype = model.vdata.type;
	this.pickupcount = model.vdata.count;
  }

  update(tick) {
  	if(this.pickuptype != 5) {
  		this.x += this.x_vel;
  		this.y += this.y_vel;
  		let flag = false;
  		if(this.x < 0) {this.x = -this.x; this.x_vel = -this.x_vel; flag = true;}
  		if(this.x > Const.SCR_WIDTH) {this.x = 2 * Const.SCR_WIDTH - this.x; this.x_vel = -this.x_vel; flag = true;}
  		if(this.y < 0) {this.y = -this.y; this.y_vel = -this.y_vel; flag = true;}
  		if(this.y > Const.SCR_HIGH) {this.y = 2* Const.SCR_HIGH - this.y; this.y_vel = -this.y_vel; flag = true;};

  		if(flag) this.bounce_count++;

  		if(this.bounce_count >= Const.MAX_BOUNCE_COUNT)
  			this.state = objectState.AI_DEATH;
  	} else {
  		super.update(tick);
  	}

  	this.image_interval ++;
  	if(this.image_interval >= this.model.image_interval) {
  		this.image_interval = 0;
  		this.image_index ++;
  		if(this.image_index >= this.model.image_count_per_dir)
  			this.image_index = 0;
  	}
  }
  
  getobjectvar(nID)
  {
  	switch(nID)
  	{
  	case objectConst.GOV_PICKUP_TYPE:
  		return this.pickuptype;
  	case objectConst.GOV_PICKUP_COUNT:
  		return this.pickupcount;
  	}
  	return super.getobjectvar(nID);
  }
}