import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message: string;
  isVisible: boolean;
}

export function LoadingOverlay({ message, isVisible }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl max-w-md w-full mx-4 text-center space-y-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex justify-center"
        >
          <Loader2 className="h-12 w-12 text-indigo-500" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-medium text-gray-700 dark:text-gray-300"
        >
          {message}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          Please wait while we process your request...
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
