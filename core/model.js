"use strict"
class frameData {
  constructor(x = 0, y = 0, width = 0, height = 0, centerX = 0, centerY = 0) {
    this.width = width;
    this.height = height;
    this.centerX = centerX;
    this.centerY = centerY;
    this.x = x;
    this.y = y;
  }
}

class model {
  constructor(stageName, stageRes, m) {
      this.layer = m.layer;
      this.width = m.width;
      this.height = m.height;
      this.classid = m.classid;
      this.flag = m.flag;
      this.group = m.groupid;
      // variable data
      this.vdata = m;
	  
    this.image_rects = [];
//    this.frames = [];
//    this.framesInfo = [];
    // res filename
    let resFile = m.imgfile.split('.')[0];

    let json = stageRes[resFile];
    if(!json || !json.image || !json.image.file) {
    	console.log("error loading model : " + m.id + " imgfile " + m.imgfile)
    	return;
    }

    let imgFile = stageName + '/' + json.image.file.split(':')[0];
    
    this.image = Const.game.loadedImages[imgFile];
    
    this.image_count_per_dir = json.image.count_per_dir ? parseInt(json.image.count_per_dir) : 1;
    if (json.rect_list) {
      try {
        for (let rect of json.rect_list) {
          let sp_num = rect.split(':');
          if (sp_num.length < 4) break;
          let data = new frameData();
          let x = parseInt(sp_num[0]);
          let y = parseInt(sp_num[1]);
	      data.x = x;
	      data.y = y;
          data.width = parseInt(sp_num[2]); data.centerX = data.width / 2;
          data.height = parseInt(sp_num[3]); data.centerY = data.height / 2;
          // the default center is the center of image
          if(sp_num.length >= 6) {
            data.centerX = parseInt(sp_num[4]) || data.centerX;
            data.centerY = parseInt(sp_num[5]) || data.centerY;
          }
          // auto split images
          if(sp_num.length > 6) {
            let count_w = parseInt(sp_num[6]);
            let count_h = parseInt(sp_num[7]);
            for(let j = 0; j < count_h; j++) {
              for(let i = 0; i < count_w; i++){
//                this.frames.push(SpriteUtil.frame(imgFile, x + i * data.width, y + j * data.height, data.width, data.height));
            	let sdata = new frameData(x + i * data.width, y + j * data.height, data.width, data.height, data.centerX, data.centerY);
                this.image_rects.push(sdata);
              }
            }
          } else {
//            this.frames.push(SpriteUtil.frame(imgFile, x, y, data.width, data.height));
            this.image_rects.push(data);
          }
        }
      }catch (e) {
    	  console.log("model:" + m.id + " error:" + e)
      }
      this.image_interval = json.image.interval || 1;
      this.dir_count = Math.floor(this.image_rects.length / this.image_count_per_dir);
      // collision boxes
      this.hit_rects = [];
      	if("x" in m)
      		this.hit_rects.push({x : m.x, y : m.y, w : m.w, h : m.h});
    }

   this.sound = [];
    if(json.sound_list) {
      for (let sound of json.sound_list) {
        this.sound.push(Const.game.stageSound[sound]);
      }
    }
  }

  haveshadow(){ return (this.flag & objectFlag.TFLAG_HAVE_SHADOW) > 0; }
  startparent(){ return (this.flag & objectFlag.TFLAG_START_PARENT) > 0; }
  stickparent(){ return (this.flag & objectFlag.TFLAG_STICK_PARENT) > 0; }
  dieparent(){ return (this.flag & objectFlag.TFLAG_DIE_PARENT) > 0; }
  winkred(){ return (this.flag & objectFlag.TFLAG_WINK_RED) > 0; }
  winkwhite(){ return (this.flag & objectFlag.TFLAG_WINK_WHITE) > 0; }
}