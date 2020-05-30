"use strict"
class clearstageobject extends object {
  constructor(model, objData) {
    super(model, objData);
	this.clearcountdown = 90;
	this.image_interval = 0;
	this.image_index = 0;

	this.clear_interval = 130;
	this.state = objectState.AI_BIRTH;

	this.completeMainState = stageState.FORCE_PASS;
	if(playermanager.inst)
  	  playermanager.inst.stagepass();
  }
  
  update(tick) {
  	if(this.clearcountdown > 0) {
  		this.clearcountdown--;
  		if(	this.clearcountdown == 0) {
  			Const.game.setpass(stageState.PASS_MAIN_SEQ);
  			backgroundobject.inst.stopsound(0)
  			this.playsound(0);
  		}
  		return;
  	}

  	if(this.clear_interval > 0) {
  		this.clear_interval --;
  		return;
  	}
  	this.image_interval++;
  	if(this.image_interval >= this.model.image_interval)
  	{
  		this.image_interval = 0;
  		this.image_index ++;
  		if(this.image_index >= this.model.image_rects.length) {
  			Const.game.setpass(this.completeMainState);
  		}
  	}
  }
  
  render() {
  	if(this.image_index >= this.model.image_rects.length) this.image_index = 0;
  	if(this.clear_interval == 0 && this.model.image_rects.length > 0) {
  	    this.drawimage(0, this.image_index,  0, 0);
  	}
  }
}