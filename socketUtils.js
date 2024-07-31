const { onlineUsers, signOptions, onlineUsersCounter } = require("./state");

function addUser(socket, sid, uid) {
  if (!sid || !uid) return false;

  if (onlineUsersCounter == 0) {
    onlineUsers[uid] = {
      uno: onlineUsersCounter, //0
      sid: sid,
      room: `room-0`,
      sign: "",
    };
  } else {
    onlineUsers[uid] = {
      uno: onlineUsersCounter,
      sid: sid,
      room: `room-${Math.floor(onlineUsersCounter / 2)}`,
      sign: "",
    };
  }

  socket.emit("room update", "you have joined room " + onlineUsers[uid].room);

  if (onlineUsers[uid].uno % 2 == 0) {
    socket.emit(`choose-sign ${signOptions}`, (sign) => {
      onlineUsers[uid].sign = sign == "x" ? "x" : "o";
    });

    socket.emit("chosen-sign", onlineUsers[uid].sign);
  } else {
    let prev = onlineUsers[uid].uno - 1;
    let prevSign = "";
    for (const key in onlineUsers) {
      if (onlineUsers[key].uno == prev) {
        prevSign = onlineUsers[key].sign;
        break;
      }
    }

    onlineUsers[uid].sign = prevSign == "x" ? "o" : "x";

    socket.emit("assigned-sign", onlineUsers[uid].sign);
  }

  onlineUsersCounter++;

  return true;
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
