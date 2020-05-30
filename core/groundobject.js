"use strict"
class groundobject extends airplane {
  constructor(model, objData) {
    super(model, objData);

  }

  update(tick) {
    // die with parent
    if(this.parent && this.parent.state <= objectState.AI_DEATH) {
      this.state = objectState.AI_DEATH;
      return;
    }

    super.update(tick);

    if(this.parent) {
      this.x += this.parent.x_vel;
      this.y += this.parent.y_vel;
      
    } else {
      // moving with the ground
      this.x += backgroundobject.inst.x_vel;
      this.y += backgroundobject.inst.y_vel;
    }
  }
}

class redirector extends groundobject {
  constructor(model, objData) {
    super(model, objData);
  }
  update(tick) {
	let target = playermanager.inst.findplayer();
	if(target) {
		let subDir = this._dir(target.x - this.x, target.y - this.y);
		this.image_index = subDir;
	}
	  
	if(this.parent && this.parent.state <= objectState.AI_DEATH) {
		this.state = objectState.AI_DEATH;
		return;
	}
	
    if(this.parent) {
        this.x += this.parent.x_vel + backgroundobject.inst.x_vel;
        this.y += this.parent.y_vel + backgroundobject.inst.y_vel;
        
    } else {
        // moving with the ground
        this.x += backgroundobject.inst.x_vel;
        this.y += backgroundobject.inst.y_vel;
    }
    
	while(this.lpseq && tick - this.seq_event_start_time >= this.seq_event_next_time){
		Const.game.new_object_seq(this.lpseq, this.seq_current_offset, this);
		if(++(this.seq_current_offset) < this.lpseq.objs.length)
			this.seq_event_next_time = this.lpseq.objs[this.seq_current_offset].starttime;
		else
			this.seq_event_next_time = 0xfffffff;
	}
  }
  getDir() {
    let player = playermanager.inst.findplayer();
    if(player) {
      return this._dir(player.x - this.x, player.y - this.y);
    }
    return 0;
  }
}