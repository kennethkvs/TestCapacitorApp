"use client";

import { useEffect, useRef, useState } from "react";
import {
  load as loadCocoSSD,
  ObjectDetection,
} from "@tensorflow-models/coco-ssd";
import { load as loadMobilenet, MobileNet } from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs-backend-cpu";
import Webcam from "react-webcam";
import { renderPredictions } from "@/utils/render-predictions";

let interval: NodeJS.Timeout;

type ClassifiedObjects = {
  className: string;
  probability: number;
};

const LiveDetection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [classifiedObjects, setClassifiedObjects] = useState<
    ClassifiedObjects[]
  >([]);

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const showVideo = () => {
    if (webcamRef.current && webcamRef.current.video?.readyState === 4) {
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
    }
  };

  const runObjectDetection = async (
    model: ObjectDetection,
    mobilenet: MobileNet,
  ) => {
    if (
      canvasRef.current &&
      webcamRef.current &&
      webcamRef.current.video?.readyState === 4
    ) {
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;

      const detectObjects = await model.detect(
        webcamRef.current.video,
        10,
        0.8,
      );

      const classifyObjects = await mobilenet.classify(
        webcamRef.current.video,
        5,
      );
      setClassifiedObjects(classifyObjects);

      const context = canvasRef.current.getContext("2d");
      renderPredictions(detectObjects, context);
    }
  };

  const setupModel = async () => {
    setIsLoading(true);
    const model = await loadCocoSSD();
    const mobilenet = await loadMobilenet();
    setIsLoading(false);

    interval = setInterval(() => {
      runObjectDetection(model, mobilenet);
    }, 100);
  };

  useEffect(() => {
    showVideo();
    setupModel();

    return () => {
      clearInterval(interval);
    };
  }, []);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className="relative flex w-3/4 flex-col items-center">
      <Webcam
        ref={webcamRef}
        className="h-[720px] w-full rounded-lg border-2 border-gray-300"
        muted
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 z-99999 h-[720px] w-full"
      />
      <div className="mt-4 w-full rounded-lg bg-gray-100 p-4 text-black">
        <h2 className="mb-2 text-xl font-bold">Classified Objects:</h2>
        {classifiedObjects.length === 0 ? (
          <p>No objects classified.</p>
        ) : (
          <ul>
            {classifiedObjects.map((obj, index) => (
              <li key={index}>
                {obj.className} - {(obj.probability * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LiveDetection;
