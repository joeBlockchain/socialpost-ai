import React, { useState } from "react";
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

interface BlogSection {
  title: string;
  description: string;
  placeholder: string;
}

const blogSections: BlogSection[] = [
  {
    title: "Attention-Grabbing Introduction",
    description:
      "Start with a hook related to the core message. Briefly introduce the SaaS app and its purpose.",
    placeholder:
      "E.g., 'Imagine a world where creating beautiful, responsive websites is as easy as dragging and dropping elements...'",
  },
  {
    title: "Developer's Journey",
    description:
      "Narrate the development process, focusing on relatable experiences. Highlight challenges and solutions.",
    placeholder:
      "E.g., 'When I first started building this SaaS, I never imagined the rollercoaster ride that awaited me...'",
  },
  {
    title: "Technical Insights",
    description:
      "Share valuable technical details, tailored to the audience's level. Use analogies to explain complex concepts.",
    placeholder:
      "E.g., 'At the heart of our SaaS is a powerful algorithm that works like a skilled librarian, efficiently organizing and retrieving information...'",
  },
  {
    title: "Lessons Learned",
    description:
      "Emphasize key takeaways applicable to the reader's own projects.",
    placeholder:
      "E.g., 'One of the most valuable lessons I learned was the importance of user feedback early in the development process...'",
  },
  {
    title: "Call to Action",
    description:
      "Encourage readers to take a specific next step (e.g., start their own project, try a new technique).",
    placeholder:
      "E.g., 'Ready to start your own SaaS journey? Take the first step today by signing up for our free developer toolkit...'",
  },
];

interface BlogOutlineProps {
  onSubmit: (data: Record<string, string>) => void;
}

export default function BlogOutline({ onSubmit }: BlogOutlineProps) {
  const [sections, setSections] = useState<Record<string, string>>(
    Object.fromEntries(blogSections.map((s) => [s.title, ""]))
  );

  const handleSectionChange = (title: string, content: string) => {
    setSections((prev) => ({ ...prev, [title]: content }));
  };

  const handleSubmit = () => {
    onSubmit(sections);
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
        <Accordion type="single" collapsible className="w-full">
          {blogSections.map((section, index) => (
            <AccordionItem value={section.title} key={index}>
              <AccordionTrigger>{section.title}</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2 text-sm text-muted-foreground">
                  {section.description}
                </p>
                <Textarea
                  placeholder={section.placeholder}
                  value={sections[section.title]}
                  onChange={(e) =>
                    handleSectionChange(section.title, e.target.value)
                  }
                  className="min-h-[150px]"
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="mt-4">
          Confirm Blog Outline
        </Button>
      </CardFooter>
    </Card>
  );
}
