const onlineUsers = {}; // room :{uid1:sid,sign:x/o}
let onlineUsersCounter = 0;
const signOptions = {
  x: "x",
  o: "o",
};
module.exports = { onlineUsers, signOptions, onlineUsersCounter };
