const app = require("express")();
const http = require("http");
const { Server } = require("socket.io");
const { addUser, takeTurn } = require("./socketUtils");
const { onlineUsers } = require("./state");

const server = http.createServer(app);
const io = new Server(server);

const tictactoe = io.of("/tic-tac-toe");

try {
  tictactoe.on("connection", (socket) => {
    console.log(socket.id + " joined");

    const { user_id } = socket.handshake.query;

    if (!user_id) return;

    addUser(socket, user_id);

    let { winner, roomNumber } = takeTurn(roomNumber, socket);

    if (winner) {
      tictactoe.to(roomNumber).emit("winner", `${winner} won`);

      tictactoe.to(roomNumber).emit("game ended", () => {
        tictactoe.adapter.del(onlineUsers[roomNumber][0].sid);
        tictactoe.adapter.del(onlineUsers[roomNumber][1].sid);
      });
    }

    socket.on("disconnect", () => {
      io.emit("all", socket.id + " disconnected");

      console.log(socket.id + " disconnected");
    });
  });
} catch (error) {
  console.error("in " + tictactoe + " " + error?.message);
}

server.listen(3000, () => console.log("server running on port 3000"));
