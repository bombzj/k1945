"use strict"
//TODO: should bullet inherit this?
class dir_object extends object {
  constructor(model, objData) {
    super(model, objData);
  }

  update(tick) {

    this.x += this.x_vel;
    this.y += this.y_vel;

    if(this.state == objectState.AI_DEATH) {
      this.state = objectState.AI_INVALID;
    } else if(this.x + this.model.width / 2 < 0 || this.x - this.model.width / 2 > Const.SCR_WIDTH ||
      this.y + this.model.height / 2 < 0 || this.y - this.model.height / 2 > Const.SCR_HIGH) { // out of boundary
      this.state = objectState.AI_DEATH;
    } else {
      let dir = this.getDir();
      // change image according to direction
      if(this.image_interval++ >= this.model.image_interval) {
        this.image_interval = 0;
        this.image_index ++;
        if(Math.floor(this.image_index / this.model.image_count_per_dir) != dir)
          this.image_index = dir * this.model.image_count_per_dir;
      }
    }
  }

    getDir() {
    return this._dir(this.x_vel, this.y_vel);
  }

}

class airplane extends dir_object {
  constructor(model, objData) {
    super(model, objData);
  }
  
  init() {
	super.init();
	  // init seq
	this.seq_event_start_time = Const.game.gameTick;
	this.lpseq = null;
	if(this.model.vdata.seqid) {
		this.lpseq = Const.game.stageSeq[this.model.vdata.seqid];
		this.seq_current_offset = 0;
		this.seq_event_next_time = this.lpseq.objs[this.seq_current_offset].starttime;
	}
	
	this.drop_seq = null;
	if(this.model.vdata.seq_drop)
		this.drop_seq = Const.game.stageSeq[this.model.vdata.seq_drop];
  }

  update(tick) {
    super.update(tick);

	while(this.lpseq && tick - this.seq_event_start_time >= this.seq_event_next_time){
		Const.game.new_object_seq(this.lpseq, this.seq_current_offset, this);
		if(++(this.seq_current_offset) < this.lpseq.objs.length)
			this.seq_event_next_time = this.lpseq.objs[this.seq_current_offset].starttime;
		else
			this.seq_event_next_time = 0xfffffff;
	}
    
    //TODO: dropping items(shooting too)
    // while(lpseq && fs - seq_event_start_time >= seq_event_next_time){
    //   if(seq_current_offset < lpseq->object_params.size())
    //   {
    //     lpmng->add_object(lpseq->object_params[seq_current_offset], this);
    //     seq_current_offset++;
    //   }
    //   if(seq_current_offset < lpseq->object_params.size())
    //   seq_event_next_time = lpseq->object_params[seq_current_offset].playactTime;
    // else
    //   {
    //     if(lpseq->lastTime > 0)		// loop if sequence has a length
    //     {
    //       seq_event_start_time += lpseq->lastTime;
    //
    //       seq_current_offset = 0;
    //       seq_event_next_time = lpseq->object_params[seq_current_offset].playactTime;
    //     }
    //     else
    //       seq_event_next_time = 0xfffffff;
    //   }
    // }
  }
  
  oncollide(shoot) {
  	let dam = shoot.getobjectvar(objectConst.GOV_DAMAGE);

  	if(this.current_life - dam <= 0 && this.state > objectState.AI_DEATH) {
  		// release second object from subsequence

  		if(this.drop_seq) {
  			for(let i = 0; i < this.drop_seq.objs.length; i++)
  				Const.game.new_object_seq(this.drop_seq, i, this);
  		}
  		// TODO: score is wrong?
//  		playermanager::addscore(m_ptemplate->life * 20);
  	}
  	if(this.collided == 0)
  		this.collided = Const.COLLIDED_DRAW_INTERNAL;

  	if(this.current_life < this.model.vdata.life / 4)
  		this.lifelowcd = 8;
  	else if(this.current_life < this.model.vdata.life / 2)
  		this.lifelowcd = 16;
  	else if(this.current_life < this.model.vdata.life / 4 * 3)
  		this.lifelowcd = 24;

  	super.oncollide(shoot);
  }
}

