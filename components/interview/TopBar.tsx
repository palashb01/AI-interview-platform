import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Loader2 } from "lucide-react";

interface TopBarProps {
  companyId: string;
  timer: string;
  interviewActive: boolean;
  onEndCall: () => void;
  isGeneratingFeedback?: boolean;
}

export function TopBar({
  companyId,
  timer,
  interviewActive,
  onEndCall,
  isGeneratingFeedback = false,
}: TopBarProps) {
  return (
    <div className="m-3 mb-0 flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-lg px-6 py-3">
      <h1 className="text-xl font-semibold tracking-wide">{companyId.toUpperCase()} – Interview</h1>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="text-lg font-mono">
          {timer}/<span className="text-gray-500 dark:text-gray-400">40:00</span>
        </div>
        {interviewActive && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onEndCall}
            disabled={isGeneratingFeedback}
            className="relative min-w-[120px]"
          >
            {isGeneratingFeedback ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Feedback...
              </>
            ) : (
              "End Interview"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
