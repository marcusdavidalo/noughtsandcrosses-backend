const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const {
  createBoard,
  checkWin,
  checkDraw,
  makeMove,
  PLAYER_X,
  PLAYER_O,
  EMPTY_CELL,
} = require("./tictactoe");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());

let gameState = {
  board: createBoard(),
  currentPlayer: PLAYER_X,
  winner: null,
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  io.emit("boardUpdate", gameState);

  socket.on("disconnect", () => {
    console.log("A user disconnected.");
  });

  socket.on("boardUpdate", ({ board: updatedBoard, currentPlayer, winner }) => {
    gameState = { board: updatedBoard, currentPlayer, winner };
    io.emit("boardUpdate", gameState);
  });
});

setInterval(() => {
  io.emit("boardUpdate", gameState);
}, 100);

app.post("/api/reset", (req, res) => {
  gameState = { board: createBoard(), currentPlayer: PLAYER_X, winner: null };
  io.emit("boardUpdate", gameState);
  res.json({ message: "Game reset." });
});

app.post("/api/move", (req, res) => {
  const { row, col } = req.body;

  if (
    row === undefined ||
    col === undefined ||
    gameState.board[row] === undefined ||
    gameState.board[row][col] !== EMPTY_CELL
  ) {
    return res.status(400).json({ error: "Invalid move." });
  }

  const currentPlayer =
    gameState.board.flat().filter((cell) => cell === PLAYER_X).length ===
    gameState.board.flat().filter((cell) => cell === PLAYER_O).length
      ? PLAYER_X
      : PLAYER_O;

  // Always emit a board update to all connected clients
  gameState.board = makeMove(gameState.board, currentPlayer, row, col);
  console.log("Emitting board update:", gameState.board);
  io.emit("boardUpdate", {
    ...gameState,
    currentPlayer: getOpponentName(currentPlayer),
  });

  const winner = checkWin(gameState.board, currentPlayer);
  if (winner) {
    return res.json({
      ...gameState,
      currentPlayer,
      winner,
      message: `Game over. Player ${winner} wins!`,
    });
  }

  if (checkDraw(gameState.board)) {
    return res.json({
      ...gameState,
      currentPlayer,
      winner: "draw",
      message: "Game over. It's a draw!",
    });
  }

  res.json(gameState);
  app.get("/api/state", (req, res) => {
    res.json(gameState);
  });
});

function getOpponentName(playerName) {
  return playerName === PLAYER_X ? PLAYER_O : PLAYER_X;
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
