"use strict"
class player_data {
  constructor() {
    this.power = 0;
    this.bomb = 3;
    this.life = 0;
    this.score = 0;
    // plane 0-5, -1 means unselected
    this.plane = -1;
    // plane selected
    this.selected = false;
    // when hit, count down to new
    this.deadcd = 0;

    // select plane count down
    this.selectcd = 9;
    this.selectcdinterval = 0;

    // charging
    this.charge = 0;

    // control
    this.ctrl = {};
    this.touchstart = {};
    this.touchmove = {};
  }
  startselect() {
    this.selectcd = 9;
    this.selectcdinterval = 0;
    this.selected = false;
    this.life = Const.FORCE_PLAYER_LIFE > 0 ? Const.FORCE_PLAYER_LIFE : 3;
  }

  startplayer() {
    if(this.life > 0) {
      this.life--;
      this.deadcd = 30;
      return true;
    }
    return false;
  }
  isalive() {
    return this.deadcd > 0;
  }
}

class player_glob {
  constructor() {
    this.coin = 5;

    this.pdata = [];

    this.selectplane = [];
  }
  readCtrlSet(setData) {
    for(let i = 0; i < Const.MAX_PLAYER_PLANE; i++) {
      this.selectplane.push(false);
    }

    for(let i = 0; i < Const.MAX_PLAYER; i++) {
      this.pdata.push(new player_data());
      let itemSet = setData['Player' + (i + 1)];
      for(let key of Object.keys(itemSet)) {
        this.pdata[i].ctrl[key] = { key: itemSet[key], is_down: false, is_pressed: false };
      }
    }
  }
}
player_glob.inst = new player_glob();
