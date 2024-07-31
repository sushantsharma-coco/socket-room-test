const { onlineUsers, signOptions, onlineUsersCounter } = require("./state");

function addUser(socket, sid, uid) {
  if (onlineUsersCounter % 2 == 0) {
    onlineUsers[uid] = {
      sid: sid,
      room: `room-${onlineUsersCounter}`,
      sign: "",
    };

    socket.join(onlineUsers[uid].room);
  } else {
    onlineUsers[uid] = {
      sid: sid,
      room: `room-${onlineUsersCounter - 1}`,
      sign: "",
    };

    socket.join(onlineUsers[uid].room);
  }

  onlineUsersCounter++;
}

function assignSign(sid, sign) {}

function getTotalUsersCount() {}

function getRoomUsersCount() {}

function sendUserDetails() {}

module.exports = {
  addUser,
  getRoomUsersCount,
  getTotalUsersCount,
  sendUserDetails,
  assignSign,
};
