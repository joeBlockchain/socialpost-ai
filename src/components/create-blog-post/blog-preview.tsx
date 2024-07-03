"use client";

import React, { useState } from "react";
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

export default function BlogPreview({ blogSections }: BlogPreviewProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const blogContent = blogSections
      .map((section) => `# ${section.header}\n\n${section.content}`)
      .join("\n\n");

    navigator.clipboard.writeText(blogContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
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
        {blogSections.map((section, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{section.header}</h2>
            <div className="prose max-w-none">
              {section.content.split("\n").map((paragraph, pIndex) => (
                <p key={pIndex} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
