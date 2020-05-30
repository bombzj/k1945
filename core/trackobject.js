"use strict"
class trackobject extends airplane {
  constructor(model, objData) {
    super(model, objData);

    let track_id = model.vdata.track_normal;
    if(track_id >= 0 && track_id < Const.game.tracks.length) {
      this.tck_seq = Const.game.tracks[track_id];
      this.tck_start_fs = Const.game.gameTick;
      this.tck_current_offset = 0;
      if(this.tck_seq.objs.length > 0)
        this.tck_next_fs = this.tck_seq.objs[0].starttime;
    }
    this.cur_picid = 0;
  }
  render() {
	  super.render()
  }
  update(tick) {
    if(this.parent && this.parent.state <= objectState.AI_DEATH && this.model.dieparent()) {
      this.state = objectState.AI_DEATH;
      return;
    }

    if(this.tck_seq && tick - this.tck_start_fs >= this.tck_seq.length) {
      if(this.tck_seq.repeat >= this.tck_seq.objs.length)	{// repeat the sequence if set
        this.state = objectState.AI_DEATH;
        return;
      } else {
        this.tck_current_offset = this.tck_seq.repeat;
        this.tck_next_fs = this.tck_seq.objs[this.tck_current_offset].starttime;
        this.tck_start_fs = tick - this.tck_next_fs;
      }
    }

    if(this.tck_seq && tick - this.tck_start_fs >= this.tck_next_fs) {
      let tck_seq_cell = this.tck_seq.objs[this.tck_current_offset];

      this.x_vel = tck_seq_cell.vx;
      this.y_vel = tck_seq_cell.vy;

      if(++this.tck_current_offset < this.tck_seq.objs.length)
        this.tck_next_fs = this.tck_seq.objs[this.tck_current_offset].starttime;
      else
        this.tck_next_fs = 0xfffffff;

      if(tck_seq_cell.picid != 0xff) {
        this.cur_picid = tck_seq_cell.picid;
        this.image_index = this.cur_picid * this.model.image_count_per_dir;
        this.image_interval = 0;
      }
    }
    
    this.image_interval++;
	if(this.image_interval >= this.model.image_interval) {
		this.image_interval = 0;
		this.image_index ++;
		if(this.image_index >= (this.cur_picid + 1) * this.model.image_count_per_dir)
			this.image_index = this.cur_picid * this.model.image_count_per_dir;
	}
	this.x += this.x_vel;
	this.y += this.y_vel;
	while(this.lpseq && tick - this.seq_event_start_time >= this.seq_event_next_time){
		Const.game.new_object_seq(this.lpseq, this.seq_current_offset, this);
		if(++(this.seq_current_offset) < this.lpseq.objs.length) {
			this.seq_event_next_time = this.lpseq.objs[this.seq_current_offset].starttime;
		} else {
			if(this.lpseq.length > 0)	{	// loop if sequence has a length
			
				this.seq_event_start_time += this.lpseq.length;

				this.seq_current_offset = 0;
				this.seq_event_next_time = this.lpseq.objs[this.seq_current_offset].starttime;
			}
			else
				this.seq_event_next_time = 0xfffffff;
		}
	}

    if(this.parent && this.model.stickparent()){
      this.x += this.parent.x_vel;
      this.y += this.parent.y_vel;
    }

  }
  getDir() {
    return this.cur_picid != undefined ? this.cur_picid : super.getDir();
  }
}
