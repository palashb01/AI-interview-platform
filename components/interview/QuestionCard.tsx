import QuestionDisplay from "@/components/QuestionDisplay";

interface QuestionCardProps {
  loading: boolean;
  error: string | null;
  question: { body_md: string } | null;
}

export function QuestionCard({ loading, error, question }: QuestionCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 h-1/3 overflow-auto">
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading question…</p>
      ) : error ? (
        <p className="text-red-600 dark:text-red-400">{error}</p>
      ) : (
        <QuestionDisplay markdown={question?.body_md} />
      )}
    </div>
  );
} 