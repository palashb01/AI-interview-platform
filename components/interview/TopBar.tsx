import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CallStatus } from "@/types";


interface TopBarProps {
  companyId: string;
  timer: string;
  interviewActive: boolean;
  onEndCall: () => void;
}

export function TopBar({ companyId, timer, interviewActive, onEndCall }: TopBarProps) {
  return (
    <div className="m-3 mb-0 flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-lg px-6 py-3">
      <h1 className="text-xl font-semibold tracking-wide">
        {companyId.toUpperCase()} – Interview
      </h1>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="text-lg font-mono">{timer}</div>
        {interviewActive && (
          <Button variant="destructive" size="sm" onClick={onEndCall}>
            End Call
          </Button>
        )}
      </div>
    </div>
  );
} 