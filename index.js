const http = require("http");
const { Server } = require("socket.io");
const express = require("express");

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 1 * 60 * 1000, // 1 minute
    skipMiddlewares: true,
  },
});

const players = {};

const signs = {
  x: false,
  o: false,
};
let currentPlayer = "x";
let board = ["", "", "", "", "", "", "", "", ""];

const winingPositions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner(socketId) {
  winingPositions.forEach(([a, b, c]) => {
    if (board[a] == board[b] && board[b] == board[c] && board[c] == socketId) {
      return true;
    }
  });

  return false;
}

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Handle player assignment
  socket.on("sign", (sign) => {
    if (!signs.x) {
      signs.x = socket.id;
    } else if (!signs.o) {
      signs.o = socket.id;
    } else {
      socket.emit("wrong-operator", "Game already full");
      return;
    }

    players[socket.id] = sign;
    socket.emit("selections", { players, signs });
    io.emit("selections", { players, signs });
  });

  // Handle player moves
  socket.on("position", (position) => {
    if (signs[currentPlayer] !== socket.id) {
      socket.emit("wrong-player", "It's not your turn");
      return;
    }

    if (position < 0 || position > 8 || board[position] !== "") {
      socket.emit("invalid-position", "Position is invalid or taken");
      return;
    }

    board[position] = players[socket.id];
    io.emit("board-update", board);

    if (checkWinner(players[socket.id])) {
      io.emit("winner", players[socket.id]);
    } else {
      currentPlayer = currentPlayer === "x" ? "o" : "x";
    }
  });

  // Handle disconnection
  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);
    delete players[socket.id];
    if (signs.x === socket.id) {
      signs.x = false;
    } else if (signs.o === socket.id) {
      signs.o = false;
    }
    io.emit("selections", { players, signs });
  });
});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
