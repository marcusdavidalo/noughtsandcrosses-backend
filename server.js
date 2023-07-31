// server/server.js
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
// const cors = require("cors");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://nacttcnc.vercel.app/");
  next();
});

// app.use(cors());

let waitingPlayer = null;

io.on("connection", (socket) => {
  if (!waitingPlayer) {
    // If there's no waiting player, assign this socket as the waiting player
    waitingPlayer = socket;
    socket.emit("message", { type: "waiting" });
  } else {
    // If there's a waiting player, start a new game with the two players
    const playerX = waitingPlayer;
    const playerO = socket;
    waitingPlayer = null;

    playerX.emit("message", { type: "game_start", symbol: "X" });
    playerO.emit("message", { type: "game_start", symbol: "O" });

    const initialBoard = Array(9).fill(null);
    playerX.emit("message", { type: "board_state", board: initialBoard });
    playerO.emit("message", { type: "board_state", board: initialBoard });

    let isXNext = true;

    function calculateWinner(board) {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      for (const line of lines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a];
        }
      }
      return null;
    }

    function handleMove(socket) {
      return ({ board }) => {
        // Handle moves and other messages from clients
        // You can implement more logic here depending on your needs
        // For example, broadcasting the move to the other player
        // and checking for a winner or draw.
        // Send back updated game state if necessary.
        const winner = calculateWinner(board);
        if (winner || board.every((cell) => cell !== null)) {
          // Game over
          socket.emit("message", { type: "game_over", winner });
          socket.broadcast.emit("message", { type: "game_over", winner });
          return;
        }

        isXNext = !isXNext;
        socket.broadcast.emit("message", { type: "board_state", board });
      };
    }

    playerX.on("move", handleMove(playerX));
    playerO.on("move", handleMove(playerO));
  }

  socket.on("reset", () => {
    // Handle reset message from clients
    // Implement logic to reset the game state
    // For example, reset the board and notify both players
    const initialBoard = Array(9).fill(null);
    socket.emit("message", { type: "board_state", board: initialBoard });
    socket.broadcast.emit("message", {
      type: "board_state",
      board: initialBoard,
    });
  });

  socket.on("disconnect", () => {
    // If a player disconnects, reset the waiting player and notify them
    if (waitingPlayer === socket) {
      waitingPlayer = null;
    }
  });
});

server.listen(5000, () => {
  console.log("Server started on port 5000");
});
