const onlineUsers = {}; // uid :{uno:onlineusercount, sid:sid,sign:x/o,room:roomNumber}
let onlineUsersCounter = 0;
const signOptions = {
  x: "x",
  o: "o",
};

const board = ["", "", "", "", "", "", "", "", ""];

const nextChance = {};

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

module.exports = {
  onlineUsers,
  signOptions,
  onlineUsersCounter,
  board,
  winningCombinations,
  nextChance,
};
