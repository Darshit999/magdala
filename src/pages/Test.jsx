import React, { useState } from "react";

const Test = () => {
  const [buttonPositions, setButtonPositions] = useState([]);
  const [currentPoints, setCurrentPoints] = useState([]);

  const handleImageClick = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;

    setCurrentPoints((prev) => [...prev, { x: offsetX, y: offsetY }]);
  };

  const handleCompleteShape = () => {
    if (currentPoints.length > 2) {
      setButtonPositions((prev) => [...prev, currentPoints]);
      setCurrentPoints([]);
    }
  };

  const handleShapeClick = (index) => {
    alert(`Shape ${index + 1} was clicked!`);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="h-full flex items-center justify-center">
        <div className="w-full max-w-[600px] relative transition-transform">
          <img
            src="./detail.webp"
            alt="Map"
            className="w-full"
            onClick={handleImageClick}
          />

          <svg className="w-full h-full absolute top-0 left-0 pointer-events-none">
            {buttonPositions.map((shape, index) => (
              <polygon
                key={index}
                points={shape.map((point) => `${point.x},${point.y}`).join(" ")}
                onClick={() => handleShapeClick(index)}
                className="cursor-pointer pointer-events-auto stroke-2 fill-green-600/40 stroke-green-800"
              />
            ))}

            {currentPoints.length > 0 && (
              <polygon
                points={currentPoints
                  .map((point) => `${point.x},${point.y}`)
                  .join(" ")}
                className="stroke-2 fill-red-600/40 stroke-red-800"
              />
            )}
          </svg>
        </div>
      </div>

      <button
        onClick={handleCompleteShape}
        disabled={currentPoints.length < 3}
        className="px-2 py-1 font-semibold bg-indigo-500 disabled:bg-indigo-400 text-white rounded"
      >
        Add
      </button>
    </div>
  );
};

export default Test;
