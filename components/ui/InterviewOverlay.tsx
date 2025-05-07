import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code, FileText, Star } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
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

export function InterviewOverlay({
  isOpen,
  onClose,
  type,
  content,
  question,
  ratings,
}: InterviewOverlayProps) {
  const [formattedQuestion, setFormattedQuestion] = React.useState<string>("");

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
        <ScrollArea className="h-full pr-4">
          {type === "feedback" ? (
            <div className="space-y-6">
              {renderRatings()}
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold mb-4">Detailed Feedback</h3>
                {content.split("\n").map((line, index) => (
                  <p key={index} className="mb-2 text-foreground">
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
                    className="text-foreground"
                    dangerouslySetInnerHTML={{ __html: formattedQuestion }}
                  />
                </div>
              )}
              <div className="rounded-lg overflow-hidden border border-border">
                <SyntaxHighlighter
                  language="typescript"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    borderRadius: "0.5rem",
                  }}
                >
                  {content}
                </SyntaxHighlighter>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
