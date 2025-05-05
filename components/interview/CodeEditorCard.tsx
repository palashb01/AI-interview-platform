import MonacoEditor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";

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
        <Button onClick={onSubmit}>Submit Code</Button>
      </div>
    </div>
  );
}
