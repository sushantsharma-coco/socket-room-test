let {
  onlineUsers,
  signOptions,
  onlineUsersCounter,
  board,
  winningCombinations,
} = require("./state");

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
  console.log(onlineUsers[uid]);

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

function takeTurn(socket, uid) {
  socket.emit("take-turn", "its your turn choose a position");

  socket.on("position", (position) => {
    if (position > 9 || position < 0) {
      socket.emit("invalid-position", `position : ${position} is invalid`);
    }

    if (board[position] == "") {
      board[position] = socket.id;
      if (checkWinner(socket.id)) {
        return true;
      }
    } else {
      socket.emit(
        "invalid-positiion",
        `position : ${position} is already filled`
      );
    }
  });

  return false;
}

function checkWinner(id) {
  winningCombinations.forEach(([a, b, c]) => {
    if (((board[a] == board[b]) == board[c]) == id) {
      return true;
    }
  });
  return false;
}

module.exports = {
  addUser,
  takeTurn,
};
