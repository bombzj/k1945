"use strict"
class blastobject extends object {
  constructor(model, objData) {
    super(model, objData);
    this.playsound(0);
  }
  update(tick) {
    if(++this.image_interval >= this.model.image_interval) {
      this.image_interval = 0;

      // clear right after end of animation
      if(++this.image_index >= this.model.image_count_per_dir)
        this.state = objectState.AI_DEATH;
    }
  }

}