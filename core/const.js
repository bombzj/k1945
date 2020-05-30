"use strict"
  var Const = {
	game : null,

    SCR_WIDTH     : 224,
    SCR_HIGH			: 320,
    SCR_HEIGHT		: 360,
    FPS_MAX				: 33,


    MAX_PLAYER          : 2,
    // z layer
    MAX_LAYER           : 8,
    // collision groups
    MAX_GROUP           : 16,

    MAX_PLAYER_PLANE    : 6,
    
    MAX_PLANE_SELECT_NUMBER : 6,
    BOMB_INTERVAL : 60,
    MAX_CHARGE_CD : 20,
    MAX_BOUNCE_COUNT : 20,
    COLLIDED_DRAW_INTERNAL : 6,
    DEFAULT_SENS : 15,
    PLAYER_TRACERT_SENS : 5,
// SOUND_DISABLED : true,
    // for test only:
// TICK_JUMP_FROM : 15, // skip main sequence
// TICK_JUMP_TO : 2400,
// FORCE_ENIMY_LIFE : 1, 
// FORCE_PLAYER_LIFE : 1,
// FORCE_PLAYER_POWER : 2,
// FORCE_PLAYER_CHARGE : 3,
// PLAYER_SELECT_DEFAULT : 1,
// PLAYER_SELECT_WAIT : 0,
// PLAYER_SELECTD_WAIT : 0,
// STAGE_START_IMAGE_INTERVAL_SKIP : 60,
  };
  
var objectState = {
  AI_INVALID: 0,
  AI_DEATH: 1,
  AI_DANGER: 2,
  AI_NORMAL: 3,
  AI_BIRTH: 4,
};

var objectConst = {
  GOV_PICKUP_TYPE: 1,
  GOV_PICKUP_COUNT: 2,
  GOV_DAMAGE: 3,
  GOV_CAN_TRACE: 4,
};

var stageState = {
  PASS_NOT_SET: 0,    // in game
  EOF_MAIN_SEQ: 16,   // eof main sequnce but keep updating objects
  PASS_MAIN_SEQ: 32,   // stage passed
  STOP_STAGE: 48,   // pause all
  FORCE_PASS: 99
};

var objectFlag = {
  TFLAG_HAVE_SHADOW: (1 << 0),
  TFLAG_START_PARENT: (1 << 1),
  TFLAG_STICK_PARENT: (1 << 2),
  TFLAG_DIE_PARENT: (1 << 3),
  TFLAG_WINK_RED: (1 << 4),
  TFLAG_WINK_WHITE: (1 << 5)
}
