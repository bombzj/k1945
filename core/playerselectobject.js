"use strict"
class playerselectobject extends object {
  constructor(model, objData) {
    super(model, objData);
    this.pdata = player_glob.inst.pdata;
    this.selectplane = player_glob.inst.selectplane;
    
    for(let i = 0; i < Const.MAX_PLAYER; i++) {
      this.pdata[i].selected = false;
      if(this.pdata[i].plane >= 0)
        this.selectplane[this.pdata[i].plane] = true;
    }
    this.playercount = this.startcount = 0;
    this.selectwait = Const.PLAYER_SELECT_WAIT >= 0 ? Const.PLAYER_SELECT_WAIT : 1000;
    
	this.startplayer(0, Const.PLAYER_SELECT_DEFAULT);
	Const.game.setpass(stageState.PASS_MAIN_SEQ);

	let seq = Const.game.stageSeq[model.vdata.seqid];
	for(let i = 0; i < seq.objs.length; i++)
		Const.game.new_object_seq(seq, i, this);
	this.startcountdown = -1;
	this.playsound(2, true);
	
	this.spriteNumber = 5;
  }

  startplayer(nplayer = 0, nplane = 0) {
    this.playercount++;
    this.pdata[nplayer].plane = nplane;
    this.selectplane[nplane] = true;
    player_glob.inst.coin--;
  }
  
  render() {
  	// 0 - 5 for big images of planes, 6 - 11 small images, 12 & 13 frames, 14 background
	this.drawimage(0, 14);
  	if(this.playercount == 1) {
  		// if one player
  		for(let i = 0;i < Const.MAX_PLAYER;i++)
  			if(this.pdata[i].plane != -1) {
  				this.drawimage(1, this.pdata[i].plane, 0, 40);
  				break;
  			}
  	}
  	else if(this.playercount == 2) {
  		// two halves if two players
  		let i = 0;
  		for(;i < Const.MAX_PLAYER;i++)
  			if(this.pdata[i].plane != -1) {
  				this.drawimage(1, this.pdata[i].plane + 6, 36, 10);
  				i++;
  				break;
  			}
  		for(;i < Const.MAX_PLAYER;i++)
  			if(this.pdata[i].plane != -1) {
  				this.drawimage(2, this.pdata[i].plane + 6, 36, 140);
  				break;
  			}
  	}
  	for(let i = 0;i < Const.MAX_PLAYER;i++)		// draw frames of selecting
  		if(this.pdata[i].plane != -1) {
  			if(i == 0)
  				this.drawimage(3, i + 12, this.pdata[i].plane * 32 + 20, 260);
  			else
  				this.drawimage(4, i + 12, this.pdata[i].plane * 32 + 20, 260);
  		}
  }
  
  update(tick) {
	if(--this.selectwait <= 0) {	// selecting time up
		for(let i = 0;i < Const.MAX_PLAYER;i++)
			this.pdata[i].ctrl.keyA.is_pressed = true;
	}
    if(this.startcountdown >= 0) {
  		this.startcountdown--;
  		if(this.startcountdown <= 0) {		
  			Const.game.setpass(stageState.PASS_NOT_SET);
  			this.state = objectState.AI_DEATH;
  			this.stopsound(2);
  		}
  		return;
  	}
    
	if(this.pdata[0].touchstart.is_active) {
		this.x_movestart = this.pdata[0].plane;
	}
	if(this.pdata[0].touchmove.is_active) {
		let dx = this.x_movestart + Math.round(this.pdata[0].touchmove.offsetx / 32) - this.pdata[0].plane;
		if(dx >  0) {
			this.pdata[0].ctrl.right.is_pressed = true;
		} else if(dx < 0) {
			this.pdata[0].ctrl.left.is_pressed = true;
			
		}
	}

  	for(let i = 0;i < Const.MAX_PLAYER;i++) {
  		if(this.pdata[i].plane != -1)	 {
  			// start selecting
  			if(!this.pdata[i].selected) {
  				if(this.pdata[i].ctrl.left.is_pressed) {
  					for(let j = this.pdata[i].plane - 1;j >= 0;j--)
  						if(!this.selectplane[j]) {
  							this.selectplane[this.pdata[i].plane] = false;
  							this.pdata[i].plane = j;
  							this.selectplane[j] = true;
  							this.playsound(0);
  							break;
  						}
  				}
  				else if(this.pdata[i].ctrl.right.is_pressed) {
  					for(let j = this.pdata[i].plane + 1;j < Const.MAX_PLANE_SELECT_NUMBER;j++)
  						if(!this.selectplane[j]) {
  							this.selectplane[this.pdata[i].plane] = false;
  							this.pdata[i].plane = j;
  							this.selectplane[j] = true;
  							this.playsound(0);
  							break;
  						}
  				}
  				if(this.pdata[i].ctrl.keyA.is_pressed) {
  					this.playsound(1);
  					this.pdata[i].selected = true;
  					this.startcount++;
  					if(this.startcount >= this.playercount) {
  						this.startcountdown = Const.PLAYER_SELECTD_WAIT >= 0 ? Const.PLAYER_SELECTD_WAIT : 60;
  						return;
  					}
  				}
  			}
  		} else {
  			if(this.pdata[i].ctrl.keyS.is_pressed) {
  				for(let j = 0;j < Const.MAX_PLANE_SELECT_NUMBER;j++)
  					if(!this.selectplane[j]) {
  						this.startplayer(i, j);
  						break;
  					}
  			}
  		}
  	}
  }
}