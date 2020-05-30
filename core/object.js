"use strict"
class object {
  constructor(model, objData) {
    this.state = objectState.AI_BIRTH;

    this.x = objData.x;
    this.y = objData.y;
    // velocity
    this.x_vel = objData.vx;
    this.y_vel = objData.vy;

    this.model = model;

    // display image index
    this.image_index = 0;

    this.image_interval = 0;

    this.current_life = Const.FORCE_ENIMY_LIFE > 0 ? Const.FORCE_ENIMY_LIFE : model.vdata.life;
    
    this.spriteNumber = 1;
    this.sprites = [];
  }
  
  setparent(parent) {
    this.parent = parent;
  }
  
  init() {
//	for(let i = 0;i < this.spriteNumber;i++) {
//		let sprite = SpriteUtil.sprite(this.model.frames, -1000, 0);	// 新建的时候不要画
//		if(!sprite)
//			debugger;
////		sprite.x = this.x - sprite.width / 2;
////		sprite.y = this.y - sprite.height / 2;
//		app.stage.children[this.model.layer].addChild(sprite);
//		this.sprites.push(sprite);
//	}
  }
  
  destroy() {
//	for(let i of this.sprites)
//	  app.stage.children[this.model.layer].removeChild(i);
  }

  update(tick) {
    this.x += this.x_vel;
    this.y += this.y_vel;

    if(this.state == objectState.AI_DEATH) {
      this.state = objectState.AI_INVALID;
    } else if(this.x + this.model.width / 2 < 0 || this.x - this.model.width / 2 > Const.SCR_WIDTH ||
      this.y + this.model.height / 2 < 0 || this.y - this.model.height / 2 > Const.SCR_HIGH) { // die if out of boundary
      this.state = objectState.AI_DEATH;
    } else {
      if(this.model.image_count_per_dir > 1) {
        this.image_interval ++;
        if(this.image_interval >= this.model.image_interval) {
          this.image_interval = 0;
          this.image_index ++;
          if(this.image_index >= this.model.image_count_per_dir) {
            this.image_index = 0;
          }
        }
      }
    }

    if(this.state == objectState.AI_BIRTH) {
      this.state = objectState.AI_NORMAL;
    }
  }

  _dir(x_vel, y_vel) {
    let dir = 0;
    switch (this.model.dir_count) {
      case 2:
        return x_vel > 0.1 ? 1 : 0;
      case 4:
        if(x_vel > 0.1) return 1;
        if(y_vel < -0.1) return 2;
        if(y_vel > 0.1) return 3;
        return 0;
      case 8:
        dir = calcDir.get8(x_vel, y_vel);
        return dir >= 8 ? 0 : dir;
      case 16:
        dir = calcDir.get16(x_vel, y_vel);
        return dir >= 16 ? 0 : dir;
      case 32:
        dir = calcDir.get32(x_vel, y_vel);
        return dir >= 32 ? 0 : dir;
      case 64:
        dir = calcDir.get64(x_vel, y_vel);
        return dir >= 64 ? 0 : dir;
      default:
        return 0;
    }
  }
  
  oncollide(shoot) {
  	let dam = shoot.getobjectvar(objectConst.GOV_DAMAGE);
  	this.current_life -= dam;
  	if(this.current_life <= 0 && this.state > objectState.AI_DEATH) {
  		this.state = objectState.AI_DEATH;
  		if(this.model.vdata.blastseqid > 0) {
  	  		let blast = Const.game.stageSeq[this.model.vdata.blastseqid];
  			for(let i = 0; i < blast.objs.length; i++)
  				Const.game.new_object_seq(blast, i, this);
  		}
  	}
  }
  
  getobjectvar(nID) {
  	switch(nID)
  	{
  	case objectConst.GOV_DAMAGE:
  		return this.model.vdata.damage;
  		break;
  	default:
  		return 0;
  	}
  }
  
  render() {
    this.drawimage(0, this.image_index,  - this.model.image_rects[this.image_index].centerX,
      - this.model.image_rects[this.image_index].centerY);
  }
  
  render_shadow() {
	  
  }
  
  // spriteIndex only if using pixi
  drawimage(spriteIndex, index, offsetx = 0, offsety = 0) {
	  let rect = this.model.image_rects[index];
	  Const.game.ctx.drawImage(this.model.image, rect.x, rect.y , rect.width, rect.height
			  , this.x + offsetx, this.y + offsety, rect.width, rect.height)
  }
  
  drawascii(index, offsetx, offsety, subwidth, subheight, subgrid, asc, margin) {
	  
  }
  
  drawnumber(spriteIndex, index, offsetx, offsety, number, margin, digit = 1) {
	if(number < 0)
	  return;
	if(digit <= 1)
		this.drawimage(spriteIndex, index + number, offsetx, offsety);
	else {
		let str = number.toString();
		offsetx += (digit - str.length) * margin;
		for(let i = 0;i < str.length;i++)
			this.drawimage(spriteIndex + i, index + parseInt(str[i]), offsetx + margin * i, offsety);
	}
  }

  playsound(index, loop) {
   if(index < this.model.sound.length) {
	 if(!this.model.sound[index])
		 return;
     if(loop) {
       this.model.sound[index].loop = true;
     }
     this.model.sound[index].play();
   }
  }
  
  stopsound(index) {
	   if(index < this.model.sound.length) {
		 if(!this.model.sound[index])
			 return;

	     this.model.sound[index].pause();
	   }
	  }
}