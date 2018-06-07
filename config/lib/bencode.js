'use strict';

var b = exports;

var encode = function (input) {
  var tokens = [];
  if (typeof input == 'number') {
    tokens.push('i');
    tokens.push(input.toString());
    tokens.push('e');
  } else if (typeof input == 'string') {
    tokens.push(input.length.toString());
    tokens.push(':');
    tokens.push(input);
  } else if (input instanceof Array) {
    tokens.push('l');
    for (var i = 0; i < input.length; i++) {
      tokens.push(encode(input[i]));
    }
    tokens.push('e');
  } else if (typeof input == 'object') {
    tokens.push('d');
    var keys = [];
    for (var ky in input) {
      keys.push(ky);
    }
    keys.sort();
    for (var j = 0; j < keys.length; j++) {
      var k = keys[j];
      var v = input[k];
      tokens.push(encode(k));
      tokens.push(encode(v));
    }
    tokens.push('e');
  } else {
    throw new Error('Unknown type for bencode.');
  }
  return tokens.join('');
};

b.encode = encode;
