import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { TiInfoLarge } from "react-icons/ti";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

function App() {
  const [isModal, setisModal] = useState(false);
  const [isPopup, setisPopup] = useState(false);
  const [buttonPositions, setButtonPositions] = useState([]);

  const handleImageClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setButtonPositions((prev) => [...prev, { x, y }]);
  };

  return (
    <>
      <div className="h-dvh w-full bg-neutral-800">
        <div className="h-full flex justify-center items-center">
          <TransformWrapper>
            <TransformComponent>
              <div className="relative max-w-96 bg-orange-100">
                <img
                  src="/map.png"
                  alt="Map"
                  className="size-full object-contain"
                />

                <button
                  onClick={() => setisModal(!isModal)}
                  className="size-4 absolute top-40 right-40 rounded-full border-2 border-white bg-blue-500"
                ></button>
              </div>
            </TransformComponent>
          </TransformWrapper>
        </div>
      </div>

      {isModal && (
        <div className="h-dvh w-full fixed top-0 left-0 bg-white">
          <button
            className="size-12 absolute right-0 top-0 flex justify-center items-center bg-red-400 text-white"
            onClick={() => setisModal(!isModal)}
          >
            <IoMdClose className="size-8" />
          </button>

          <div className="h-full flex items-center justify-center">
            <TransformWrapper smooth disablePadding>
              <TransformComponent>
                <div className="w-full max-w-[700px] relative transition-transform">
                  <img
                    src="/detail.png"
                    alt="Map"
                    className="w-full bg-orange-200"
                    onClick={handleImageClick}
                    style={{
                      pointerEvents: "auto",
                    }}
                  />

                  {buttonPositions.map((pos, index) => (
                    <div
                      key={index}
                      className="absolute size-4 bg-white/40"
                      style={{
                        top: `${pos.y}%`,
                        left: `${pos.x}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    ></div>
                  ))}
                </div>
              </TransformComponent>
            </TransformWrapper>
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
