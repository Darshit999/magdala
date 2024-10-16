import React, { useState } from "react";

const Test = () => {
  const [buttons, setButtons] = useState([]); // Array to hold completed shapes
  const [currentPoints, setCurrentPoints] = useState([]); // Points for the current shape

  const handleImageClick = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;

    // Add the point to the current shape
    setCurrentPoints((prev) => [...prev, { x: offsetX, y: offsetY }]);
  };

  const handleCompleteShape = () => {
    if (currentPoints.length > 2) {
      // Only save if there's a valid shape
      setButtons((prev) => [...prev, currentPoints]);
      setCurrentPoints([]); // Reset current points for a new shape
    }
  };

  const handleShapeClick = (index) => {
    alert(`Shape ${index + 1} was clicked!`);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <div className="relative w-full max-w-[700px] transition-transform">
        <img
          src="./detail.png"
          alt="Map"
          className="w-full bg-orange-200"
          onClick={handleImageClick}
        />

        {/* Render SVG shapes as clickable areas */}
        <svg className="w-full h-full absolute top-0 left-0 pointer-events-none">
          {buttons.map((shape, index) => (
            <polygon
              key={index}
              points={shape.map((point) => `${point.x},${point.y}`).join(" ")}
              fill="rgba(47, 250, 2, 0.3)" // Set a fill color for the clickable button
              stroke="green"
              strokeWidth="2"
              style={{ cursor: "pointer", pointerEvents: "auto" }} // Enable clicking on shapes
              onClick={() => handleShapeClick(index)} // Alert on shape click
            />
          ))}

          {/* Render the shape currently being created */}
          {currentPoints.length > 0 && (
            <polygon
              points={currentPoints
                .map((point) => `${point.x},${point.y}`)
                .join(" ")}
              fill="rgba(250, 2, 2, 0.3)" // Current shape color
              stroke="red"
              strokeWidth="2"
            />
          )}
        </svg>
      </div>

      <button
        onClick={handleCompleteShape}
        className="px-2 py-1 font-semibold bg-indigo-500 text-white rounded"
      >
        Add
      </button>
    </div>
  );
};

export default Test;
