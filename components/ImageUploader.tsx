
import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { CameraIcon } from './icons/CameraIcon';

interface ImageUploaderProps {
  onImageUpload: (imageDataUrl: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = useCallback(async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setIsCameraOpen(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("Could not access the camera. Please ensure you have given permission.");
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  }, []);

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        const video = videoRef.current;
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        onImageUpload(dataUrl);
        stopCamera();
      }
    }
  }, [onImageUpload, stopCamera]);

  if (isCameraOpen) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
        <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg mb-4" />
        <div className="flex justify-center space-x-4">
          <button onClick={handleCapture} className="px-6 py-2 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors">Capture</button>
          <button onClick={stopCamera} className="px-6 py-2 bg-slate-500 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-300">Upload Image</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <label className="flex-1 cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <UploadIcon className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-2" />
          <span className="text-slate-600 dark:text-slate-400">Click to upload file</span>
          <span className="text-xs text-slate-500 dark:text-slate-500">PNG, JPG, WEBP</span>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
        <button onClick={startCamera} className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <CameraIcon className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-2" />
          <span className="text-slate-600 dark:text-slate-400">Use Camera</span>
          <span className="text-xs text-slate-500 dark:text-slate-500">Capture a photo</span>
        </button>
      </div>
    </div>
  );
};
