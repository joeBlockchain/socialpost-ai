"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Pencil, RotateCcw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

interface BlogIdea {
  title: string;
  description: string;
}

interface ContentAnalyzerProps {
  onSubmit: (
    contentDescription: string,
    selectedBlogIdea: BlogIdea,
    updatedBlogIdeas: BlogIdea[]
  ) => void;
  onAnalyze: (
    selectedBlogIdea: BlogIdea,
    contentDescription: string
  ) => Promise<{ contentDescription: string; blogIdeas: BlogIdea[] }>;
  contentDescription: string;
  setContentDescription: (value: string) => void;
  blogIdeas: BlogIdea[];
  selectedBlogIdea: BlogIdea | null;
  setSelectedBlogIdea: (value: BlogIdea | null) => void;
  setBlogIdeas: (value: BlogIdea[]) => void;
}

export default function ContentAnalyzer({
  onSubmit,
  onAnalyze,
  contentDescription,
  setContentDescription,
  blogIdeas,
  selectedBlogIdea,
  setSelectedBlogIdea,
  setBlogIdeas,
}: ContentAnalyzerProps) {
  const [customIdea, setCustomIdea] = useState<BlogIdea>({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editingIdea, setEditingIdea] = useState<number | null>(null);

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] =
    useState(contentDescription);

  const fetchContentAnalysis = async () => {
    setIsLoading(true);
    try {
      const finalIdea = selectedBlogIdea || customIdea;
      const result = await onAnalyze(finalIdea, contentDescription);
      setContentDescription(result.contentDescription);
    } catch (error) {
      console.error("Error fetching content analysis:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditIdea = (index: number) => {
    setEditingIdea(index);
  };

  const handleSaveEdit = (index: number) => {
    setEditingIdea(null);
    if (
      selectedBlogIdea &&
      JSON.stringify(selectedBlogIdea) === JSON.stringify(blogIdeas[index])
    ) {
      setSelectedBlogIdea(blogIdeas[index]);
    }
  };

  const handleCancelEdit = () => {
    setEditingIdea(null);
  };

  const handleEditChange = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const newIdeas = [...blogIdeas];
    newIdeas[index] = { ...newIdeas[index], [field]: value };
    setBlogIdeas(newIdeas);
  };

  const handleEditDescription = () => {
    setIsEditingDescription(true);
    setEditedDescription(contentDescription);
  };

  const handleSaveDescription = () => {
    setContentDescription(editedDescription);
    setIsEditingDescription(false);
  };

  const handleCancelEditDescription = () => {
    setEditedDescription(contentDescription);
    setIsEditingDescription(false);
  };

  const handleSubmit = () => {
    const finalIdea = selectedBlogIdea || customIdea;
    onSubmit(contentDescription, finalIdea, blogIdeas);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Content Analyzer</CardTitle>
          <CardDescription>
            Review and edit the AI-generated content analysis.
          </CardDescription>
        </div>
        <Button
          variant="outline"
          onClick={fetchContentAnalysis}
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
      <CardContent className="space-y-8">
        <div className="space-y-2">
          <Label>Content Description</Label>
          <div className="relative">
            {isEditingDescription ? (
              <>
                <Textarea
                  value={editedDescription}
                  placeholder="Enter your content description here..."
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className=" min-h-[200px]"
                />

                <div className="flex space-x-2 absolute right-4 -bottom-4 ">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveDescription}
                    className="rounded-lg h-8"
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEditDescription}
                    className="rounded-lg h-8"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <Card className="p-4 bg-secondary/30 border-none group">
                <p className="text-sm">{contentDescription}</p>
                <Button
                  variant="outline"
                  onClick={handleEditDescription}
                  className="absolute hover:border-primary rounded-lg h-8 right-2 -bottom-4 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Pencil className="w-4 h-4 mr-2" /> <span>Edit</span>
                </Button>
              </Card>
            )}
          </div>
        </div>
        <Separator className="" />
        <div className="space-y-2">
          <Label>Select a Blog Idea</Label>
          <RadioGroup
            value={
              selectedBlogIdea ? JSON.stringify(selectedBlogIdea) : "custom"
            }
            onValueChange={(value) => {
              if (value === "custom") {
                setSelectedBlogIdea(null);
              } else {
                setSelectedBlogIdea(JSON.parse(value));
              }
            }}
          >
            {blogIdeas.map((idea, index) => (
              <div key={index} className="flex flex-col space-y-2 mb-4">
                <div className="flex items-start space-x-4">
                  <RadioGroupItem
                    value={JSON.stringify(idea)}
                    id={`idea-${index}`}
                    className="mt-[.2rem] flex-none"
                  />
                  <div
                    className={`relative p-3 border border-border rounded-lg items-start space-y-2 w-full ${
                      selectedBlogIdea &&
                      JSON.stringify(selectedBlogIdea) === JSON.stringify(idea)
                        ? "bg-secondary/40 border-border/30"
                        : ""
                    } group`}
                  >
                    {editingIdea === index ? (
                      <>
                        <Input
                          value={idea.title}
                          onChange={(e) =>
                            handleEditChange(index, "title", e.target.value)
                          }
                          className="mb-2"
                        />
                        <Textarea
                          value={idea.description}
                          onChange={(e) =>
                            handleEditChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className="mb-2"
                        />
                        <div className="flex space-x-2 absolute right-2 -bottom-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSaveEdit(index)}
                            className="rounded-lg h-8"
                          >
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                            className="rounded-lg h-8"
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Label
                          htmlFor={`idea-${index}`}
                          className="leading-normal font-semibold"
                        >
                          {idea.title}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {idea.description}
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => handleEditIdea(index)}
                          className="absolute  rounded-lg h-8 right-2 -bottom-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Pencil className="w-4 h-4 mr-2" /> <span>Edit</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-start space-x-4">
              <RadioGroupItem value="custom" id="custom-idea" className="" />
              <Label htmlFor="custom-idea">Custom Idea</Label>
            </div>
          </RadioGroup>
        </div>
        {!selectedBlogIdea && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom-idea-title">Your Custom Idea Title</Label>
              <Textarea
                id="custom-idea-title"
                value={customIdea.title}
                onChange={(e) =>
                  setCustomIdea({ ...customIdea, title: e.target.value })
                }
                placeholder="Enter your custom blog idea title..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-idea-core-message">
                Your Custom Idea Core Message
              </Label>
              <Textarea
                id="custom-idea-core-message"
                value={customIdea.description}
                onChange={(e) =>
                  setCustomIdea({ ...customIdea, description: e.target.value })
                }
                placeholder="Enter the core message for your custom blog idea..."
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          variant="secondary"
          onClick={handleSubmit}
          disabled={
            !selectedBlogIdea &&
            (!customIdea.title.trim() || !customIdea.description.trim())
          }
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}
