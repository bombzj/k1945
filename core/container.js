"use strict"
class container extends object {
  constructor(model, objData) {
    super(model, objData);

    this.lpseq = null;
	this.seq_event_start_time = 0;
	this.seq_event_next_time = 0;
	this.seq_current_offset = 0;
  }
  
  init() {
	
	this.seq_event_start_time = Const.game.gameTick;
	
	if(this.model.vdata.seqid) {
		this.lpseq = Const.game.stageSeq[this.model.vdata.seqid];
		this.seq_current_offset = 0;
		this.seq_event_next_time = this.lpseq.objs[this.seq_current_offset].starttime;
	}

  }
  
  
  update(tick) {

	while(this.lpseq && tick - this.seq_event_start_time >= this.seq_event_next_time){
		Const.game.new_object_seq(this.lpseq, this.seq_current_offset, this);
		if(++(this.seq_current_offset) < this.lpseq.objs.length)
			this.seq_event_next_time = this.lpseq.objs[this.seq_current_offset].starttime;
		else {
			this.state = objectState.AI_DEATH;
			break;
		}
	}
  }
  
  render() {
	  
  }
}