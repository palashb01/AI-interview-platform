import { RefObject } from "react";

interface CameraCardProps {
  videoRef: RefObject<HTMLVideoElement | null>;
}

export function CameraCard({ videoRef }: CameraCardProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2">
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-md border border-gray-300 dark:border-gray-600"
        autoPlay
        muted
        playsInline
      />
    </div>
  );
}
