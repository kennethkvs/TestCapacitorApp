"use client";

import { useEffect, useRef } from "react";
import {
  load as loadCocoSSD,
  ObjectDetection,
} from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import { renderPredictions } from "@/utils/render-predictions";

const LiveDetection = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  let interval: NodeJS.Timeout;

  const showVideo = () => {
    if (webcamRef.current && webcamRef.current.video?.readyState === 4) {
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
    }
  };

  const runObjectDetection = async (model: ObjectDetection) => {
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

      const context = canvasRef.current.getContext("2d");
      renderPredictions(detectObjects, context);
    }
  };

  const setupModel = async () => {
    const model = await loadCocoSSD();

    interval = setInterval(() => {
      runObjectDetection(model);
    }, 10);
  };

  useEffect(() => {
    showVideo();
    setupModel();

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex w-full flex-col items-center">
      <Webcam
        ref={webcamRef}
        className="h-[720px] w-3/4 rounded-lg border-2 border-gray-300"
        muted
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 z-99999 h-[720px] w-3/4"
      />
    </div>
  );
};

export default LiveDetection;
