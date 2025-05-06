"use client";

import React, { useState, useEffect } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import type { Element } from "hast";

interface QuestionDisplayProps {
  markdown: string | undefined;
}

export default function QuestionDisplay({ markdown }: QuestionDisplayProps) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const file = await unified()
        .use(remarkParse) // parse markdown to MDAST
        .use(remarkGfm) // GitHub-flavor (tables, strikethrough)
        .use(remarkRehype, { allowDangerousHtml: true }) // to HAST, keep raw HTML
        .use(rehypeRaw) // parse that HTML
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
          onVisitHighlightedWord(node: Element) {
            const cn = (node.properties?.className ?? []) as string[];
            cn.push("bg-orange-200/40");
          },
        } as any)
        .use(rehypeStringify) // to HTML string
        .process(markdown);

      if (!cancelled) {
        setHtml(String(file));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [markdown]);

  return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}
