"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface ContentAnalyzerProps {
  onSubmit: (contentDescription: string, selectedBlogIdea: string) => void;
  onAnalyze: (
    selectedBlogIdea: string,
    contentDescription: string
  ) => Promise<{ contentDescription: string; blogIdeas: string[] }>;

  contentDescription: string;
  setContentDescription: (value: string) => void;
  blogIdeas: string[];
  selectedBlogIdea: string;
  setSelectedBlogIdea: (value: string) => void;
}

export default function ContentAnalyzer({
  onSubmit,
  onAnalyze,
  contentDescription,
  setContentDescription,
  blogIdeas,
  selectedBlogIdea,
  setSelectedBlogIdea,
}: ContentAnalyzerProps) {
  const [customIdea, setCustomIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchContentAnalysis = async () => {
    setIsLoading(true);
    try {
      const finalIdea =
        selectedBlogIdea === "custom" ? customIdea : selectedBlogIdea;
      await onAnalyze(finalIdea, contentDescription);
    } catch (error) {
      console.error("Error fetching content analysis:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    const finalIdea =
      selectedBlogIdea === "custom" ? customIdea : selectedBlogIdea;
    onSubmit(contentDescription, finalIdea);
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
          //   size="icon"
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
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="content-description">Content Description</Label>
          <Textarea
            id="content-description"
            value={contentDescription}
            onChange={(e) => setContentDescription(e.target.value)}
            className="min-h-[150px]"
            placeholder="Description of the content in your files..."
          />
        </div>
        <div className="space-y-2">
          <Label>Select a Blog Idea</Label>
          <RadioGroup
            value={selectedBlogIdea}
            onValueChange={setSelectedBlogIdea}
          >
            {blogIdeas.map((idea, index) => (
              <div key={index} className="flex items-start space-x-4">
                <RadioGroupItem
                  value={idea}
                  id={`idea-${index}`}
                  className="mt-[.2rem]"
                />
                <Label htmlFor={`idea-${index}`} className="leading-normal">
                  {idea}
                </Label>
              </div>
            ))}
            <div className="flex items-start space-x-4">
              <RadioGroupItem value="custom" id="custom-idea" className="" />
              <Label htmlFor="custom-idea">Custom Idea</Label>
            </div>
          </RadioGroup>
        </div>
        {selectedBlogIdea === "custom" && (
          <div className="space-y-2">
            <Label htmlFor="custom-idea-input">Your Custom Idea</Label>
            <Textarea
              id="custom-idea-input"
              value={customIdea}
              onChange={(e) => setCustomIdea(e.target.value)}
              placeholder="Enter your custom blog idea..."
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          variant="secondary"
          onClick={handleSubmit}
          disabled={selectedBlogIdea === "custom" && !customIdea.trim()}
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}
