"use strict"
class playermanager extends object {
  constructor(model, objData) {
    super(model, objData);
    playermanager.inst = this;

    this.countdown = -1;
    this.countdowninterval = 0;
    this.playerplane_seq = Const.game.stageSeq[model.vdata.seq_drop];

    this.pdata = player_glob.inst.pdata;
    this.pdatax = player_glob.inst;
    
    for(let i = 0; i < Const.MAX_PLAYER; i++) {
      if(this.pdata[i].plane >= 0) {
        this.pdata[i].life = Const.FORCE_PLAYER_LIFE > 0 ? Const.FORCE_PLAYER_LIFE : 3;
        this.startplayer(i);
      }
    }
    this.PM_CHARGE_PIC_START	= 40;
    this.PM_CHARGE_PIC_CREDIT_Y = 300;
    
	this.sprite_per_player = 22;
	this.sprite_other = this.sprite_per_player * 2;
    this.spriteNumber = this.sprite_per_player * 2 + 6;
  }
  
  render() {
		
	if(this.pdata[0].isalive()) { // render data for player 1
		this.drawimage(0, 10 + this.pdata[0].bomb, 90, 300);
		for(let i = 0;i < this.pdata[0].life;i++)
			this.drawimage(i + 3, this.pdata[0].plane, i * 16 + 10, 20);
		this.drawimage(2, 6, 10, 6);
		this.drawnumber(14, 76, 30, 1, this.pdata[0].score, 8, 8);
		let charge = Math.floor(this.pdata[0].charge / 100);
		if(charge > 34)
			charge = 34;
		if(charge == 34 && Const.game.frameTick & 2)
			this.drawimage(1, this.PM_CHARGE_PIC_START + 35, 10, 300);
		else
			this.drawimage(1, this.PM_CHARGE_PIC_START + charge, 10, 300);
	} else {
		if(this.pdata[0].life > 0) {		// selecting
			this.drawimage(8, 31, 45, 10);
			this.drawnumber(13, 96, 95, 10, this.pdata[0].selectcd, 0, 0);	// count down
			this.drawimage(9, this.pdata[0].plane, 15, 13);		// selected plane
		} else {
			let mod = Math.floor(Const.game.frameTick / 32) % 4;
			let toppic = 20;
			if(mod & 1) {
				if(mod == 1) toppic++;
				if(this.pdatax.coin <= 0)
					toppic += 2;
				this.drawimage(12, toppic, 20, 10);
			}
		}
		if(this.countdown == -1) {
			this.drawimage(10, 30, 28, this.PM_CHARGE_PIC_CREDIT_Y + 2);		// credit
			this.drawnumber(11, 76, 72, this.PM_CHARGE_PIC_CREDIT_Y, this.pdatax.coin, 0, 0);
		}
	}
	if(this.pdata[1].isalive()) { // render data for player2
	
		this.drawimage(0 + this.sprite_per_player, 10 + this.pdata[1].bomb, 90 + Const.SCR_WIDTH / 2, 300);
		for(let i = 0;i < this.pdata[1].life;i++)
			this.drawimage(i + 3 + this.sprite_per_player, this.pdata[1].plane, i * 16 + 10 + Const.SCR_WIDTH / 2, 20);
		this.drawimage(2 + this.sprite_per_player, 7, 10 + Const.SCR_WIDTH / 2, 6);
		this.rawnumber(14 + this.sprite_per_player, 76, 30 + Const.SCR_WIDTH / 2, 1, this.pdata[1].score, 8, 8);
		let charge = Math.floor(this.pdata[1].charge / 100);
		if(charge > 34)
			charge = 34;
		if(charge == 34 && Const.game.frameTick & 2)
			this.drawimage(1 + this.sprite_per_player, this.PM_CHARGE_PIC_START + 35, 10 + Const.SCR_WIDTH / 2, 300);
		else
			this.drawimage(1 + this.sprite_per_player, this.PM_CHARGE_PIC_START + charge, 10 + Const.SCR_WIDTH / 2, 300);
	} else {
		if(this.pdata[1].life > 0) {		// selecting
			this.drawimage(8 + this.sprite_per_player, 31, 45 + Const.SCR_WIDTH / 2, 10);
			this.drawnumber(13, 96, 95 + Const.SCR_WIDTH / 2, 10, this.pdata[1].selectcd, 0, 0);	// count down
			this.drawimage(9 + this.sprite_per_player, this.pdata[1].plane, 15 + Const.SCR_WIDTH / 2, 13);		// selected plane
		} else {
			let mod = Math.floor(Const.game.frameTick / 32) % 4;
			let toppic = 20;
			if(mod & 1) {
				if(mod == 1) toppic++;
				if(this.pdatax.coin <= 0)
					toppic += 2;
				this.drawimage(12 + this.sprite_per_player, toppic, 20 + Const.SCR_WIDTH / 2, 10);
			}
		}
		if(this.countdown == -1) {		// credit ?
			this.drawimage(10 + this.sprite_per_player, 30, 28 + Const.SCR_WIDTH / 2, this.PM_CHARGE_PIC_CREDIT_Y + 2);		// credit
			this.drawnumber(11 + this.sprite_per_player, 76, 72 + Const.SCR_WIDTH / 2, this.PM_CHARGE_PIC_CREDIT_Y, this.pdatax.coin, 0, 0);
		}
	}

	if(this.countdown != -1) {		// gameover start count down
		this.drawimage(this.sprite_other + 3, 24, 48, 120);
		this.countdowninterval++;
		if(this.countdowninterval > 40) {
			this.countdown--;
			this.countdowninterval = 0;
			if(this.countdown == -1) {
				Const.game.setpass(stageState.FORCE_PASS);
				return;
			}
		}
		this.drawimage(this.sprite_other, 28, 60, 150);
		this.drawnumber(this.sprite_other + 4, 86, 140, 150, this.countdown, 0, 0);
		this.drawimage(this.sprite_other + 1, 29, 30, 220);
		this.drawimage(this.sprite_other + 2, 30, 80, this.PM_CHARGE_PIC_CREDIT_Y + 2);		// credit
		this.drawnumber(this.sprite_other + 5, 76, 124, this.PM_CHARGE_PIC_CREDIT_Y, this.pdatax.coin, 0, 0);
	}
  }
  
  startplayer(n) {
    let x = Const.SCR_WIDTH / (Const.MAX_PLAYER + 1) * (n + 1);

    if(this.pdata[n].plane >= 0 && this.pdata[n].startplayer()) {
      let objData = {
        x: x,
        y: Const.SCR_HIGH,
        vx: 4,
        vy: 0
      };

      let player_select_plane = this.playerplane_seq.objs[this.pdata[n].plane];
      let player_model = Const.game.stageModel[player_select_plane.modelid];
      let player = Const.game.new_object(player_model, objData);
      this.pdata[n].planeObj = player;
      this.pdata[n].planeObj.PlayerID = n;
      this.pdata[n].planeObj.score = this.pdata[n].score;
    }
  }
  startselect(n) {
    this.pdata[n].startselect();
    this.pdata[n].score = 0;
    this.countdown = -1;
    player_glob.inst.coin--;
    Const.game.setpass(stageState.PASS_NOT_SET);
    // default a unused plane
    for(let j = 0; j < player_glob.inst.selectplane.length; j++) {
      if (!player_glob.inst.selectplane[j]) {
        this.pdata[n].plane = j;
        break;
      }
    }
  }

  findplayer() {
    for(let i = 0; i < Const.MAX_PLAYER; i++) {
      if (this.pdata[i].planeObj)
        return this.pdata[i].planeObj;
    }
  }

  addscore(score, player) {
    if (this.pdata[player].planeObj)
      return this.pdata[player].planeObj.score += score;
  }

  stagepass() {
    for(let i = 0; i < Const.MAX_PLAYER; i++) {
      if(this.pdata[i].planeObj && this.pdata[i].planeObj.state > objectState.AI_DEATH)
        this.pdata[i].planeObj.stage_pass();
    }
  }

  update(tick) {
    let StopFlag = true;
    for(let i = 0; i <  Const.MAX_PLAYER; i ++) {
      // generate new plane if crashed
      if(this.pdata[i].planeObj) {
        if(this.pdata[i].planeObj.state == objectState.AI_INVALID) {
          delete this.pdata[i].planeObj;
        }
        StopFlag = false;
      }

      if(!this.pdata[i].planeObj) {
        if(this.pdata[i].deadcd > 0) {	    // crash count down
          StopFlag = false;
          this.pdata[i].deadcd--;
          if(this.pdata[i].deadcd == 0) {	  // offically dead
            if(this.pdata[i].life > 0) {
              this.startplayer(i);
            } else {
              player_glob.inst.selectplane[this.pdata[i].plane] = false;	// invalid plane selecting
            }
          }
        } else if(this.pdata[i].life > 0) {	// selecting
          StopFlag = false;
          if(this.pdata[i].ctrl.keyA.is_pressed) {
            this.startplayer(i);
          } else {
            this.pdata[i].selectcdinterval++;
            if(this.pdata[i].selectcdinterval > 30) {
              this.pdata[i].selectcdinterval = 0;
              this.pdata[i].selectcd--;
              if(this.pdata[i].selectcd == 0) {	// selected
                this.startplayer(i);
              }
            }
          }
          if(this.pdata[i].ctrl.left.is_pressed) {
            for(let j = this.pdata[i].plane - 1; j >= 0; j--) {
              if (!player_glob.inst.selectplane[j]) {
                player_glob.inst.selectplane[this.pdata[i].plane] = false;
                this.pdata[i].plane = j;
                player_glob.inst.selectplane[j] = true;
                break;
              }
            }
          } else if(this.pdata[i].ctrl.right.is_pressed) {
            for(let j = this.pdata[i].plane + 1; j < player_glob.inst.selectplane.length; j++) {
              if (!player_glob.inst.selectplane[j]) {
                player_glob.inst.selectplane[this.pdata[i].plane] = false;
                this.pdata[i].plane = j;
                player_glob.inst.selectplane[j] = true;
                break;
              }
            }
          }
        } else {
          if(this.pdata[i].ctrl.keyS.is_pressed && player_glob.inst.coin > 0) {
            this.startselect(i);
            StopFlag = false;
          }
        }
      }
    }
    // life = 0
    if(StopFlag && this.countdown == -1) {
      Const.game.setpass(stageState.STOP_STAGE, this);
      this.countdown = 9;
      this.countdowninterval = 0;
    }

    // store data somewhere for the next stage (not finished yet)
    for(let i = 0; i < Const.MAX_PLAYER; i++) {
      if (this.pdata[i].planeObj) {
        this.pdata[i].bomb = this.pdata[i].planeObj.bombs;
        this.pdata[i].score = this.pdata[i].planeObj.score;
        this.pdata[i].power = this.pdata[i].planeObj.dam_level;
        this.pdata[i].charge = this.pdata[i].planeObj.charge;
      }
    }
  }
}