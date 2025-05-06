import MonacoEditor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface CodeEditorCardProps {
  loading: boolean;
  error: string | null;
  question: { boilercode: string } | null;
  editorContent: string;
  onEditorChange: (value: string | undefined) => void;
  onSubmit: () => void;
  theme: string;
}

export function CodeEditorCard({
  loading,
  error,
  question,
  editorContent,
  onEditorChange,
  onSubmit,
  theme,
}: CodeEditorCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      // Add a small delay to ensure the loading state is visible
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 overflow-hidden min-h-0">
      {!loading && !error && question && (
        <MonacoEditor
          height="100%"
          defaultLanguage="cpp"
          defaultValue={question.boilercode}
          value={editorContent}
          onChange={onEditorChange}
          options={{ automaticLayout: true, minimap: { enabled: false } }}
          theme={theme === "light" ? "light" : "vs-dark"}
        />
      )}
      <div className="mt-4 flex justify-end">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="relative min-w-[120px] bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              "Submit Code"
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
