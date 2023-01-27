export default class SnakeRect {
  constructor(props = {}) {
    this.x = props.x ?? 0;
    this.y = props.y ?? 0;

    this.speed = props.speed ?? 0;
    this.speedX = props.speedX ?? 0;
    this.speedY = props.speedY ?? 0;

    this.direction = props.direction ?? "";

    this.cell = props.cell;
    this.padding = props.padding ?? 5;

    this.width = props.cell;
    this.height = props.cell;
    this.countX = props.countX;
    this.countY = props.countY;

    this.color = props.color;
    this.isLast = props.isLast ?? false;

    this.next = [];
  }

  draw(context) {
    const x = this.x;
    const y = this.y;

    const cell = this.cell;

    context.beginPath();
    context.rect(x, y, cell, cell);

    if (x > cell * (this.countX - 1)) {
      context.rect(0, y, cell - cell * this.countX + x, cell);
    }
    if (y > cell * (this.countY - 1)) {
      context.rect(x, 0, cell, cell - (cell * this.countX - y));
    }

    if (this.pDirection && !this.isLast) {
      if (this.direction === "left" && x % cell !== 0) {
        context.rect(x + cell, y, cell - (x % cell), cell);
      } else if (this.direction === "right" && x % cell !== 0) {
        context.rect(x - (x % cell), y, x % cell, cell);
      } else if (this.direction === "up" && y % cell !== 0) {
        context.rect(x, y + cell, cell, cell - (y % cell));
      } else if (this.direction === "down" && y % cell !== 0) {
        context.rect(x, y - (y % cell), cell, y % cell);
      }
    }

    context.fillStyle = this.color;
    context.fill();
  }

  update(props = {}) {
    const xS = this.speedX;
    const yS = this.speedY;

    const x = this.x;
    const y = this.y;

    const cell = this.cell;
    const next = this.next;

    if (props.direction) {
      this.next.push(props);
    } else {
      if ((xS < 0 && x % cell <= -xS) || (xS > 0 && cell - (x % cell) <= xS)) {
        if (
          next.length &&
          (x - (x % cell) === next[0].x || x + cell - (x % cell) === next[0].x)
        ) {
          this.pDirection = this.direction;
          this.direction = next[0].direction;

          const delta = xS < 0 ? -xS - (x % cell) : xS - (cell - (x % cell));

          this.x = xS < 0 ? x - (x % cell) : x + cell - (x % cell);
          this.y += next[0].direction === "up" ? -delta : delta;

          this.speedX = 0;
          this.speedY = next[0].direction === "up" ? -this.speed : this.speed;

          this.next.shift();
        } else {
          if (x % cell !== 0) this.pDirection = null;

          this.x += xS;
        }
      } else if (
        (yS < 0 && y % cell <= -yS) ||
        (yS > 0 && cell - (y % cell) <= yS)
      ) {
        if (
          next.length &&
          (y - (y % cell) === next[0].y || y + cell - (y % cell) === next[0].y)
        ) {
          this.pDirection = this.direction;
          this.direction = next[0].direction;

          const delta = yS < 0 ? -yS - (y % cell) : yS - (cell - (y % cell));

          this.y = yS < 0 ? y - (y % cell) : y + cell - (y % cell);
          this.x += next[0].direction === "left" ? -delta : delta;

          this.speedY = 0;
          this.speedX = next[0].direction === "left" ? -this.speed : this.speed;

          this.next.shift();
        } else {
          if (y % cell !== 0) this.pDirection = null;

          this.y += yS;
        }
      } else {
        this.x += xS;
        this.y += yS;
      }

      if (this.x <= 0) this.x = this.cell * this.countX + this.x;
      if (this.x >= this.cell * this.countX) {
        this.x = this.x - this.cell * this.countX;
      }
      if (this.y <= 0) this.y = this.cell * this.countY + this.y;
      if (this.y >= this.cell * this.countY) {
        this.y = this.y - this.cell * this.countY;
      }
    }
  }
}
