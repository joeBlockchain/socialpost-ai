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
import { Input } from "@/components/ui/input"; // Import Input component
import { Label } from "../ui/label";

interface BlogSection {
  header: string;
  description: string;
}

interface BlogOutlineProps {
  onSubmit: (data: Record<string, BlogSection>) => void;
  blogSections: BlogSection[];
}

export default function BlogOutline({
  onSubmit,
  blogSections,
}: BlogOutlineProps) {
  const [sections, setSections] = useState<Record<string, BlogSection>>({});

  const [openAccordionItem, setOpenAccordionItem] = useState<
    string | undefined
  >(blogSections[0]?.header);

  useEffect(() => {
    setSections(
      Object.fromEntries(
        blogSections.map((s) => [
          s.header,
          { header: s.header, description: s.description },
        ])
      )
    );
  }, [blogSections]);

  const handleSectionChange = (
    header: string,
    field: "header" | "description",
    value: string
  ) => {
    setSections((prev) => ({
      ...prev,
      [header]: { ...prev[header], [field]: value },
    }));
  };

  const handleSubmit = () => {
    onSubmit(sections);
  };

  const handleNextAccordionItem = () => {
    const currentIndex = blogSections.findIndex(
      (s) => s.header === openAccordionItem
    );
    if (currentIndex < blogSections.length - 1) {
      setOpenAccordionItem(blogSections[currentIndex + 1].header);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>The Blog Outline</CardTitle>
        <CardDescription>
          Outline your blog post using the following structure. Each section
          helps to create a compelling and well-organized narrative.
        </CardDescription>
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
            <AccordionItem value={section.header} key={index}>
              <AccordionTrigger>
                {sections[section.header]?.header || section.header}
              </AccordionTrigger>
              <AccordionContent className="ml-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`header-${index}`} className="">
                    Section Header
                  </Label>
                  <Input
                    id={`header-${index}`}
                    value={sections[section.header]?.header || ""}
                    onChange={(e) =>
                      handleSectionChange(
                        section.header,
                        "header",
                        e.target.value
                      )
                    }
                    className=""
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`description-${index}`}>
                    Section Content
                  </Label>
                  <Textarea
                    id={`description-${index}`}
                    value={sections[section.header]?.description || ""}
                    onChange={(e) =>
                      handleSectionChange(
                        section.header,
                        "description",
                        e.target.value
                      )
                    }
                    className="min-h-[150px]"
                  />
                </div>
                {index < blogSections.length - 1 && (
                  <Button
                    variant="secondary"
                    onClick={handleNextAccordionItem}
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
        <Button variant="secondary" onClick={handleSubmit} className="">
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}
