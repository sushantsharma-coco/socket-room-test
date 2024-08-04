const {
  onlineUsers,
  nextChance,
  board,
  winningCombinations,
} = require("./state");
let { onlineUsersCounter, roomCounter } = require("./state");

async function addUser(socket, uid) {
  if (!uid) socket.emit("400", "no uid sent");

  if (onlineUsersCounter == 0) {
    onlineUsers["room-0"] = [
      {
        uno: 0,
        uid,
        sid: socket.id,
        sign: "",
        userCount: 1,
      },
    ];

    socket.emit("choose-sign", "choose from x or o");

    socket.on("choosen-sign", (sign) => {
      if (sign !== "x" && sign !== "o")
        socket.emit("400", "incorrect sign choice");

      onlineUsers["room-0"][0].sign = sign;
      console.log(onlineUsers["room-0"]);
    });

    socket.join("room-0");

    board["room-0"] = ["", "", "", "", "", "", "", "", ""];

    nextChance["room-0"] = onlineUsers["room-0"][0].sign;

    onlineUsersCounter++;

    console.log(onlineUsers);
  } else {
    roomCounter = Math.floor(onlineUsersCounter / 2);

    let roomExists = onlineUsers["room-" + roomCounter]?.length;

    if (roomExists) {
      console.log("roomExists", roomExists, onlineUsersCounter);
      let obj = {
        uid,
        sid: socket.id,
        sign: onlineUsers["room-" + roomCounter][0]?.sign === "x" ? "o" : "x",
        uno: onlineUsers["room-" + roomCounter].length - 1,
        userCount: onlineUsersCounter + 1,
      };

      onlineUsers["room-" + roomCounter].push(obj);
    } else {
      console.log("roomExistsnot", roomExists, onlineUsersCounter);
      onlineUsers["room-" + roomCounter] = [
        {
          uid,
          sid: socket.id,
          sign: "",
          uno: 0,
          userCount: onlineUsersCounter + 1,
        },
      ];

      socket.emit("choose-sign", "choose from x or o");

      socket.on("choosen-sign", (sign) => {
        if (sign !== "x" && sign !== "o")
          socket.emit("400", "incorrect sign choice");

        onlineUsers["room-" + roomCounter][0].sign = sign;
      });

      nextChance["room-" + roomCounter] =
        onlineUsers["room-" + roomCounter][0].sign;
    }

    socket.join("room-" + roomCounter);
    board["room-" + roomCounter] = ["", "", "", "", "", "", "", "", ""];
    console.log("socket rooms ", socket.rooms);
    console.log("add final ", onlineUsers);

    onlineUsersCounter++;

    return "x";
  }
}

function takeTurn(socket) {
  // considering roomnumber is sent from frontend
  // TODO :   first need to check for turn and only that person should be able to take turn

  socket.emit(
    "take-turn",
    `choose position where board is empty string ${board}`
  );

  socket.on("position", (position, uno, roomNumber) => {
    if (onlineUsers[roomNumber][uno].sign !== nextChance[roomNumber]) {
      socket.emit("invalid-chance", `it's ${nextChance[roomNumber]} chance`);
      return;
    }

    if (position > 9 || position < 0) {
      socket.emit(
        "invalid-position",
        "chosen position is invalid as its out of range :",
        position
      );

      return;
    }

    if (board[roomNumber][position] !== "") {
      socket.emit(
        "wrong-position",
        "chosen position is already filled, choose another one"
      );
    }

    board[roomNumber][position] = socket.id;

    if (checkWinner(socket)) {
      return { winner: socket.id, roomNumber };
    }

    return { winner: false, roomNumber };
  });

  return;
}

function checkWinner(socket) {
  winningCombinations.forEach(([a, b, c]) => {
    if (
      ((board[roomNumber][a] == board[roomNumber][b]) ==
        board[roomNumber][c]) ===
      socket.id
    ) {
      return true;
    }
  });
}

module.exports = {
  addUser,
  takeTurn,
};

// let {
//   onlineUsers,
//   signOptions,
//   onlineUsersCounter,
//   board,
//   winningCombinations,
//   nextChance,
// } = require("./state");

// function addUser(socket, sid, uid) {
//   if (!sid || !uid) return false;

//   if (onlineUsersCounter == 0) {
//     onlineUsers[uid] = {
//       uno: onlineUsersCounter, //0
//       sid: sid,
//       room: `room-0`,
//       sign: "",
//     };
//   } else {
//     onlineUsers[uid] = {
//       uno: onlineUsersCounter,
//       sid: sid,
//       room: `room-${Math.floor(onlineUsersCounter / 2)}`,
//       sign: "",
//     };

//     if (onlineUsers[uid].uno % 2 == 0) {
//       nextChance[onlineUsers[uid].room] = "x";
//     }
//   }
//   console.log(onlineUsers[uid]);

//   socket.emit("room update", "you have joined room " + onlineUsers[uid].room);

//   if (onlineUsers[uid].uno % 2 == 0) {
//     socket.emit(`choose-sign ${signOptions}`, (sign) => {
//       onlineUsers[uid].sign = sign == "x" ? "x" : "o";
//     });

//     socket.emit("chosen-sign", onlineUsers[uid].sign);
//   } else {
//     let prev = onlineUsers[uid].uno - 1;
//     let prevSign = "";
//     for (const key in onlineUsers) {
//       if (onlineUsers[key].uno == prev) {
//         prevSign = onlineUsers[key].sign;
//         break;
//       }
//     }

//     onlineUsers[uid].sign = prevSign == "x" ? "o" : "x";

//     socket.emit("assigned-sign", onlineUsers[uid].sign);
//   }

//   onlineUsersCounter++;

//   return true;
// }

// function takeTurn(socket, uid) {
//   socket.emit("take-turn", "its your turn choose a position");

//   if (onlineUsers[uid].sign !== nextChance[onlineUsers[uid].room]) {
//     socket.emit("wrong-chance", "it's not your chance");
//     return;
//   }

//   socket.on("position", (position) => {
//     if (position > 9 || position < 0) {
//       socket.emit("invalid-position", `position : ${position} is invalid`);
//     }

//     if (board[position] == "") {
//       board[position] = socket.id;
//       if (checkWinner(socket.id)) {
//         return true;
//       }
//     } else {
//       socket.emit(
//         "invalid-positiion",
//         `position : ${position} is already filled`
//       );
//     }
//   });

//   let chance = onlineUsers[uid].sign == "x" ? "o" : "x";
//   nextChance[onlineUsers[uid].room] = chance;

//   return false;
// }

// function checkWinner(id) {
//   winningCombinations.forEach(([a, b, c]) => {
//     if (((board[a] == board[b]) == board[c]) == id) {
//       return true;
//     }
//   });

//   return false;
// }

// module.exports = {
//   addUser,
//   takeTurn,
// };
