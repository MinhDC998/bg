import { memo, useRef, useEffect, useState, useMemo } from "react";

import { WheelOfNames, WheelOfNumbers } from "./canvas";

import "./styles.css";

export default memo(() => {
  const ref = useRef<HTMLCanvasElement>(null);
  const refNumbers = useRef<HTMLCanvasElement>(null);

  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [contextN, setContextN] = useState<CanvasRenderingContext2D | null>(
    null
  );

  const wheelOfNames = useMemo(() => {
    return new WheelOfNames({ ctx: context!, size: 300, name: "WheelOfNames" });
  }, [context]);

  const wheelOfNumbers = useMemo(() => {
    return new WheelOfNumbers({
      ctx: contextN!,
      size: 300,
      name: "WheelOfNumbers",
    });
  }, [contextN]);

  useEffect(() => {
    setContext(ref.current?.getContext("2d") || null);
    setContextN(refNumbers.current?.getContext("2d") || null);
  }, []);

  useEffect(() => {
    if (context) {
      wheelOfNumbers?.draw();
      wheelOfNames?.draw();
    }
  }, [context]);

  const handleSpin = () => {
    wheelOfNumbers.spin();
    wheelOfNames.spin();
  };

  return (
    <>
      <div id="wrapper">
        <div>
          <canvas ref={ref} width={300} height={300} style={{ zIndex: -1 }} />;
          <span id="nameVal" className="result" />
        </div>
        <div>
          <canvas
            ref={refNumbers}
            width={300}
            height={300}
            style={{ zIndex: -1 }}
          />

          <span id="numberVal" className="result" />
        </div>
      </div>

      <button onClick={handleSpin}>🤡</button>
    </>
  );
});
