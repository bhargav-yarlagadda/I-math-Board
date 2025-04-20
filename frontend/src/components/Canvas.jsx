import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Loader from "./Loader";

const Canvas = ({
  brushColor,
  brushStroke,
  result,
  setResult,
  dictOfVars,
  reset,
  setReset,
  isEraser,
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [loading,setLoading]=useState(false)

  const sendData = async () => {
    const canvas = canvasRef.current;
    setLoading(true)
    if (canvas) {
      try {
        // Ensure dictOfVars is defined and is an object
        if (!dictOfVars || typeof dictOfVars !== "object") {
          console.error("Invalid dictionary of variables.");
          return;
        }
  
        // Convert canvas to base64 image string
        const base64Image = canvas.toDataURL("image/png");
  
        // Send the image data and dictionary of variables to the backend
        const response = await axios({
          method: "POST",
          url: `${import.meta.env.VITE_API_URL}/calculate`,  // Ensure this is the correct API endpoint
          data: {
            image: base64Image,  // Send the image data as base64
            dict_of_vars: dictOfVars,  // Send the dictionary of variables
          },
        });
  
        // Destructure response data
        const { message, data, status } = response.data;
  
        // Log the full response data for debugging
        console.log("Response data:", response.data);
  
        // Handle the response based on status
        if (status === "success" && Array.isArray(data) && data.length > 0) {
          setResult(data[0]);  // Set the first item of data to the result
        } else if (status === "failure") {
          setResult(null); // Set the result to null or show an error
          console.error("Error: No valid data received.", message);
        }
  
      } catch (error) {
        // Log any error that occurred during the request
        console.error("Error sending image data:", error);
      }
    } else {
      console.error("Canvas reference is not available.");
    }


    setLoading(false)
  };
  
  

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      context.fillStyle = "black"; // Background color
      context.fillRect(0, 0, canvas.width, canvas.height);
      setResult(null);
    }
  };

  useEffect(() => {
    if (reset) {
      resetCanvas();
    setLoading(false)

      setReset(false);
    }
  }, [reset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        context.fillStyle = "black"; // Background color
        context.fillRect(0, 0, canvas.width, canvas.height); // Fill canvas
      }
    }
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setLastX(e.nativeEvent.offsetX);
      setLastY(e.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) {
      return;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      context.strokeStyle = isEraser ? "black" : brushColor; // Set to black for erasing
      context.lineWidth = isEraser ? brushStroke * 2 : brushStroke; // Increase size for erasing
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      context.stroke();
      setLastX(e.nativeEvent.offsetX);
      setLastY(e.nativeEvent.offsetY);
    }
  };

  const clearResponse = () => {
    setResult(null); // Clear the generated result
  };

  return (
    <div className="w-full h-full">

      {
        loading && (<Loader/>)
      }
      <button
        className="text-white text-[14px] bg-blue-900 h-[50px] hover:bg-opacity-80 bg-opacity-70 absolute rounded-md p-2 bottom-[5%] left-0 sm:left-10 z-20"
        onClick={sendData}
      >
        Generate Response
      </button>
      <button
        className="text-white right-0 text-[14px] bg-red-600 h-[50px] hover:bg-opacity-80 bg-opacity-70 absolute rounded-md p-2 bottom-[5%] sm:right-10 z-20"
        onClick={clearResponse}
      >
        Clear Response
      </button>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseOut={stopDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        className="w-full h-full absolute top-0 left-0"
      ></canvas>

      {/* Render the generated result */}
      {result && (
        <div
          style={{ scrollbarWidth: "none" }}
          className="absolute font-thin italic top-[30vh] bottom-[20%] left-[5%] md:bottom-[30%] md:left-[3%] w-[200px] md:w-[300px] text-[14px] max-h-[400px] overflow-y-scroll text-white z-20"
        >
          <h2>
            Expression: <br /> {result.expr}
          </h2>
          <h2>
            Result: <br /> {result.result}
          </h2>
        </div>
      )}
    </div>
  );
};

export default Canvas;
