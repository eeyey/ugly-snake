export default class Aplle {
  constructor(props = {}) {
    this.cell = props.cell ?? 25;
    this.offset = 4;

    this.radius = this.cell / 2 - this.offset * 2;
    this.width = this.cell - this.offset * 2;
    this.height = this.cell - this.offset * 2;

    this.x = props.x + this.offset ?? this.offset;
    this.y = props.y + this.offset ?? this.offset;
  }

  draw(context) {
    context.beginPath();
    context.arc(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.radius,
      0,
      360
    );
    context.fillStyle = "red";
    context.fill();
  }
}
