import { useRef, useState, useEffect } from "react";
import { FaUndoAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { TiInfoLarge } from "react-icons/ti";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

function App() {
  const [isModal, setisModal] = useState(false);
  const [isPopup, setisPopup] = useState(false);
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
    if (isModal) {
      const canvas = canvasRef.current;
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      drawShapes();
    }
  }, [buttonPositions, currentPoints]);

  const onShapeClick = (index) => setisPopup(!isPopup);

  return (
    <>
      <TransformWrapper>
        <TransformComponent smooth disablePadding>
          <div className="h-dvh w-screen flex justify-center items-center cursor-grab">
            <div className="w-full max-w-[600px] relative transition-transform">
              <img
                src="/map.webp"
                alt="Map"
                className="size-full object-contain"
              />

              <button
                onClick={() => setisModal(!isModal)}
                className="size-3 absolute flex justify-center items-center rounded-full border border-white bg-red-500 text-white"
                style={{
                  top: "46.272%",
                  left: "54.5%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <TiInfoLarge className="size-3" />
              </button>
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>

      {isModal && (
        <div className="fixed top-0 left-0 flex justify-center bg-white">
          <button
            className="size-12 absolute right-0 top-0 z-50 flex justify-center items-center bg-red-400 text-white"
            onClick={() => setisModal(!isModal)}
          >
            <IoMdClose className="size-8" />
          </button>

          <TransformWrapper smooth disablePadding>
            <TransformComponent>
              <div className="h-dvh w-screen flex items-center justify-center">
                <div className="w-full max-w-[800px] relative transition-transform">
                  <img
                    src="./detail.webp"
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
              className="h-8 px-2 font-semibold bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white rounded"
            >
              {isDrawing ? "Complete" : "Add"}
            </button>

            {isDrawing && (
              <button
                onClick={() => {
                  setIsDrawing((prev) => !prev);
                  setCurrentPoints([]);
                }}
                className="h-8 px-2 font-semibold bg-gray-500 hover:bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
            )}

            <button
              onClick={handleUndo}
              disabled={currentPoints.length === 0}
              className="size-8 px-2 font-semibold bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white rounded"
            >
              <FaUndoAlt />
            </button>
          </div>

          {isPopup && (
            <div className="w-80 absolute bottom-0 left-0  bg-white">
              <div className="flex items-center justify-between">
                <h1 className="ps-4 text-lg font-semibold">Information</h1>
                <button
                  className="size-10 flex justify-center items-center bg-red-400 text-white"
                  onClick={() => setisPopup(!isPopup)}
                >
                  <IoMdClose className="size-8" />
                </button>
              </div>

              <div className="p-4 space-y-2">
                <div>
                  <h1 className="text-lg font-semibold">
                    Information about place
                  </h1>
                  <p className="">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ex
                    quisquam magnam quas delectus. Ratione sunt, eveniet esse
                    molestias earum commodi.
                  </p>
                </div>
                <div className="space-y-4">
                  <h1 className="text-lg font-semibold">QR Code:</h1>
                  <div className="h-32">
                    <img
                      src="./qrcode.png"
                      alt="QR"
                      className="size-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
