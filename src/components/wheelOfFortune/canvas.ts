import lists from "./sample";

type TWheelOfNames = {
  ctx: CanvasRenderingContext2D;
  size: number;
  name: string;
};

const PI = Math.PI;
const TAU = 2 * PI;
const angVelMin = 0.002; // Below that number will be treated as a stop
const friction = 0.99; // 0.995=soft, 0.99=mid, 0.98=hard

let config: any = {
  isNameSpin: false,
  isNumberSpin: false,
  angVelMax: 0,
  angVel: 0,
  ang: 0,
  isAccelerating: false,
  animFrame: null,
};

const rand = (m: number, M: number) => Math.random() * (M - m) + m;

export class Wheel {
  ctx: CanvasRenderingContext2D;
  name: string;

  constructor({ ctx, name }: TWheelOfNames) {
    this.ctx = ctx;
    this.name = name;
  }

  drawSector(
    ctx: CanvasRenderingContext2D,
    sector: any,
    i: number,
    sectorWidth: number,
    sectorLength: number
  ) {
    if (!ctx) return;

    const arc = TAU / sectorLength;
    const w = ctx.canvas.width;
    const rad = w / 2;

    const ang = arc * i;
    ctx.save();

    // COLOR
    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, sectorWidth, ang, ang + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();

    // TEXT
    ctx.translate(rad, rad);
    ctx.rotate(ang + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText(sector.label, sectorWidth, 10);

    //
    ctx.restore();
  }

  getIndex(listsLength: number) {
    return (
      Math.floor(listsLength - (config.ang / TAU) * listsLength) % listsLength
    );
  }

  rotate(list: any, listName: "numbers" | "sectors") {
    if (!this.ctx) return;

    const { ang } = config;

    const sector = list[this.getIndex(list.length)];

    const nameVal = document.querySelector<HTMLSpanElement>("#nameVal");
    const numVal = document.querySelector<HTMLSpanElement>("#numberVal");

    this.ctx!.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
    if (listName === "sectors") {
      nameVal!.textContent = sector.label;
      nameVal!.style.background = sector.color;
    }

    if (listName === "numbers") {
      numVal!.textContent = sector.label;
      numVal!.style.background = sector.color;
    }
  }

  frame(isSpinning: string, listName: "numbers" | "sectors") {
    if (!config[isSpinning]) return;

    let { angVel, angVelMax, isAccelerating, animFrame } = config;

    if (angVel >= angVelMax) config.isAccelerating = false;

    // Accelerate
    if (isAccelerating) {
      config.angVel ||= angVelMin; // Initial velocity kick
      config.angVel *= 1.2; // Accelerate
    }

    // Decelerate
    else {
      config.isAccelerating = false;
      config.angVel *= friction; // Decelerate by friction

      // SPIN END:
      if (angVel < angVelMin) {
        config[isSpinning] = false;
        config.angVel = 0;
        cancelAnimationFrame(animFrame);
      }
    }

    config.ang += angVel; // Update angle
    config.ang %= TAU; // Normalize angle
    this.rotate(lists[listName], listName); // CSS rotate!
  }

  engine(isSpinKey: string, listName: "numbers" | "sectors") {
    config.animFrame = requestAnimationFrame(() =>
      this.engine(isSpinKey, listName)
    );
    return this.frame(isSpinKey, listName);
  }

  handleSpin(isSpinKey: string, listName: "numbers" | "sectors") {
    if (config[isSpinKey]) return;

    config[isSpinKey] = true;
    config.isAccelerating = true;
    config.angVelMax = rand(0.25, 1.8);
    this.engine(isSpinKey, listName); // Start engine!
  }
}

export class WheelOfNames extends Wheel {
  ctx: CanvasRenderingContext2D;

  constructor(props: TWheelOfNames) {
    super(props);
    this.ctx = props.ctx;
  }

  draw() {
    lists.sectors.forEach((v, i) => {
      this.drawSector(
        this.ctx,
        v,
        i,
        this.ctx.canvas.width / 2,
        lists.sectors.length
      );
    });
  }

  spin() {
    this.handleSpin("isNameSpin", "sectors");
  }
}
export class WheelOfNumbers extends Wheel {
  ctx: CanvasRenderingContext2D;

  constructor(props: TWheelOfNames) {
    super(props);
    this.ctx = props.ctx;
  }

  draw() {
    lists.numbers.forEach((v, i) => {
      this.drawSector(
        this.ctx,
        v,
        i,
        this.ctx.canvas.width / 2,
        lists.numbers.length
      );
    });
  }

  spin() {
    this.handleSpin("isNumbersSpin", "numbers");
  }
}

export {};
