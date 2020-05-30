"use strict"
var playerDefine = {
  PLAYER_MARGIN_WIDTH       : 12,
  PLAYER_MARGIN_HEIGHT      : 15,
  MAX_CHARGE                : 3400,
  MAX_CHARGE_CD	            : 20,
  CHARGE_LEVEL              : [0, 600, 1600, 3400],
  MAX_PLAYER_VSEQ	          :	7,
  CHARGE_LEVEL		: [0, 600, 1600, 3400],
};

class player extends dir_object {
  constructor(model, objData) {
    super(model, objData);
    this.bombs = 3;
    this.LastUpdate = Const.game.gameTick;

    this.speed = Math.sqrt(this.x_vel * this.x_vel + this.y_vel * this.y_vel);
    this.dam_level = Const.FORCE_PLAYER_POWER > 0 ? Const.FORCE_PLAYER_POWER : 0;
    this.bullet_fs = 0;
    this.bomb_interval = 0;
    this.score = 0;

    this.playact = 110;
    this.x_vel = 0;
    this.y_vel = -2;
    this.chargelevel = Const.FORCE_PLAYER_CHARGE > 0 ? Const.FORCE_PLAYER_CHARGE : 1;;
    this.chargedlevel = 0;
    this.charge = playerDefine.CHARGE_LEVEL[this.chargelevel];
    this.chargecd = 0;
    
    this.sbullet = new Array(2);

    // sequence for bullets or bombs
    this.seq_level = [];
    for(let i = 0;i < this.model.vdata.seq_level.length;i++)
    	this.seq_level.push(Const.game.stageSeq[this.model.vdata.seq_level[i]]);
    this.seq_bomb = Const.game.stageSeq[this.model.vdata.seq_bomb];
    this.seq_bubble = Const.game.stageSeq[this.model.vdata.seq_bubble];
    this.seq_charge = Const.game.stageSeq[this.model.vdata.seq_charge];

    this.PlayerID = 0;
    
    this.pdata = player_glob.inst.pdata;
  }

  stage_pass() {
    this.x_vel = 0;
    this.playact = 1000;
  }

  render() {
    // invincible
    if(this.playact > 0 && (Const.game.frameTick & 1) > 0)
      ;
    else
    	super.render();
  }
  
  update(tick) {
	if(this.playact > 0) this.playact--;
	if(this.playact > 80 && this.playact < 920) {
		this.y += this.y_vel;
		if(this.playact > 500)	// stage clear inv
			this.y += -3;
		let dir = 1;
		this.image_interval ++;
		if(this.image_interval >= this.model.image_interval) {
			this.image_interval = 0;
			this.image_index ++;
			if(Math.floor(this.image_index / this.model.image_count_per_dir) != dir)
				this.image_index = dir * this.model.image_count_per_dir;
		}
		return;
	}

	this.x_vel = 0;
	this.y_vel = 0;
	
	if(this.pdata[this.PlayerID].touchstart.is_active) {
		this.x_movestart = this.x;
		this.y_movestart = this.y;
	}
	if(this.pdata[this.PlayerID].touchmove.is_active) {
		let dx = this.x_movestart + this.pdata[this.PlayerID].touchmove.offsetx - this.x;
		let dy = this.y_movestart + this.pdata[this.PlayerID].touchmove.offsety - this.y;
		let distance = Math.sqrt(dx * dx + dy * dy);
		if(distance > 0.5) {
			if(distance <= this.speed) {
				this.x_vel = dx;
				this.y_vel = dy;
			} else {
				this.x_vel = dx * this.speed / distance;
				this.y_vel = dy * this.speed / distance;
			}
		}
	} else {
		// if keyboard
		if(this.pdata[this.PlayerID].ctrl.up.is_down) {
			this.y_vel -= this.speed;
		}
		if(this.pdata[this.PlayerID].ctrl.down.is_down) {
			this.y_vel += this.speed;
		}
		if(this.pdata[this.PlayerID].ctrl.left.is_down) {
			this.x_vel -= this.speed;
		}
		if(this.pdata[this.PlayerID].ctrl.right.is_down) {
			this.x_vel += this.speed;
		}
		if(this.charge > playerDefine.MAX_CHARGE)
			this.charge = playerDefine.MAX_CHARGE;
		// both direction keys
		if(this.x_vel && this.y_vel) {
			let f = Math.sqrt(2.0);
			this.x_vel /= f;
			this.y_vel /= f;
		}
	}
	
	this.x += this.x_vel;
	this.y += this.y_vel;
	 
	 if(this.pdata[this.PlayerID].ctrl.up.is_pressed || this.pdata[this.PlayerID].ctrl.down.is_pressed || 
			 this.pdata[this.PlayerID].ctrl.left.is_pressed || this.pdata[this.PlayerID].ctrl.right.is_pressed) {
		this.charge += 20;
		if(this.chargelevel == 0 && this.charge >= playerDefine.CHARGE_LEVEL[1]) {
			this.chargelevel++;
		}
		else if(this.chargelevel == 1 && this.charge >= playerDefine.CHARGE_LEVEL[2]) {
			this.playsound(6);
			this.chargelevel++;
		}
		else if(this.chargelevel == 2 && this.charge >= playerDefine.CHARGE_LEVEL[3]) {
			this.playsound(6);
			this.chargelevel++;
		}
	}

	
	if(this.x < playerDefine.PLAYER_MARGIN_WIDTH) {
		this.x_vel -= this.x - playerDefine.PLAYER_MARGIN_WIDTH;
		this.x = playerDefine.PLAYER_MARGIN_WIDTH;
	} else if(this.x > Const.SCR_WIDTH - playerDefine.PLAYER_MARGIN_WIDTH) {
		this.x_vel -= this.x - (Const.SCR_WIDTH - playerDefine.PLAYER_MARGIN_WIDTH);
		this.x = Const.SCR_WIDTH - playerDefine.PLAYER_MARGIN_WIDTH;
	}
	if(this.y < playerDefine.PLAYER_MARGIN_HEIGHT) {
		this.y_vel -= this.y - playerDefine.PLAYER_MARGIN_HEIGHT;
		this.y = playerDefine.PLAYER_MARGIN_HEIGHT;
	} else if(this.y > Const.SCR_HIGH - playerDefine.PLAYER_MARGIN_HEIGHT) {
		this.y_vel -= this.y - (Const.SCR_HIGH - playerDefine.PLAYER_MARGIN_HEIGHT);
		this.y  = Const.SCR_HIGH - playerDefine.PLAYER_MARGIN_HEIGHT;
	}

	
	// shooting
	if(this.pdata[this.PlayerID].ctrl.keyA.is_down)	{	// keep pressing
		if(this.chargelevel > 0 && this.chargecd < Const.MAX_CHARGE_CD) {
			this.chargecd++;
			if(jsbutton)
				this.chargecd = Const.MAX_CHARGE_CD;
			if(this.chargecd == Const.MAX_CHARGE_CD) {	// start charging
				this.chargedlevel = this.chargelevel;
				let curlevel = (this.chargedlevel - 1) * 4;
				this.sbullet[0] = Const.game.new_object_seq(this.seq_charge, curlevel, this);
				this.sbullet[1] = Const.game.new_object_seq(this.seq_charge, curlevel + 1, this);
				this.playsound(5);
			}
		}
	} else {
		if(this.chargecd >= Const.MAX_CHARGE_CD) {	// release charge
			this.chargelevel -= this.chargedlevel;
			let curlevel = (this.chargedlevel - 1) * 4;
			this.sbullet[0].state = this.sbullet[1].state = objectState.AI_DEATH;
			Const.game.new_object_seq(this.seq_charge, curlevel + 2, this);
			Const.game.new_object_seq(this.seq_charge, curlevel + 3, this);
			this.charge -= playerDefine.CHARGE_LEVEL[this.chargedlevel];
			this.chargecd = 0;
			
			if(Const.FORCE_PLAYER_CHARGE > 0) {
				this.chargelevel = Const.FORCE_PLAYER_CHARGE;
				this.charge = playerDefine.CHARGE_LEVEL[this.chargedlevel];
			}
		}
		else
			this.chargecd = 0;
	}

	let shot = false, stopkey = false;
	if(this.chargecd < Const.MAX_CHARGE_CD) {	// stop shooting while charging
		let bullet_list = this.seq_level[this.dam_level].objs;
		for(let i = 0; i < bullet_list.length; i++) {
			if(bullet_list[i].starttime == this.bullet_fs) {
				if(!jsbutton && !this.pdata[this.PlayerID].ctrl.keyA.is_pressed ||
						jsbutton && this.pdata[this.PlayerID].ctrl.keyA.is_down) {
					stopkey = true;
					break;
				}
				Const.game.new_object_param(bullet_list[i], this);
				shot = true;
			}
			else if(bullet_list[i].length > this.bullet_fs)
				break;
		}
		if(shot)
			this.playsound(0);
		if(!stopkey) {
			this.bullet_fs++;
			if(this.bullet_fs > this.seq_level[this.dam_level].length)
				this.bullet_fs = 0;
		}
	}
	// bomb (is one object enough?)
	if(this.pdata[this.PlayerID].ctrl.keyB.is_pressed) {
		if(this.bombs > 0 && !this.bomb_interval) {
			this.bombs --;
			this.bomb_interval = Const.BOMB_INTERVAL;
			Const.game.new_object_seq(this.seq_bomb, 0, this);
			this.playsound(1);
		}
	}
	if(this.bomb_interval) this.bomb_interval--;


	// direction
	// 012
	// 345
	// 678
	let dir = 0;
	if(this.model.image_rects.length > this.model.image_count_per_dir)
	{
		if(this.x_vel < -0.1)
			dir = 1;
		else if(this.x_vel > 0.1)
			dir = 2;
		if(this.y_vel < -0.1)
			dir += 4;
		else if(this.y_vel > 0.1)
			dir += 8;
		switch(dir)
		{
		case 1:
			dir = 3; break;
		case 2:
			dir = 5; break;
		case 4:
			dir = 1; break;
		case 8:
			dir = 7; break;
		case 5:
			dir = 0; break;
		case 9:
			dir = 6; break;
		case 6:
			dir = 2; break;
		case 10:
			dir = 8;break;
		default:
			dir = 4;
		}
	}
	
	// direction based image
	this.image_interval ++;
	if(this.image_interval >= this.model.image_interval)
	{
		this.image_interval = 0;
		this.image_index ++;
		if(Math.floor(this.image_index / this.model.image_count_per_dir) != dir)
			this.image_index = dir * this.model.image_count_per_dir;
	}
  }
  
  oncollide(shoot) {
  	let type = shoot.getobjectvar(objectConst.GOV_PICKUP_TYPE);
	/*
	life 1
	weapon upgrade 2
	add bomb 3
	add life 4
	add score 5
	*/
	switch(type) {
	case 1:
		this.current_life += shoot.getobjectvar(objectConst.GOV_PICKUP_COUNT);
		break;
	case 2:
		if(this.dam_level < 3)
		{
			this.playsound(2);
			this.dam_level += shoot.getobjectvar(objectConst.GOV_PICKUP_COUNT);
			Const.game.new_object_seq(this.seq_bubble, 6, this);
			if(this.dam_level > 3)
				this.dam_level = 3;
		}
		else
		{
			this.score += 1000;
			Const.game.new_object_seq(this.seq_bubble, 2, this);
		}
		break;
	case 3:
		this.playsound(3);
		if(this.bombs < 9)
		{
			this.bombs += shoot.getobjectvar(objectConst.GOV_PICKUP_COUNT);
			if(this.bombs > 9)
				this.bombs = 9;
		} else {
			this.score += 2000;
			Const.game.new_object_seq(this.seq_bubble, 3, this);
		}

		break;
	case 4:
		this.pdata[this.PlayerID].life += shoot.getobjectvar(objectConst.GOV_PICKUP_COUNT);
		break;
	case 5: {
		this.playsound(4);
		let getscore = shoot.getobjectvar(objectConst.GOV_PICKUP_COUNT);
		this.score += getscore;
		let obj = -1;
		switch(getscore) {
		case 200:
			obj = 0;
			break;
		case 500:
			obj = 1;
			break;
		case 1000:
			obj = 2;
			break;
		case 2000:
			obj = 3;
			break;
		case 4000:
			obj = 4;
			break;
		case 10000:
			obj = 5;
			break;
		}
		if(obj >= 0)
			Const.game.new_object_seq(this.seq_bubble, obj, this);
		break;
		}
  	}
  	if(this.playact > 0) return;	// invincible status

  	super.oncollide(shoot);
  }
}
