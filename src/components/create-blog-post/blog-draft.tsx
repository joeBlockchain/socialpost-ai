"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";
import { Label } from "../ui/label";
import { Progress } from "@/components/ui/progress";

interface BlogSection {
  header: string;
  description: string;
}

interface BlogDraftProps {
  onSubmit: (data: Record<string, string>) => void;
  blogSections: BlogSection[];
  blogOutline: Record<string, BlogSection>;
  blogDraft: Record<string, string>;
}

export default function BlogDraft({
  onSubmit,
  blogSections,
  blogOutline,
  blogDraft,
}: BlogDraftProps) {
  const [sections, setSections] = useState<Record<string, string>>({});
  const [openAccordionItem, setOpenAccordionItem] = useState<
    string | undefined
  >(blogSections[0]?.header);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Sync sections with blogOutline and blogDraft
    const newSections: Record<string, string> = {};
    blogSections.forEach((section) => {
      newSections[section.header] = blogDraft[section.header] || "";
    });
    setSections(newSections);

    // Update openAccordionItem if the current one no longer exists
    if (
      openAccordionItem &&
      !blogSections.some((s) => s.header === openAccordionItem)
    ) {
      setOpenAccordionItem(blogSections[0]?.header);
    }
  }, [blogSections, blogOutline, blogDraft, openAccordionItem]);

  useEffect(() => {
    // Calculate progress based on the number of non-empty sections
    const completedSections = Object.values(sections).filter(Boolean).length;
    const newProgress = (completedSections / blogSections.length) * 100;
    setProgress(newProgress);
  }, [sections, blogSections]);

  const handleSectionChange = (header: string, content: string) => {
    setSections((prev) => ({ ...prev, [header]: content }));
  };

  const handleSubmit = () => {
    onSubmit(sections);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>The Blog</CardTitle>
        <CardDescription>Review and edit the blog!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <Label>Progress</Label>
            <p className="text-sm text-muted-foreground text-right">
              {isNaN(progress) ? 0 : Math.round(progress)}% Complete
            </p>
          </div>
          <Progress value={progress} className="w-full h-2" />
        </div>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={openAccordionItem}
          onValueChange={setOpenAccordionItem}
        >
          {blogSections.map((section, index) => (
            <AccordionItem value={section.header} key={section.header}>
              <AccordionTrigger className="text-left">
                {section.header}
              </AccordionTrigger>
              <AccordionContent className="ml-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`section-description-${index}`} className="">
                    Section Goals
                  </Label>
                  <ul
                    id={`section-description-${index}`}
                    className="list-disc list-inside ml-2 text-sm text-muted-foreground"
                  >
                    {section.description
                      .split("\n")
                      .map((point, pointIndex) => (
                        <li key={pointIndex}>{point.replace(/^- /, "")}</li>
                      ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`section-content-${index}`} className="">
                    Section Content
                  </Label>
                  <Textarea
                    id={`section-content-${index}`}
                    value={sections[section.header] || ""}
                    onChange={(e) =>
                      handleSectionChange(section.header, e.target.value)
                    }
                    className="min-h-[150px]"
                  />
                </div>
                {index < blogSections.length - 1 && (
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setOpenAccordionItem(blogSections[index + 1].header)
                    }
                    className="mt-4"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="secondary" onClick={handleSubmit} className="mt-4">
          Review Blog
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}
