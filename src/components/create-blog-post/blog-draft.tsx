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
  const [sections, setSections] = useState<Record<string, string>>(blogDraft);
  const [openAccordionItem, setOpenAccordionItem] = useState<
    string | undefined
  >(blogSections[0]?.header);

  useEffect(() => {
    setSections(blogDraft);
  }, [blogDraft]);

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
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={openAccordionItem}
          onValueChange={setOpenAccordionItem}
        >
          {blogSections.map((section, index) => (
            <AccordionItem value={section.header} key={index} className="">
              <AccordionTrigger>{section.header}</AccordionTrigger>
              <AccordionContent className="ml-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`section-description-${index}`} className="">
                    Section Goals
                  </Label>
                  <ul
                    id={`section-description-${index}`}
                    className="list-disc list-inside ml-2 text-sm text-muted-foreground"
                  >
                    {section.description.split("\n").map((point, index) => (
                      <li key={index}>{point.replace(/^- /, "")}</li>
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
