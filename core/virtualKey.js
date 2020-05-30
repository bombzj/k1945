var sUserAgent = navigator.userAgent.toLowerCase();
var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
var bIsMidp = sUserAgent.match(/midp/i) == "midp";
var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
var bIsAndroid = sUserAgent.match(/android/i) == "android";
var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM||true) {

  let joystick = new Joystick({
    zone: document.querySelector('#left'),
    size: (width * 0.3)
  }).init();
  joystick.onStart = function(distance, angle, degree) {
    if(player_glob.inst.pdata.length == 0) return;

    joystick.onEnd();
    let dir = [['right'], ['up', 'right'], ['up'], ['up', 'left'], ['left'], ['left', 'down'], ['down'], ['down', 'right'], ['right'] ];
    for(let i of dir[Math.floor((degree - 22.5) / 45) + 1]) {
      player_glob.inst.pdata[0].ctrl[i].is_down = true;
      player_glob.inst.pdata[0].ctrl[i].is_pressed = true;
    }
  }
  joystick.onEnd = function(distance, angle) {
    if(player_glob.inst.pdata.length == 0) return;
    for(let i of ['up', 'down', 'right', 'left']) {
      player_glob.inst.pdata[0].ctrl[i].is_down = false;
      player_glob.inst.pdata[0].ctrl[i].is_pressed = false;
    }
  }

  var jsbutton = new Joystick({
    zone: document.querySelector('#right'),
    size: (width * 0.3)
  }).init();
  jsbutton.onStart = function(distance, angle) {
    if(player_glob.inst.pdata.length == 0) return;

    jsbutton.onEnd();
    switch(angle) {
      case 'up':
        player_glob.inst.pdata[0].ctrl.keyS.is_down = true;
        player_glob.inst.pdata[0].ctrl.keyS.is_pressed = true;
        break;
      case 'right':
        player_glob.inst.pdata[0].ctrl.keyB.is_down = true;
        player_glob.inst.pdata[0].ctrl.keyB.is_pressed = true;
        break;
      case 'left':
        player_glob.inst.pdata[0].ctrl.keyA.is_down = true;
        player_glob.inst.pdata[0].ctrl.keyA.is_pressed = true;
    }
  }
  jsbutton.onEnd = function(distance, angle) {
    if(player_glob.inst.pdata.length == 0) return;
    for(let i of ['keyS', 'keyB', 'keyA']) {
      player_glob.inst.pdata[0].ctrl[i].is_down = false;
      player_glob.inst.pdata[0].ctrl[i].is_pressed = false;
    }
  }
}
