const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {
  var users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: 1,
      name: 'Fred',
      room: 'Geek room'
    }, {
      id: 2,
      name: 'Bill',
      room: 'Geek room'
    }, {
      id: 3,
      name: 'John',
      room: 'Cool room'
    }];
  });

  it('should add new user', () => {
    users = new Users();
    var user = {
      id: '123',
      name: 'Lance',
      room: 'Geek room'
    };
    var res = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });

  it('should return names for Geek room', () => {
    var userList = users.getUserList('Geek room');
    expect(userList).toEqual(['Fred', 'Bill']);
  });

  it('should remove a user', () => {
    var oldLength = users.users.length;
    var userToDelete = users.users[1];
    var deletedUser = users.removeUser(userToDelete.id);
    expect(deletedUser).toBe(userToDelete);
    expect(deletedUser.id).toBe(userToDelete.id);
    expect(users.users.length).toBe(oldLength - 1);
  });

  it('should not remove a user', () => {
    var oldLength = users.users.length;
    var userToDelete = 'not a realy user';
    var deletedUser = users.removeUser(userToDelete);
    expect(deletedUser).toBeFalsy();
    expect(users.users.length).toBe(oldLength);
  });

  it('should find a user', () => {
    var id = 1;
    var user = users.getUser(id);
    expect(user).not.toBe(undefined);
    expect(user.id).toBe(id);
  });

  it('should not find a user', () => {
    var id = 990;
    var user = users.getUser(id);
    expect(user).toBeFalsy();
  });

});