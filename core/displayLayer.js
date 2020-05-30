"use strict"
class displayLayer {
  constructor() {
	  this.clear();
  }
  
  addObject(index, obj) {
	  this.layers[index].push(obj)
  }
  
  update() {
	this.clear();
	for(let objg of Const.game.object_group)
	    for(let i = 0; i < objg.length; i++) {
	    	let obj = objg[i];
			let layer = obj.model.layer;
			if(layer >= 0 && layer < Const.MAX_LAYER)
				this.layers[layer].push(obj);
			else
				this.layers[Const.MAX_LAYER].push(obj);
		}
  }

  render() {
	  // clear dead objects
	let deleted = false;	// dirty
	for(let objg of Const.game.object_group)
	    for(let i = 0; i < objg.length; i++) {
	      let obj = objg[i];


	      if(obj.state == objectState.AI_INVALID) {
	        //app.stage.children[obj.model.layer].removeChild(obj.sprite);
	    	obj.destroy();
	    	objg.splice(i--, 1);
	    	// TODO: how to improve performance of js list, linkedlist?
//	    	this.layers[obj.model.layer].erase(obj);
	    	deleted = true;
//	    	console.log("destroy : " + obj.model.classid + " " + obj.model.vdata.imgfile)
	      }
	      
	      if(obj.state <= objectState.AI_DEATH) {
	    	  obj.state--;
	      }
	    }
	if(deleted)
		this.update();
	
	// render all
	for(let i = 0;i < 4;i++) {
		for(let obj of this.layers[i]) {
	      if(obj.state > objectState.AI_DEATH)
	    	  obj.render();
		}
	}

	// draw shadow
	for(let objg of Const.game.object_group)
	    for(let i = 0; i < objg.length; i++) {
	      let obj = objg[i];

	      if(obj.state > objectState.AI_DEATH)
	    	  obj.render_shadow();
	    }
	
	for(let i = 4;i < Const.MAX_LAYER;i++) {
		for(let obj of this.layers[i]) {
	      if(obj.state > objectState.AI_DEATH)
	    	  obj.render();
		}
	}
	
  }
  
  clear() {
	  this.layers = new Array(Const.MAX_LAYER);
	  for(let i = 0;i < Const.MAX_LAYER;i++)
		  this.layers[i] = [];
  }
}