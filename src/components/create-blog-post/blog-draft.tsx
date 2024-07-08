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
import { ArrowRight, RotateCcw } from "lucide-react";
import { Label } from "../ui/label";
import { Progress } from "@/components/ui/progress";

interface BlogSection {
  header: string;
  description: string;
}

interface BlogDraftProps {
  onSubmit: (data: Record<string, string>) => void;
  onRequery: () => void;
  onRequerySection: (sectionHeader: string) => void;
  blogSections: BlogSection[];
  blogOutline: Record<string, BlogSection>;
  blogDraft: Record<string, string>;
  clearBlogContent: () => void;
}

export default function BlogDraft({
  onSubmit,
  onRequery,
  onRequerySection,
  blogSections,
  blogOutline,
  blogDraft,
  clearBlogContent,
}: BlogDraftProps) {
  const [sections, setSections] = useState<Record<string, string>>({});
  const [openAccordionItem, setOpenAccordionItem] = useState<
    string | undefined
  >(blogSections[0]?.header);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSections, setLoadingSections] = useState<
    Record<string, boolean>
  >({});

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

  const handleRequery = async () => {
    clearBlogContent();
    setIsLoading(true);
    try {
      await onRequery();
    } catch (error) {
      console.error("Error re-drafting content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequerySection = async (sectionHeader: string) => {
    setLoadingSections((prev) => ({ ...prev, [sectionHeader]: true }));
    try {
      await onRequerySection(sectionHeader);
    } catch (error) {
      console.error(`Error re-drafting section ${sectionHeader}:`, error);
    } finally {
      setLoadingSections((prev) => ({ ...prev, [sectionHeader]: false }));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>The Blog</CardTitle>
          <CardDescription>Review and edit the blog!</CardDescription>
        </div>
        <Button
          variant="outline"
          onClick={handleRequery}
          disabled={isLoading}
          className="ml-4"
        >
          {isLoading ? (
            <span
              className="loader"
              style={
                {
                  "--loader-size": "18px",
                  "--loader-color": "#000",
                  "--loader-color-dark": "#fff",
                } as React.CSSProperties
              }
            ></span>
          ) : (
            <div className="flex items-center space-x-2">
              <RotateCcw className="w-4 h-4" />
              <span className="">AI Redraft All</span>
            </div>
          )}
        </Button>
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
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => handleRequerySection(section.header)}
                    disabled={loadingSections[section.header]}
                    className="mt-2"
                  >
                    {loadingSections[section.header] ? (
                      <span
                        className="loader"
                        style={
                          {
                            "--loader-size": "18px",
                            "--loader-color": "#000",
                            "--loader-color-dark": "#fff",
                          } as React.CSSProperties
                        }
                      ></span>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <RotateCcw className="w-4 h-4" />
                        <span className="">AI Redraft Section</span>
                      </div>
                    )}
                  </Button>
                  {index < blogSections.length - 1 && (
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setOpenAccordionItem(blogSections[index + 1].header)
                      }
                      className="mt-2"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
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
