import SnakeRect from "./SnakeRect.js";

export default class SnakeHead extends SnakeRect {
  constructor(props = {}) {
    super(props);
  }

  draw(context) {
    super.draw(context);

    context.beginPath();
    if (this.direction === "left") {
      context.arc(this.x + 1, this.y + 5, 3, 0, 360);
      context.arc(this.x + 1, this.y + this.cell - 5, 3, 0, 360);
    } else if (this.direction === "right") {
      context.arc(this.x + this.cell - 1, this.y + 5, 3, 0, 360);
      context.arc(this.x + this.cell - 1, this.y + this.cell - 5, 3, 0, 360);
    } else if (this.direction === "up") {
      context.arc(this.x + 5, this.y + 1, 3, 0, 360);
      context.arc(this.x - 5 + this.cell, this.y + 1, 3, 0, 360);
    } else {
      context.arc(this.x + 5, this.y + this.cell - 1, 3, 0, 360);
      context.arc(this.x + this.cell - 5, this.y + this.cell - 1, 3, 0, 360);
    }
    context.fillStyle = "#fff";
    context.fill();
  }
}
