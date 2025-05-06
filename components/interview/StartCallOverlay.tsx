import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface StartCallOverlayProps {
  onStartCall: () => void;
  isLoading?: boolean;
}

export function StartCallOverlay({ onStartCall, isLoading = false }: StartCallOverlayProps) {
  return (
    <div className="absolute inset-0 z-20 bg-white/100 dark:bg-gray-900/100 flex flex-col items-center justify-center rounded-lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg font-medium text-gray-700 dark:text-gray-300"
        >
          {isLoading
            ? "Connecting to AI Interviewer..."
            : "Start the AI call to unlock the question & editor"}
        </motion.p>
        <Button onClick={onStartCall} disabled={isLoading} className="relative min-w-[120px]">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            "Start Call"
          )}
        </Button>
      </motion.div>
    </div>
  );
}
