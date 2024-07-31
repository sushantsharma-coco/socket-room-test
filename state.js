const onlineUsers = {}; // uid :{uno:onlineusercount, sid:sid,sign:x/o,room:roomNumber}
let onlineUsersCounter = 0;
const signOptions = {
  x: "x",
  o: "o",
};
module.exports = { onlineUsers, signOptions, onlineUsersCounter };
