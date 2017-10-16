var expect = require('expect');
var {generateMessage, generateLocationMessage} = require('./message.js');

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    var from = 'test@example.com';
    var text = 'this is a text';
    var message = generateMessage(from, text);
    expect(message).toMatchObject({from, text});
    expect(typeof(message.createdAt)).toBe('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    var from = 'test@example.com';
    var latitude = 32.111;
    var longitude = 115.111;
    var url = 'https://www.google.com/maps?q=32.111,115.111';
    var message = generateLocationMessage(from, latitude, longitude);
    expect(message).toMatchObject({from, url});
    expect(typeof(message.createdAt)).toBe('number');
  });
});