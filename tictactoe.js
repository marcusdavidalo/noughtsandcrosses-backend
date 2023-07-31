const PLAYER_X = "X";
const PLAYER_O = "O";
const EMPTY_CELL = "";

function createBoard() {
  return Array(3)
    .fill(null)
    .map(() => Array(3).fill(""));
}

function checkWin(board, player) {
  // Check rows
  for (let row = 0; row < 3; row++) {
    if (
      board[row][0] === player &&
      board[row][1] === player &&
      board[row][2] === player
    ) {
      return true;
    }
  }

  // Check columns
  for (let col = 0; col < 3; col++) {
    if (
      board[0][col] === player &&
      board[1][col] === player &&
      board[2][col] === player
    ) {
      return true;
    }
  }

  // Check diagonals
  if (
    board[0][0] === player &&
    board[1][1] === player &&
    board[2][2] === player
  ) {
    return true;
  }

  if (
    board[0][2] === player &&
    board[1][1] === player &&
    board[2][0] === player
  ) {
    return true;
  }

  return false;
}

function checkDraw(board) {
  // If there are any empty cells, the game is not a draw.
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === EMPTY_CELL) {
        return false;
      }
    }
  }
  // All cells are filled and there is no winner, so it's a draw.
  return true;
}

const makeMove = (board, player, row, col) => {
  if (board[row][col] === EMPTY_CELL) {
    board[row][col] = player;
  }
  return board;
};

module.exports = {
  PLAYER_X,
  PLAYER_O,
  EMPTY_CELL,
  createBoard,
  checkWin,
  checkDraw,
  makeMove,
};
