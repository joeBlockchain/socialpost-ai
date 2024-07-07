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
import {
  ArrowRight,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";

interface BlogSection {
  header: string;
  description: string;
}

interface BlogOutlineProps {
  onSubmit: (data: Record<string, BlogSection>) => void;
  onRequery: () => void;
  blogSections: BlogSection[];
}

export default function BlogOutline({
  onSubmit,
  onRequery,
  blogSections,
}: BlogOutlineProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [sections, setSections] = useState<Record<string, BlogSection>>({});
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);
  const [openAccordionItem, setOpenAccordionItem] = useState<
    string | undefined
  >(blogSections[0]?.header);

  useEffect(() => {
    const initialSections = Object.fromEntries(
      blogSections.map((s) => [
        s.header,
        { header: s.header, description: s.description },
      ])
    );
    setSections(initialSections);
    setSectionOrder(blogSections.map((s) => s.header));
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
    const orderedSections = sectionOrder.reduce((acc, header) => {
      acc[header] = sections[header];
      return acc;
    }, {} as Record<string, BlogSection>);
    onSubmit(orderedSections);
  };

  const handleNextAccordionItem = () => {
    const currentIndex = sectionOrder.findIndex(
      (header) => header === openAccordionItem
    );
    if (currentIndex < sectionOrder.length - 1) {
      setOpenAccordionItem(sectionOrder[currentIndex + 1]);
    }
  };

  const addNewSection = () => {
    let newSectionNumber = 1;
    let newSectionHeader = `New Section ${newSectionNumber}`;

    while (sections.hasOwnProperty(newSectionHeader)) {
      newSectionNumber++;
      newSectionHeader = `New Section ${newSectionNumber}`;
    }

    setSections((prev) => ({
      ...prev,
      [newSectionHeader]: { header: newSectionHeader, description: "" },
    }));
    setSectionOrder((prev) => [...prev, newSectionHeader]);
    setOpenAccordionItem(newSectionHeader);
  };

  const deleteSection = (headerToDelete: string) => {
    setSections((prev) => {
      const { [headerToDelete]: deleted, ...rest } = prev;
      return rest;
    });
    setSectionOrder((prev) =>
      prev.filter((header) => header !== headerToDelete)
    );

    if (openAccordionItem === headerToDelete) {
      setOpenAccordionItem(undefined);
    }
  };

  const moveSection = (header: string, direction: "up" | "down") => {
    const currentIndex = sectionOrder.indexOf(header);
    if (
      (direction === "up" && currentIndex > 0) ||
      (direction === "down" && currentIndex < sectionOrder.length - 1)
    ) {
      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      const newOrder = [...sectionOrder];
      [newOrder[currentIndex], newOrder[newIndex]] = [
        newOrder[newIndex],
        newOrder[currentIndex],
      ];
      setSectionOrder(newOrder);
    }
  };

  const handleRequery = async () => {
    setIsLoading(true);
    try {
      await onRequery();
    } catch (error) {
      console.error("Error re-drafting content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>The Blog Outline</CardTitle>
          <CardDescription>
            Outline your blog post using the following structure. Each section
            helps to create a compelling and well-organized narrative.
          </CardDescription>
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
              <span className="">AI Retry</span>
            </div>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={openAccordionItem}
          onValueChange={setOpenAccordionItem}
        >
          {sectionOrder.map((header, index) => (
            <AccordionItem value={header} key={index}>
              <AccordionTrigger className="text-left">
                {sections[header].header}
              </AccordionTrigger>
              <AccordionContent className="ml-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`header-${index}`} className="">
                    Section Header
                  </Label>
                  <Input
                    id={`header-${index}`}
                    value={sections[header].header}
                    onChange={(e) =>
                      handleSectionChange(header, "header", e.target.value)
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
                    value={sections[header].description}
                    onChange={(e) =>
                      handleSectionChange(header, "description", e.target.value)
                    }
                    className="min-h-[150px]"
                  />
                </div>
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <Label className="">Adjust Order</Label>
                    <div className="flex space-x-2 p-1 border border-border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveSection(header, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <div className="border-l border-border h-8"></div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveSection(header, "down")}
                          disabled={index === sectionOrder.length - 1}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => deleteSection(header)}
                    className=""
                  >
                    Delete
                    <Trash2 className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button
          variant="outline"
          onClick={addNewSection}
          className="mt-4 w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Section
        </Button>
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
