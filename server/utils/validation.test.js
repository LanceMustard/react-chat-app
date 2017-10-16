var expect = require('expect');
var {isRealString} = require('./validation.js');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    var res = isRealString(55);
    expect(res).toBe(false);
  });
  it('should reject string with only spaces', () => {
    var res = isRealString('    ');
    expect(res).toBe(false);
  });
  it('should allow string wtih non-space characters', () => {
    var res = isRealString('hello there  ');
    expect(res).toBe(true);
  });
});