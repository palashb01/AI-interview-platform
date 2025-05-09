import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Code, FileText, Star } from "lucide-react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypePrettyCode, { Options } from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { Element } from "hast";
import React from "react";
import { Progress } from "@/components/ui/progress";
import MonacoEditor from "@monaco-editor/react";

interface InterviewOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  type: "feedback" | "solution";
  content: string;
  question?: string;
  ratings?: {
    codeQuality: number;
    communication: number;
    problemSolving: number;
    confidenceClarity: number;
    technicalKnowledge: number;
  };
}

const getFormattedCode = (code: string) => code.replace(/\\n/g, "\n");

export function InterviewOverlay({
  isOpen,
  onClose,
  type,
  content,
  question,
  ratings,
}: InterviewOverlayProps) {
  const [formattedQuestion, setFormattedQuestion] = React.useState<string>("");
  const [fontSize, setFontSize] = React.useState(14);

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if(width < 500){
        setFontSize(10);
      }
      else if (width < 640) {
        setFontSize(12);
      } else if (width < 1024) {
        setFontSize(13);
      } else {
        setFontSize(14);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    async function formatQuestion() {
      if (!question) return;

      const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypePrettyCode, {
          theme: "github-dark",
          onVisitLine(node: Element) {
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: "" }];
            }
          },
          onVisitHighlightedLine(node: Element) {
            const cn = (node.properties?.className ?? []) as string[];
            cn.push("bg-yellow-200/20");
          },
          onVisitHighlightedChars(node: Element) {
            const cn = (node.properties?.className ?? []) as string[];
            cn.push("bg-orange-200/40");
          },
        } satisfies Options)
        .use(rehypeStringify)
        .process(question);

      setFormattedQuestion(String(file));
    }

    formatQuestion();
  }, [question]);

  const renderRatings = () => {
    if (!ratings) return null;

    const ratingItems = [
      { key: "problemSolving", label: "Problem Solving" },
      { key: "codeQuality", label: "Code Quality" },
      { key: "communication", label: "Communication" },
      { key: "technicalKnowledge", label: "Technical Knowledge" },
      { key: "confidenceClarity", label: "Confidence & Clarity" },
    ];

    return (
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">Performance Ratings</h3>
        </div>
        <div className="grid gap-4">
          {ratingItems.map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{label}</span>
                <span className="text-sm text-muted-foreground">
                  {ratings[key as keyof typeof ratings]}/10
                </span>
              </div>
              <Progress value={ratings[key as keyof typeof ratings] * 10} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            {type === "feedback" ? (
              <>
                <FileText className="h-5 w-5 text-indigo-500" />
                Detailed Feedback
              </>
            ) : (
              <>
                <Code className="h-5 w-5 text-indigo-500" />
                Submitted Solution
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="h-full overflow-y-auto pr-4 custom-scrollbar">
          {type === "feedback" ? (
            <div className="space-y-6">
              {renderRatings()}
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold mb-4">Detailed Feedback</h3>
                {content.split("\n").map((line, index) => (
                  <p key={index} className="mb-2 text-foreground text-sm sm:text-base">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {question && (
                <div className="prose dark:prose-invert max-w-none bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Question:</h3>
                  <div
                    className="text-foreground text-sm sm:text-base max-h-[200px] overflow-y-auto overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: formattedQuestion }}
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'rgba(155, 155, 155, 0.5) transparent'
                    }}
                  />
                </div>
              )}
              <div className="rounded-lg border overflow-auto" style={{ height: 400 }}>
                <MonacoEditor
                  height="100%"
                  language="cpp"
                  value={getFormattedCode(content)}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: fontSize,
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    lineNumbers: "on",
                    theme: "vs-dark",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
