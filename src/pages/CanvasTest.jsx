import React, { useState, useRef, useEffect } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

const CanvasTest = () => {
  const [buttonPositions, setButtonPositions] = useState([]);
  const [currentPoints, setCurrentPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);

  const handleImageClick = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    const point = { x: offsetX, y: offsetY };

    if (isDrawing) {
      setCurrentPoints((prev) => [...prev, point]);
    } else {
      buttonPositions.forEach((shape, index) => {
        if (isPointInShape(point, shape)) onShapeClick(index);
      });
    }
  };

  const isPointInShape = (point, shape) => {
    let inside = false;
    shape.forEach((p1, i) => {
      const p2 = shape[(i + 1) % shape.length];
      const intersect =
        p1.y > point.y !== p2.y > point.y &&
        point.x < ((p2.x - p1.x) * (point.y - p1.y)) / (p2.y - p1.y) + p1.x;
      if (intersect) inside = !inside;
    });
    return inside;
  };

  const handleCompleteShape = () => {
    if (currentPoints.length > 2) {
      setButtonPositions((prev) => [...prev, currentPoints]);
      setCurrentPoints([]);
      setIsDrawing(false);
    }
  };

  const drawShapes = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    [...buttonPositions, currentPoints].forEach((shape, idx) => {
      if (shape.length > 0) {
        ctx.beginPath();
        shape.forEach((point, i) => {
          i === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
        });
        ctx.closePath();
        ctx.fillStyle =
          idx === buttonPositions.length
            ? "rgba(239, 68, 68, 0.4)"
            : "rgba(34, 197, 94, 0.4)";
        ctx.strokeStyle =
          idx === buttonPositions.length
            ? "rgb(220, 38, 38)"
            : "rgb(22, 163, 74)";
        ctx.fill();
        ctx.stroke();
      }
    });
  };

  const handleUndo = () => setCurrentPoints((prev) => prev.slice(0, -1));

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    drawShapes();
  }, [buttonPositions, currentPoints]);

  const onShapeClick = (index) => alert(`Shape ${index} clicked!`);

  return (
    <div className="flex justify-center relative bg-white">
      <TransformWrapper smooth disablePadding>
        <TransformComponent>
          <div className="h-dvh w-screen flex items-center justify-center">
            <div className="w-full max-w-[600px] relative transition-transform">
              <img
                src="./detail.webp" // Make sure this path is correct
                alt="Map"
                className="w-full"
                onClick={handleImageClick}
                style={{
                  pointerEvents: "auto",
                }}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>

      <div className="absolute bottom-2 flex items-center gap-2">
        <button
          onClick={() => {
            if (currentPoints.length > 0) {
              handleCompleteShape();
            } else {
              setIsDrawing((prev) => !prev);
            }
          }}
          disabled={currentPoints.length < 3 && isDrawing}
          className="px-2 py-1 font-semibold bg-indigo-500 disabled:bg-indigo-400 text-white rounded"
        >
          {isDrawing ? "Complete" : "Add"}
        </button>

        <button
          onClick={handleUndo}
          disabled={currentPoints.length === 0}
          className="px-2 py-1 font-semibold bg-red-500 disabled:bg-red-400 text-white rounded"
        >
          Undo
        </button>
      </div>
    </div>
  );
};

export default CanvasTest;
