"use strict"
function CalcDir() {
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  let sin_table = [];
  let cos_table = [];

  for(let ang = 0; ang <= 360; ang++) {
    let tmp = deg2rad(ang);
    sin_table.push(Math.sin(tmp));
    cos_table.push(Math.cos(tmp));
  }


  let sin_table4 = [];
  for(let ang = 0; ang <= 4; ang++) {
    let tmp = deg2rad((ang + 0.5) * 90 / 4);
    sin_table4.push(Math.sin(tmp));
  }

  let sin_table8 = [];
  for(let ang = 0; ang <= 8; ang++) {
    let tmp = deg2rad((ang + 0.5) * 90 / 8);
    sin_table8.push(Math.sin(tmp));
  }

  let sin_table16 = [];
  for(let ang = 0; ang <= 16; ang++) {
    let tmp = deg2rad((ang + 0.5) * 90 / 16);
    sin_table16.push(Math.sin(tmp));
  }

  let sin_table2 = [];
  for(let ang = 0; ang <= 2; ang++) {
    let tmp = deg2rad((ang + 0.5) * 90 / 2);
    sin_table2.push(Math.sin(tmp));
  }

  /**
   * @return {number}
   */
  function GetDirection8Iden(x, y) {
    let sin = Math.abs(y);
    let i = 2;
    if(sin < sin_table2[0])
      i = 0;
    else if(sin < sin_table2[1])
      i = 1;

    if(x > 0) {
      return y > 0 ? i : 8 - i;
    } else {
      return y > 0 ? 4 - i : 4 + i;
    }
  }
  this.get8 = function(x, y) {
    let v = Math.sqrt(x * x + y * y);
    return GetDirection8Iden(x / v, y / v);
  };

  function GetDirection16Iden(x, y) {
    let sin = Math.abs(y);
    let i = 0;
    for(; i < 4; i++) {
      if (sin < sin_table4[i])
        break;
    }

    if(x > 0) {
      return y > 0 ? i : 16 - i;
    } else {
      return y > 0 ? 8 - i : 8 + i;
    }
  }
  this.get16 = function(x, y) {
    let v = Math.sqrt(x * x + y * y);
    return GetDirection16Iden(x / v, y / v);
  };

  function GetDirection32Iden(x, y) {
    let sin = Math.abs(y);
    let i = 0;
    for(; i < 8; i++) {
      if (sin < sin_table8[i])
        break;
    }

    if(x > 0) {
      return y > 0 ? i : 32 - i;
    } else {
      return y > 0 ? 16 - i : 16 + i;
    }
  }
  this.get32 = function(x, y) {
    let v = Math.sqrt(x * x + y * y);
    return GetDirection32Iden(x / v, y / v);
  };

  function GetDirection64Iden(x, y) {
    let sin = Math.abs(y);
    let i = 0;
    for(; i < 16; i++) {
      if (sin < sin_table16[i])
        break;
    }

    if(x > 0) {
      return y > 0 ? i : 64 - i;
    } else {
      return y > 0 ? 32 - i : 32 + i;
    }
  }
  this.get64 =  function(x, y) {
    let v = Math.sqrt(x * x + y * y);
    return GetDirection64Iden(x / v, y / v);
  };
}

var calcDir = new CalcDir();