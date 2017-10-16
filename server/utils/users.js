
class Users {

  constructor () {
    this.users = [];
  }

  addUser(id, name, room) {
    var user = {
      id, 
      name,
      room: room.toUpperCase()};
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    var user = this.getUser(id);
    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }
    return user;
  }

  getUser(id) {
    return this.users.filter((user) => user.id === id)[0];
  }

  getUserList(room) {
    var users = this.users.filter((user) => user.room === room.toUpperCase());
    var namesArray = users.map((user) => user.name);
    return namesArray;
  }

  getRoomList() {
    var roomsArray = this.users.map((user) => user.room);
    return [...new Set(roomsArray)];
  }

  isUserInRoom(name, room) {
    var existingUsers = this.getUserList(room);
    var count = existingUsers.filter((username) => username.toUpperCase() === name.toUpperCase()).length;
    console.log('count', count);
    if (existingUsers.filter((username) => username.toUpperCase() === name.toUpperCase()).length > 0) {
      return true;
    } else {
      return false;
    }
  }

}

module.exports = {Users};