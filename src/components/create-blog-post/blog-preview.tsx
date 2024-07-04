"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Check, Copy } from "lucide-react";

interface BlogSection {
  header: string;
  content: string;
}

interface BlogPreviewProps {
  blogSections: BlogSection[];
}

const renderMarkdown = (content: string) => {
  // Convert headers
  content = content.replace(
    /^# (.*$)/gim,
    '<h1 class="text-3xl font-bold my-4">$1</h1>'
  );
  content = content.replace(
    /^## (.*$)/gim,
    '<h2 class="text-2xl font-semibold my-3">$1</h2>'
  );
  content = content.replace(
    /^### (.*$)/gim,
    '<h3 class="text-xl font-medium my-2">$1</h3>'
  );

  // Convert bold and italic
  content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  content = content.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Convert lists
  content = content.replace(/^\s*\n\*/gm, "<ul>\n*");
  content = content.replace(/^(\*(.+))\s*\n([^\*])/gm, "$1\n</ul>\n\n$3");
  content = content.replace(/^\*(.+)/gm, "<li>$1</li>");

  // Convert paragraphs
  content = content.replace(/^\s*(\n)?(.+)/gim, function (m) {
    return (
      (m.trim().startsWith("<") ? "" : '<p class="my-2">') +
      m.trim() +
      (m.trim().startsWith("<") ? "" : "</p>")
    );
  });

  // Remove extra lines
  content = content.trim();

  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

export default function BlogPreview({ blogSections }: BlogPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [displaySections, setDisplaySections] = useState<BlogSection[]>([]);

  useEffect(() => {
    setDisplaySections(blogSections);
  }, [blogSections]);

  const copyToClipboard = () => {
    const blogContent = displaySections
      .map((section) => `# ${section.header}\n\n${section.content}`)
      .join("\n\n");

    navigator.clipboard.writeText(blogContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Blog Preview</CardTitle>
          <CardDescription>
            See how your blog post looks as you write it
          </CardDescription>
        </div>
        <Button
          onClick={copyToClipboard}
          variant="outline"
          className="flex items-center"
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" /> Copy
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {displaySections.map((section, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{section.header}</h2>
            <div className="prose max-w-none">
              {renderMarkdown(section.content)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
