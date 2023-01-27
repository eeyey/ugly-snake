import SnakeRect from "./SnakeRect.js";
import SnakeHead from "./SnakeHead.js";

export default class Snake {
  constructor(props = {}) {
    this.speed = props.speed ?? 3;

    this.color = props.color ?? "#4472e7";
    this.cell = props.cell;
    this.countX = props.countX;
    this.countY = props.countY;

    this.direction = props.direction ?? "left";
    this.startX = props.start ?? Math.floor(this.countX / 2) * this.cell;
    this.startY = props.start ?? Math.floor(this.countY / 2) * this.cell;

    this.rects = [];

    this.length = props.length;

    for (let i = 0; i < this.length; i++) {
      let speedX = 0;
      let speedY = 0;
      let x = this.startX;
      let y = this.startY;

      if (this.direction === "left" || this.direction === "right") {
        speedX = this.direction === "left" ? -this.speed : this.speed;
        x += this.direction === "left" ? this.cell * i : -this.cell * i;
      }
      if (this.direction === "up" || this.direction === "down") {
        speedY = this.direction === "up" ? -this.speed : this.speed;
        y += this.direction === "up" ? this.cell * i : -this.cell * i;
      }

      const Rect = i === 0 ? SnakeHead : SnakeRect;
      this.rects.push(
        new Rect({
          x,
          y,
          speedX,
          speedY,
          speed: this.speed,
          cell: this.cell,
          countX: this.countX,
          countY: this.countY,
          direction: this.direction,
          color: this.color,
        })
      );
    }
    this.rects[this.length - 1].isLast = true;
  }

  update(props = {}) {
    const head = this.rects[0];

    if (this.nextDirection && !this.updateMoment) {
      let update = null;

      const nextDirection = this.nextDirection;

      if (head.speedX < 0 && head.x % this.cell <= -head.speedX) {
        update = {
          x: head.x - (head.x % this.cell),
          y: head.y,
        };
      }
      if (head.speedX > 0 && this.cell - (head.x % this.cell) <= head.speedX) {
        update = {
          x: head.x + this.cell - (head.x % this.cell),
          y: head.y,
        };
      }
      if (head.speedY < 0 && head.y % this.cell <= -head.speedY) {
        update = {
          x: head.x,
          y: head.y - (head.y % this.cell),
        };
      }

      if (head.speedY > 0 && this.cell - (head.y % this.cell) <= head.speedY) {
        update = {
          x: head.x,
          y: head.y + this.cell - (head.y % this.cell),
        };
      }

      if (update) {
        this.rects.forEach((rect) =>
          rect.update({ ...update, direction: nextDirection })
        );
        this.direction = nextDirection;
        this.nextDirection = null;

        this.updateMoment = true;
      }
    } else {
      this.updateMoment = false;
    }

    this.rects.forEach((rect) => rect.update());
  }

  draw(context) {
    for (let i = this.rects.length - 1; i >= 0; i--) {
      this.rects[i].draw(context);
    }
  }

  add() {
    const tail = this.rects[this.rects.length - 1];
    let x = tail.x;
    let y = tail.y;

    if (tail.direction === "left") x += this.cell;
    if (tail.direction === "right") x -= this.cell;
    if (tail.direction === "up") y += this.cell;
    if (tail.direction === "down") y -= this.cell;

    const rect = new SnakeRect({ ...tail, x, y });
    Object.assign(rect.next, tail.next);

    this.rects.push(rect);

    tail.isLast = false;
  }
}
