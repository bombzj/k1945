"use strict"
class startstageobject extends object {
  constructor(model, objData) {
    super(model, objData);
	this.image_interval = Const.STAGE_START_IMAGE_INTERVAL_SKIP > 0 ? Const.STAGE_START_IMAGE_INTERVAL_SKIP : 0;
	this.image_index = 0;
	this.state = objectState.AI_BIRTH;

	Const.game.setpass(stageState.EOF_MAIN_SEQ);

	this.playsound(0);
	Const.game.removeInput();
  }

  render() {
    this.drawimage(0, this.image_index)
  }
  
  update(tick) {
	if(player_glob.inst.pdata[0].ctrl.keyA.is_pressed || player_glob.inst.pdata[1].ctrl.keyA.is_pressed) {
		Const.game.setpass(stageState.PASS_NOT_SET);
		this.state = objectState.AI_DEATH;
		this.stopsound(0);
		return;
	}
	this.image_interval++;
	if(this.image_interval >= this.model.image_interval)
	{
		this.image_interval = Const.STAGE_START_IMAGE_INTERVAL_SKIP > 0 ? Const.STAGE_START_IMAGE_INTERVAL_SKIP : 0;
		this.image_index ++;
		if(this.image_index >= this.model.image_rects.length) {
			Const.game.setpass(stageState.PASS_NOT_SET);
			this.state = objectState.AI_DEATH;
		}
	}
  }
}