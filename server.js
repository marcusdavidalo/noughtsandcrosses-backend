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

let board = createBoard();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  io.emit("boardUpdate", { board, currentPlayer: PLAYER_X });

  socket.on("disconnect", () => {
    console.log("A user disconnected.");
  });

  socket.on("boardUpdate", ({ board: updatedBoard, currentPlayer, winner }) => {
    board = updatedBoard;
    socket.broadcast.emit("boardUpdate", {
      board: updatedBoard,
      currentPlayer,
      winner,
    });
  });
});

app.post("/api/reset", (req, res) => {
  board = createBoard();
  io.emit("boardUpdate", { board, currentPlayer: PLAYER_X });
  res.json({ message: "Game reset." });
});

app.post("/api/move", (req, res) => {
  const { row, col } = req.body;

  if (
    row === undefined ||
    col === undefined ||
    board[row] === undefined ||
    board[row][col] !== EMPTY_CELL
  ) {
    return res.status(400).json({ error: "Invalid move." });
  }

  const currentPlayer =
    board.flat().filter((cell) => cell === PLAYER_X).length ===
    board.flat().filter((cell) => cell === PLAYER_O).length
      ? PLAYER_X
      : PLAYER_O;

  // Always emit a board update to all connected clients
  board = makeMove(board, currentPlayer, row, col);
  console.log("Emitting board update:", board);
  io.emit("boardUpdate", {
    board,
    currentPlayer: getOpponentName(currentPlayer),
  });

  const winner = checkWin(board, currentPlayer);
  if (winner) {
    return res.json({
      board,
      currentPlayer,
      winner,
      message: `Game over. Player ${winner} wins!`,
    });
  }

  if (checkDraw(board)) {
    return res.json({
      board,
      currentPlayer,
      winner: "draw",
      message: "Game over. It's a draw!",
    });
  }

  res.json({ board, currentPlayer });
});

function getOpponentName(playerName) {
  return playerName === PLAYER_X ? PLAYER_O : PLAYER_X;
}

const PORT = process.env.PORT || 8000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
