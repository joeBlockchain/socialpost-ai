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

interface BlogSection {
  title: string;
  description: string;
  placeholder: string;
}

interface BlogOutlineProps {
  onSubmit: (data: Record<string, string>) => void;
  blogSections: BlogSection[];
}

export default function BlogOutline({
  onSubmit,
  blogSections,
}: BlogOutlineProps) {
  const [sections, setSections] = useState<Record<string, string>>({});
  const [openAccordionItem, setOpenAccordionItem] = useState<
    string | undefined
  >(blogSections[0]?.title);
  useEffect(() => {
    setSections(Object.fromEntries(blogSections.map((s) => [s.title, ""])));
  }, [blogSections]);

  const handleSectionChange = (title: string, content: string) => {
    setSections((prev) => ({ ...prev, [title]: content }));
  };

  const handleSubmit = () => {
    onSubmit(sections);
  };

  const handleNextAccordionItem = () => {
    const currentIndex = blogSections.findIndex(
      (s) => s.title === openAccordionItem
    );
    if (currentIndex < blogSections.length - 1) {
      setOpenAccordionItem(blogSections[currentIndex + 1].title);
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
            <AccordionItem value={section.title} key={index}>
              <AccordionTrigger>{section.title}</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2 text-sm text-muted-foreground">
                  {section.description}
                </p>
                <Textarea
                  placeholder={section.placeholder}
                  value={sections[section.title] || ""}
                  onChange={(e) =>
                    handleSectionChange(section.title, e.target.value)
                  }
                  className="min-h-[150px]"
                />
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
