import Snake from "./Snake.js";
import Apple from "./Apple.js";

import { haveCollision, haveCollisionMany, randomInt } from "./utils.js";

export default class Game {
  constructor(props = {}) {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.canvas.id = props.canvId ?? "snake-game";

    this.cell = props.cell ?? 25;

    this.countCellsX = props.countCellsX ?? 10;
    this.countCellsY = props.countCellsY ?? 10;

    this.canvas.width = props.cell * this.countCellsX;
    this.canvas.height = props.cell * this.countCellsY;

    this.pTimestamp = 0;
    this.playing = true;

    this.snakeSpeed = props.snakeSpeed ?? 3;
    this.score = props.score ?? 3;

    this.snake = new Snake({
      cell: this.cell,
      countX: this.countCellsX,
      countY: this.countCellsY,
      length: this.score,
      speed: this.speed,
    });

    this.apple = new Apple({
      cell: this.cell,
      x: (Math.floor(this.countCellsX / 2) - 4) * this.cell,
      y: Math.floor(this.countCellsY / 2) * this.cell,
    });

    requestAnimationFrame((x) => this.render(x));
  }

  clear() {
    const width = this.canvas.width;

    this.canvas.width = width;
  }

  drawBackground() {
    for (let i = 0; i < this.countCellsX; i++) {
      for (let j = 0; j < this.countCellsY; j++) {
        this.context.beginPath();
        this.context.rect(i * this.cell, j * this.cell, this.cell, this.cell);
        if ((i + j) % 2 === 0) {
          this.context.fillStyle = "#aad751";
        } else {
          this.context.fillStyle = "#a2d149";
        }
        this.context.fill();
      }
    }
  }

  update() {
    this.snake.update();

    const head = this.snake.rects[0];
    const colisionRect = this.snake.rects
      .slice(2)
      .filter((rect) => haveCollision(rect, head));

    if (colisionRect.length) this.playing = false;

    if (haveCollision(head, this.apple)) {
      this.score++;

      this.snake.add();

      let x = randomInt(0, this.countCellsX - 1) * this.cell;
      let y = randomInt(0, this.countCellsY - 1) * this.cell;

      while (haveCollisionMany({ ...this.apple, x, y }, this.snake.rects)) {
        x = randomInt(0, this.countCellsX - 1) * this.cell;
        y = randomInt(0, this.countCellsY - 1) * this.cell;
      }

      this.apple = new Apple({
        cell: this.cell,
        x,
        y,
      });
    }
  }

  render(timestamp) {
    if (this.playing) requestAnimationFrame((x) => this.render(x));

    this.clear();
    this.drawBackground();

    this.update();

    this.apple.draw(this.context);
    this.snake.draw(this.context);

    this.pTimestamp = timestamp;
  }
}
