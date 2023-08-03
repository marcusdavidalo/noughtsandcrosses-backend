# Noughts and Crosses Backend

This is the backend for a simple Tic-Tac-Toe game that I built. It uses NodeJS and Express to create a REST API for managing the game state.

## Table of Contents

- Project Structure
- Installation Instructions
- Execution Instructions
- Compromises and Future Improvements
- Error Handling
- Code Formatting and Comments
- Simplicity

## Project Structure

The backend code is located in the noughtsandcrosses-backend repository. It consists of two main files: `server.js` and `tictactoe.js`.

The `server.js` file sets up the Express server and defines the API endpoints for making moves and resetting the game. It also uses Socket.IO to enable real-time updates of the game state.

The `tictactoe.js` file contains the game logic, including functions for creating the game board, checking for a win or draw, and making moves.

## Installation Instructions

1. Clone the backend repository by running `git clone https://github.com/marcusdavidalo/noughtsandcrosses-backend.git` in your terminal.
2. Navigate to the cloned repository by running `cd noughtsandcrosses-backend`.
3. Install all the necessary dependencies by running `npm install`.

## Execution Instructions

1. Start the backend server by running `npm start` in the `noughtsandcrosses-backend` directory.
2. The server should now be running on port 8000.

## Compromises and Future Improvements

In building this project, I made some compromises in order to meet the requirements within the given time frame. For example, one issue that I encountered was that the game does not update in real-time, and I am still working on finding a solution to this problem.

In future iterations of this project, I would like to continue improving its functionality and user experience. Some potential improvements could include adding additional features such as player accounts, leaderboards, or multiplayer functionality.

## Error Handling

There may be some error cases that are currently unhandled in this project. These could potentially impact its functionality. For example, if there are issues with the connection to the frontend server, this could cause problems with updating the game state.

In future iterations, it would be beneficial to add more robust error handling to ensure that any potential issues are handled gracefully.

## Code Formatting and Comments

The code is well-formatted and commented to provide clarity on its functionality. It follows standard coding conventions for NodeJS.

## Simplicity

The focus of this project was on simplicity, both in terms of its design and implementation. The game mechanics are straightforward and easy to understand.
