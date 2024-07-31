const { onlineUsers, signOptions, onlineUsersCounter } = require("./state");

function addUser(sid, uid) {
  if (onlineUsersCounter % 2 == 0) {
    onlineUsers["room-" + (onlineUsersCounter - 1)] = { uid: uid, sid: sid };
  } else {
    onlineUsers["room-" + onlostpointercapture] = { uid: uid, sid: sid };
  }
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
