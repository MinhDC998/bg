import React, { useRef, useEffect, useCallback } from "react";

const config = {
  totalXLine: 60,
  lineDrawn: 0,
  wWidth: window.innerWidth,
  wHeight: window.innerHeight,
  steps: 125,
  colors: {
    draw: "white",
    base: "black",
  },
  speed: {
    draw: 1,
    reDraw: 0.5,
    repeat: 500,
    awaitToDraw: 200,
  },
  lineWidth: 2,
  get stepLength() {
    return this.wWidth / this.totalXLine;
  },
};

type TCoordinates = {
  moveTo: { x: number; y: number };
  lineTo: { x: number; y: number };
  isLineToHorizontal: boolean;
};

const CanvasComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    wWidth,
    wHeight,
    stepLength,
    steps,
    totalXLine,
    colors,
    speed,
    lineWidth,
  } = config;

  const intervalRef = useRef<any>();

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      drawBGLines();
    }
  }, []);

  const drawBGLines = () => {
    const canvas = canvasRef.current;

    const context = canvas!.getContext("2d")!;

    context.strokeStyle = "black";

    context.beginPath();

    for (let i = 1; i < totalXLine; i++) {
      context.moveTo(i * stepLength, 0);
      context.lineTo(i * stepLength, wHeight);

      context.moveTo(0, i * stepLength);
      context.lineTo(wWidth, i * stepLength);
    }

    context.stroke();
  };

  const animateDraw = (
    coordinates: TCoordinates,
    lineDrawn: number,
    color: string,
    drawSpeed = 2
  ) => {
    if (!canvasRef.current) return;

    const { isLineToHorizontal, lineTo, moveTo } = coordinates;

    const context = canvasRef.current.getContext("2d")!;

    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;

    context.moveTo(moveTo.x, moveTo.y);
    context.lineTo(
      isLineToHorizontal ? lineDrawn : lineTo.x,
      !isLineToHorizontal ? lineDrawn : lineTo.y
    );

    context.stroke();

    const endLine = isLineToHorizontal ? lineTo.x : lineTo.y;

    if (lineDrawn < endLine) {
      lineDrawn += drawSpeed;

      requestAnimationFrame(() =>
        animateDraw(coordinates, lineDrawn, color, drawSpeed)
      );
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(onDrawLine, speed.repeat);

    return () => clearInterval(intervalRef.current);
  }, []);

  const onDrawLine = useCallback(async () => {
    const listCoordinates = getRandomCoordinates();

    let i = 0;

    while (i < listCoordinates.length) {
      const v = listCoordinates[i];

      const lineDraw = v.isLineToHorizontal ? v.moveTo.x : v.moveTo.y;

      await new Promise((r) => setTimeout(r, speed.awaitToDraw));

      animateDraw(v, lineDraw, colors.draw, speed.draw);

      setTimeout(
        () => animateDraw(v, lineDraw, colors.base, speed.reDraw),
        1000
      );

      i++;
    }
  }, []);

  const getRandomCoordinates = useCallback(() => {
    if (!canvasRef.current) return [];

    const isLineStartAtVertical = Math.random() < 0.5;
    const startAt = Math.floor(Math.random() * totalXLine) * stepLength;

    const listCoordinates: TCoordinates[] = [
      {
        moveTo: {
          x: isLineStartAtVertical ? 0 : startAt,
          y: !isLineStartAtVertical ? 0 : startAt,
        },
        lineTo: {
          x: isLineStartAtVertical ? 0 : startAt + stepLength,
          y: !isLineStartAtVertical ? 0 : startAt + stepLength,
        },
        isLineToHorizontal: isLineStartAtVertical,
      },
    ];

    const getDes = (
      pos: "x" | "y",
      lastDes: TCoordinates["lineTo"],
      isLineToHorizontal: boolean
    ) => {
      const isPlus = Math.random() < 0.5;

      return isLineToHorizontal
        ? isPlus
          ? lastDes[pos] + stepLength
          : lastDes[pos] - stepLength
        : lastDes[pos];
    };

    while (listCoordinates.length <= steps) {
      const isLineToHorizontal = Math.random() < 0.5;

      const lastCoordinates =
        listCoordinates[listCoordinates.length - 1].lineTo;

      listCoordinates.push({
        moveTo: {
          x: lastCoordinates.x,
          y: lastCoordinates.y,
        },
        lineTo: {
          x: getDes("x", lastCoordinates, isLineToHorizontal),
          y: getDes("y", lastCoordinates, !isLineToHorizontal),
        },
        isLineToHorizontal,
      });
    }

    return listCoordinates;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
};

export default CanvasComponent;
