"use strict"
class tracer_object extends object {
  constructor(model, objData) {
    super(model, objData);
    
    this.rad = model.vdata.rad;

    this.dir = 4;
    this.sens = Const.DEFAULT_SENS;
    this.target = null;
    this.lastUpdate = Const.game.gameTick - this.sens + 3;
    this.speed = Math.sqrt(this.x_vel * this.x_vel + this.y_vel * this.y_vel);
    
    this.image_interval = 500;
  }
  
  update(tick) {
  	// limit steering interval
  	if(tick > this.lastUpdate + this.sens) {
  		if(!this.target) {
  			this.FindTarget();
  			if(this.target)
  				this.FixDirection();
  			else
  				this.dir = this._dir(this.x_vel, this.y_vel);
  		}
  		else if(this.target != -1)		// target is gone
  			this.FixDirection();
  		this.lastUpdate = tick;
  	}
  	super.update(tick);

  	if(this.target && this.target != -1 && this.target.state <= objectState.AI_DEATH)
  		this.target = -1;

  	this.image_interval ++;
  	if(this.image_interval >= this.model.image_interval)
  	{
  		this.image_interval = 0;
  		this.image_index ++;
  		if(Math.floor(this.image_index / this.model.image_count_per_dir) != this.dir)
  			this.image_index = this.dir * this.model.image_count_per_dir;
  	}
  }
  
  FindTarget() {
  	this.target = playermanager.inst.findplayer();
  }
  
  FixDirection() {
  	let tx = this.target.x - this.x;
  	let ty = this.target.y - this.y;
  	let dir_s = Math.sqrt(tx * tx + ty * ty);
  	
  	this.x_vel = this.speed / dir_s * tx;
  	this.y_vel = this.speed / dir_s * ty;
  	this.dir = this._dir(tx / dir_s, ty / dir_s);
  }
}