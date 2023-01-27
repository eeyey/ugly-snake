import Game from "./Game.js";

import "./index.css";

const game = new Game({
  countCellsX: 15,
  countCellsY: 15,
  cell: 40,
  snakeSpeed: 4,
});

document.addEventListener("keydown", (event) => {
  const arrowCallbacks = {
    ArrowUp: () => {
      if (game.snake.direction === "up" || game.snake.direction === "down") {
        return;
      }
      game.snake.nextDirection = "up";
    },
    ArrowDown: () => {
      if (game.snake.direction === "up" || game.snake.direction === "down") {
        return;
      }
      game.snake.nextDirection = "down";
    },
    ArrowLeft: () => {
      if (game.snake.direction === "left" || game.snake.direction === "right") {
        return;
      }
      game.snake.nextDirection = "left";
    },
    ArrowRight: () => {
      if (game.snake.direction === "left" || game.snake.direction === "right") {
        return;
      }
      game.snake.nextDirection = "right";
    },
  };
  if (event.key in arrowCallbacks) arrowCallbacks[event.key]();
});

document.body.append(game.canvas);
