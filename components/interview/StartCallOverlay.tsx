import { Button } from "@/components/ui/button";

interface StartCallOverlayProps {
  onStartCall: () => void;
}

export function StartCallOverlay({ onStartCall }: StartCallOverlayProps) {
  return (
    <div className="absolute inset-0 z-20 bg-white/100 dark:bg-gray-900/100 flex flex-col items-center justify-center rounded-lg">
      <p className="mb-4 text-lg font-medium text-gray-700 dark:text-gray-300">
        Start the AI call to unlock the question & editor
      </p>
      <Button onClick={onStartCall}>Start Call</Button>
    </div>
  );
}
