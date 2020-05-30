"use strict"
function manager() {
  // internal variables
  var mng = this;
  var stageName = undefined;    // stage dir name
  var loadedImages;

  this.ctx = canvas.getContext("2d");
  
  function Refresh() {
    Const.game.appTicker();
    setTimeout(Refresh, 16);
  }

  var timer = setTimeout(Refresh, 16);

  canvas.addEventListener("touchstart", function (event) {
    for (let i = 0; i < event.changedTouches.length; i++)
      Const.game.touchEvent("touchstart", event.changedTouches[i].identifier, event.changedTouches[i].clientX / scale, event.changedTouches[i].clientY / scale)
  }, false);
  canvas.addEventListener("touchmove", function (event) {
    for (let i = 0; i < event.changedTouches.length; i++)
      Const.game.touchEvent("touchmove", event.changedTouches[i].identifier, event.changedTouches[i].clientX / scale, event.changedTouches[i].clientY / scale)
  }, false);
  canvas.addEventListener("touchend", function (event) {
    for (let i = 0; i < event.changedTouches.length; i++)
      Const.game.touchEvent("touchend", event.changedTouches[i].identifier)
  }, false);

  // stage resource
  this.stageModel = [];

  this.layer = new displayLayer();
  // stage sequence
  this.stageSeq = [];
  // progress of stage
  this.mainSeqOffset = 0;
  // moving track
  this.tracks = [];
  
// group by hit type
  this.object_group = [];
  for(let i = 0;i < Const.MAX_GROUP;i++)  this.object_group[i] = [];

  // group-group hit setting
  this.hit_table;

  this.keyEvent = function(event, keyCode) {
    for(let player_item of player_glob.inst.pdata) {
      for(let keySet of Object.values(player_item.ctrl)) {
        if(keySet.key == keyCode) {
          if (event == 'keydown') {
//        	  console.log('keydown ' + keyCode)
            keySet.is_down = keySet.is_pressed = true;
          } else {
            keySet.is_down = keySet.is_pressed = false;
          }
        }
      }
    }
  };
  
  let UIRect = [120, 300, 90, 90];
  let buttonARect = [UIRect[0], UIRect[1] + UIRect[3] / 3, UIRect[2] / 3, UIRect[3] / 3];	// x, y, w, h
  let buttonBRect = [UIRect[0] + UIRect[2] * 2 / 3, UIRect[1] + UIRect[3] / 3, UIRect[2] / 3, UIRect[3] / 3];
  let buttonSRect = [UIRect[0] + UIRect[2] / 3, UIRect[1], UIRect[2] / 3, UIRect[3] / 3];
  function inRect(x, y, rect) {
	  if(x >= rect[0] && x < rect[0] + rect[2] &&
			  y >= rect[1] && y < rect[1] + rect[3])
		  return true;
	  return false;
  }
  
  let touchMoving = -1;	// touch id of moving
  let touchA = -1;	// charge
  
  this.touchEvent = function(event, index, x, y) {
	  let player_item = player_glob.inst.pdata[0];
	  if (event == 'touchstart') {
		  if(inRect(x, y, buttonARect)) {
			  player_item.ctrl.keyA.is_pressed = true;
			  player_item.ctrl.keyA.is_down = true;
			  touchA = index;
		  } else if(inRect(x, y, buttonBRect)) {
			  player_item.ctrl.keyB.is_pressed = true;
		  } else if(inRect(x, y, buttonSRect)) {
			  player_item.ctrl.keyS.is_pressed = true;
		  } else {
			  if(touchMoving == -1) {
				  player_item.touchstart.is_active = true;
				  player_item.touchstart.x = x;
				  player_item.touchstart.y = y;
				  touchMoving = index;
			  }
		  }
	  }
	  if (event == 'touchmove') {
		  if(index == touchMoving) {
			  player_item.touchmove.is_active = true;
			  player_item.touchmove.offsetx = x - player_item.touchstart.x;
			  player_item.touchmove.offsety = y - player_item.touchstart.y;
		  }
	  }
	  if (event == 'touchend') {
		  if(index == touchMoving) {
			  player_item.touchmove.is_active = false;
			  player_item.touchmove.offsetx = 0;
			  player_item.touchmove.offsety = 0;
			  touchMoving = -1;
		  } else if(index == touchA) {
			  player_item.ctrl.keyA.is_down = false;
			  touchA = -1;
		  }
	  }
	  
  }

  this.gameTick = 0;
  this.frameTick = 0;	// increasing whether game is paused or not
  function update() {

    for(let objg of mng.object_group) {
        for(let obj of objg) {
          if(obj.state > objectState.AI_DEATH)
            obj.update(mng.gameTick);
        }
    }
    // generate new objects according to sequence
    let mainSeq = mng.stageSeq[0].objs;
    while (eofstage < stageState.EOF_MAIN_SEQ && mng.mainSeqOffset < mainSeq.length && mainSeq[mng.mainSeqOffset].starttime < mng.gameTick) {
      let objData = mainSeq[mng.mainSeqOffset];
      let model = mng.stageModel[objData.modelid];
      let obj = Const.game.new_object(model, objData);

      mng.mainSeqOffset++;
    }
    
    if(eofstage < stageState.EOF_MAIN_SEQ && Const.TICK_JUMP_FROM > 0 && mng.gameTick < Const.TICK_JUMP_TO && mng.gameTick >= Const.TICK_JUMP_FROM) {
    	mng.gameTick = Const.TICK_JUMP_TO;
        while (eofstage < stageState.EOF_MAIN_SEQ && mng.mainSeqOffset < mainSeq.length && mainSeq[mng.mainSeqOffset].starttime < mng.gameTick) {
          mng.mainSeqOffset++;
        }
    }
  }

  function hittest() {
	for(let i = 0; i < Const.MAX_GROUP; i++) {
		for(let j = 0; j < Const.MAX_GROUP; j++) {
			if((mng.hit_table[i] >> j) & 1)  {

				for(let sobject of mng.object_group[i]) {
					for(let dobject of mng.object_group[j]) {

						if(sobject.state <= objectState.AI_DEATH || dobject.state <= objectState.AI_DEATH)
							continue;
						if(sobject.model.hit_rects.length &&
							dobject.model.hit_rects.length &&
							is_intersect(sobject, dobject)) {
							sobject.oncollide(dobject);
							dobject.oncollide(sobject);
						}
					}
				}
			}
		}
	}
  }
  
  function clearInput(){
    for(let player_item of player_glob.inst.pdata) {
        for(let keySet of Object.values(player_item.ctrl)) {
          keySet.is_pressed = false;
        }
        player_item.touchstart.is_active = false;
      }
  }
  
//	-----------------
//  |   -----------   |
//|  |     x     |  |
//  |   -----------   |
// -----------------
  function is_intersect(src, des) {

  	let x_offset = des.x - src.x;
  	let y_offset = des.y - src.y;
  	for(let i = 0; i < src.model.hit_rects.length; i++) {
  		for(let j = 0; j < des.model.hit_rects.length; j++) {
  			let srect = src.model.hit_rects[i];
  			let drect = des.model.hit_rects[j];
  			let sx1 = srect.x + x_offset;
  			let sx2 = sx1 + srect.w;
  			let sy1 = srect.y + y_offset;
  			let sy2 = sy1 + srect.h;
  			let dx2 = drect.x + drect.w;
  			let dy2 = drect.y + drect.h;
  			if( !(sx1 < drect.x && sx2 < drect.x || sx1 > dx2 && sx2 > dx2) &&
  				!(sy1 < drect.y && sy2 < drect.y || sy1 > dy2 && sy2 > dy2 ) )
  				return true;
  		}
  	}
  	return false;
  }
  
  this.removeInput = function() {
	  
  }

  let fpsElapseTime = 1000 / Const.FPS_MAX;
  let fpsNextTime = 0;
  function doStage() {
	let nowTime = (new Date()).getTime();
	if(nowTime < fpsNextTime)
		return false;
	fpsNextTime += fpsElapseTime;
	if(fpsNextTime < nowTime)	// if fps is too low
		fpsNextTime = nowTime;
	  
    if(eofstage < stageState.FORCE_PASS) {

      if(eofstage < stageState.STOP_STAGE) {

        update();

        hittest();
        if(eofstage < stageState.EOF_MAIN_SEQ)
          mng.gameTick++;

        clearInput();
      } else if(singleupdate) {
        singleupdate.update(mng.gameTick);
      }

      this.ctx.save();  

      this.ctx.beginPath();
      this.ctx.rect(0, 0, Const.SCR_WIDTH, Const.SCR_HIGH);
      this.ctx.clip();  // clip if rendering out of the screen
      
      mng.layer.render();
      
      this.ctx.restore();
      

      this.ctx.globalAlpha = 0.5;
      this.ctx.drawImage(mng.buttonImage, UIRect[0], UIRect[1], UIRect[2], UIRect[3]);
      this.ctx.globalAlpha = 1;
      
      this.frameTick++;
      return true;
    }
    return false;
  }

  var eofstage = stageState.PASS_NOT_SET;
  var singleupdate = undefined;
  this.setpass = function(flag, single) {
    eofstage = flag;
    singleupdate = undefined;

    switch(eofstage) {
      case stageState.STOP_STAGE:
        singleupdate = single;
        break;
    }
  };
  
  this.new_object = function(model, objData) {
	  let obj = this.new_object_base(model, objData);
	  if(obj) {
		  obj.init();
		  Const.game.object_group[obj.model.group].push(obj);
		  this.layer.addObject(obj.model.layer, obj);	
		  return obj;
	  }
  }
  
  this.new_object_base = function(model, objData) {
	// if("vdata" in model)
	// 	console.log('new object ' + model.vdata.id + "/" + model.classid + " " + model.vdata.imgfile + " " + 
	// 			Math.floor(objData.x) + "," + Math.floor(objData.y) + "," + Math.floor(objData.vx) + "," + Math.floor(objData.vy) + "," + model.layer)
	// else
	// 	debugger;

	// TODO recycle object
//	pobj = recycle[id][--i];
//	recycle[id].pop_back();
//	pobj->reset(x, y, xv, yv);
	
    switch (model.classid) {
      case 0:
        return new player(model, objData);
      case 1:
        return new airplane(model, objData);
	  case 2:
	    return new bullet(model, objData);
      case 3:
        return new tracer_object(model, objData);
      case 4:
    	return  new pickup_object(model, objData);
      case 5:
        return new groundobject(model, objData);
      case 6:
        return new backgroundobject(model, objData);
      case 7:
        return new trackobject(model, objData);
      case 8:
        return new aimbullet(model, objData);
      case 9:
        return new bigobject(model, objData);
      case 10:
        return new blastobject(model, objData);
      case 11:
    	return new container(model, objData);
      case 12:
        return new clearstageobject(model, objData);
      case 13:
        return new groundTrackObject(model, objData);
      case 14:
        return new startstageobject(model, objData);
      case 15:
        return new redirector(model, objData);
      case 16:
    	return new playerselectobject(model, objData);
      case 17:
        return new playermanager(model, objData);
      case 18:
        return new bigtracertobject(model, objData);
      case 19:
        return new expaimbullet(model, objData);
      case 20:
        return new geardown(model, objData);
      default: return;
    }
  }
  
  this.new_object_param = function(param, father) {
	  let model = this.stageModel[param.modelid];
	  if(father) {
		  let obj;
		  if(model.startparent()) {
			  obj = this.new_object(model, {
				  x : father.x + param.x,
				  y : father.y + param.y,
				  vx : param.vx,
				  vy : param.vy
			  });
		  } else {
			  obj = this.new_object(model, param);
		  }

		  if(obj)
			  obj.setparent(father);
		  return obj;
	  } else {
		  return this.new_object(model, param);
	  }
  }
  
  this.new_object_seq = function(seq, index, father) {
	  return this.new_object_param(seq.objs[index], father);
  }

  function getImageList(stage, res) {
    let imageList = {};
    // files going to load
    for(var key of Object.keys(res)) {
      let json = res[key];
      if(!json.image || !json.image.file) continue;
      let imgFile = stage + '/' + json.image.file.split(':')[0];
      imageList[imgFile] = 1;
    }
    return Object.keys(imageList);
  }

  function getSoundFile(stage, res) {
    let list = {};

    for(var key of Object.keys(res)) {
      let json = res[key];
      if(!json.sound_list) continue;
      for(let i of json.sound_list) {
        let file = stage + '/' + i;
        list[i] = file.replace('wav', 'ogg').split(':')[0];
      }
    }
    return list;
  }

  this.appTicker = function () {};
  this.stageSound = {};


  loadJSON('setting.json', function (data){
    let setting = data;
    if(!mng.stageName) {
      // read setting of keys
      player_glob.inst.readCtrlSet(setting);
      mng.stageName = setting.stage[0];
    } else {
      // TODO: check next stage
      let index = setting.stage.indexOf(mng.stageName);
      if(index >= setting.stage.length) {

        return;
      } else {
        mng.stageName = setting.stage[index + 1];
      }
    }

    loadJSON(mng.stageName + '/stage_resource.json', function (data){
      let stageRes = data;

      if(!Const.SOUND_DISABLED) {
	      let sound = getSoundFile(mng.stageName, stageRes);
	      sounds.whenLoaded = function () {	// go on even loading failed
	         for(let i of Object.keys(sound)) {
	           mng.stageSound[i] = sounds[sound[i]];
	           mng.stageSound[i].volume=0.3;
	         }

	         loadMore(stageRes);
	      };
	      sounds.load(Object.values(sound));
      } else {
    	  loadMore(stageRes);
      }

    });
  });
  
  
  function loadImages(sources, callback){
	    var count = 0,
	        images ={},
	        imgNum = 0;
	    for(let src of sources){
	        imgNum++;
	    }
	    for(let src of sources){
	        images[src] = new Image(src);
	        images[src].onload = images[src].onerror = function(){
	            if(++count >= imgNum){
	                callback(images);
	            }
	        };

	        images[src].src = src;
	    }
	}
  
  function loadMore(stageRes) {

      let file = getImageList(mng.stageName, stageRes);
      let buttonFile = "res/button.png";
      file.push(buttonFile);
      loadImages(file, function (images) {
    	  mng.buttonImage = images["res/button.png"];
    	  mng.loadedImages = images;
    	  
    	  file = [];

          file.push();
    	  
          loadJSON(mng.stageName + '/stage.json', function (data) {
	        let stageData = data;
	        for(let m of stageData.models) {
	          let mod = new model(mng.stageName, stageRes, m);
	          mng.stageModel.push(mod);
	        }
	        mng.stageSeq = stageData.seqs;
	        mng.tracks = stageData.tracks;
	        mng.hit_table = stageData.hittable;
	
	        mng.appTicker = doStage;
	        fpsNextTime = (new Date()).getTime();
	      });
      });
  }
  
  function loadJSON(path, success, error)
  {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function()
      {
          if (xhr.readyState === XMLHttpRequest.DONE) {
              if (xhr.status === 200) {
                  if (success)
                      success(JSON.parse(xhr.responseText));
              } else {
                  if (error)
                      error(xhr);
              }
          }
      };
      xhr.open("GET", path, true);
      xhr.send();
  }
}