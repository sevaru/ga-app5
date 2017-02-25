if (!Object.values) {
  Object.values = x =>
      Object.keys(x).reduce((y, z) =>
          y.push(x[z]) && y, []);
}

if (!Object.entries) {
  Object.entries = x =>
      Object.keys(x).reduce((y, z) =>
          y.push([z, x[z]]) && y, []);
}


// EDGE doesnot has it :( 
if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/) {
    if (this == null) {
      throw new TypeError('Array.prototype.includes called on null or undefined');
    }

    var O = Object(this);
    var len = parseInt(O.length, 10) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1], 10) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
        return true;
      }
      k++;
    }
    return false;
  };
}