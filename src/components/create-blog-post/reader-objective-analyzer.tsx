import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component
import { ArrowLeft, ArrowRight, Car, RotateCcw } from "lucide-react";

interface Option {
  value: string;
  rationale: string;
}

interface OptionSelectorProps {
  title: string;
  options: Option[];
  selected: string;
  onSelect: (value: string) => void;
  customInput?: string;
  onCustomInputChange?: (value: string) => void;
}

function OptionSelector({
  title,
  options,
  selected,
  onSelect,
  customInput,
  onCustomInputChange,
}: OptionSelectorProps) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <RadioGroup value={selected} onValueChange={onSelect}>
        {options.map((option, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <RadioGroupItem
              className="flex-none mr-2"
              value={option.value}
              id={`${title}-${index}`}
            />
            <Label className="space-y-1" htmlFor={`${title}-${index}`}>
              <span className="font-medium ">{option.value}</span>
              <p className="text-sm text-muted-foreground">
                {option.rationale}
              </p>
            </Label>
          </div>
        ))}
        <div className="flex space-x-2 mb-2">
          <RadioGroupItem
            className="flex-none mr-2"
            value="custom"
            id={`${title}-custom`}
          />
          <Label className="space-y-1" htmlFor={`${title}-custom`}>
            <span className="font-medium ">Custom</span>
          </Label>
        </div>
      </RadioGroup>
      {selected === "custom" && onCustomInputChange && (
        <Textarea
          value={customInput}
          onChange={(e) => onCustomInputChange(e.target.value)}
          placeholder={`Enter custom ${title.toLowerCase()}`}
          className="mt-2"
        />
      )}
    </div>
  );
}

interface TargetAudienceData {
  targetAudience: {
    name: string;
    description: string;
  };
  audienceInterest: Array<{
    reason: string;
    explanation: string;
  }>;
  authorMotivation: Array<{
    reason: string;
    explanation: string;
  }>;
}

interface ReaderObjectiveAnalyzerProps {
  onSubmit: (data: {
    targetAudience: string;
    audienceGoals: string;
    blogGoals: string;
  }) => void;
  targetAudienceData: TargetAudienceData | null;
  fetchBlogStrategy: (currentData: TargetAudienceData | null) => Promise<void>;
}

export default function ReaderObjectiveAnalyzer({
  onSubmit,
  targetAudienceData,
  fetchBlogStrategy,
}: ReaderObjectiveAnalyzerProps) {
  const [selectedTargetAudience, setSelectedTargetAudience] = useState("");
  const [customTargetAudience, setCustomTargetAudience] = useState("");
  const [selectedAudienceGoals, setSelectedAudienceGoals] = useState("");
  const [customAudienceGoals, setCustomAudienceGoals] = useState("");
  const [selectedBlogGoals, setSelectedBlogGoals] = useState("");
  const [customBlogGoals, setCustomBlogGoals] = useState("");

  useEffect(() => {
    if (targetAudienceData) {
      setSelectedTargetAudience(targetAudienceData.targetAudience.name);
      setSelectedAudienceGoals(
        targetAudienceData.audienceInterest[0]?.reason || ""
      );
      setSelectedBlogGoals(
        targetAudienceData.authorMotivation[0]?.reason || ""
      );
    }
  }, [targetAudienceData]);

  const handleSubmit = () => {
    onSubmit({
      targetAudience:
        selectedTargetAudience === "custom"
          ? customTargetAudience
          : selectedTargetAudience,
      audienceGoals:
        selectedAudienceGoals === "custom"
          ? customAudienceGoals
          : selectedAudienceGoals,
      blogGoals:
        selectedBlogGoals === "custom" ? customBlogGoals : selectedBlogGoals,
    });
  };

  const handleNewAISuggestions = () => {
    console.log("fetching new AI suggestions");
    fetchBlogStrategy(targetAudienceData);
  };

  if (!targetAudienceData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reader Objective Analyzer</CardTitle>
          <CardDescription>
            Review the AI-generated target audience and goals for your blog
            post.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Pending submision of files...</p>
        </CardContent>
      </Card>
    );
  }

  const targetAudienceOptions: Option[] = [
    {
      value: targetAudienceData.targetAudience.name,
      rationale: targetAudienceData.targetAudience.description,
    },
  ];

  const audienceGoalsOptions: Option[] =
    targetAudienceData.audienceInterest.map((interest) => ({
      value: interest.reason,
      rationale: interest.explanation,
    }));

  const blogGoalsOptions: Option[] = targetAudienceData.authorMotivation.map(
    (motivation) => ({
      value: motivation.reason,
      rationale: motivation.explanation,
    })
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Reader Objective Analyzer</CardTitle>
          <CardDescription>
            Review the AI-generated target audience and goals for your blog
            post.
          </CardDescription>
        </div>
        {/* <div className="border border-border rounded-md p-1 flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={16} />
          </Button>
          <div className="border-l h-6"></div>
          <Button variant="ghost" size="icon">
            <ArrowRight size={16} />
          </Button>
        </div> */}
        <Button
          variant="outline"
          onClick={handleNewAISuggestions}
          className="mt-4"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <OptionSelector
          title="Target Audience"
          options={targetAudienceOptions}
          selected={selectedTargetAudience}
          onSelect={setSelectedTargetAudience}
          customInput={customTargetAudience}
          onCustomInputChange={setCustomTargetAudience}
        />

        <OptionSelector
          title="Audience Goals"
          options={audienceGoalsOptions}
          selected={selectedAudienceGoals}
          onSelect={setSelectedAudienceGoals}
          customInput={customAudienceGoals}
          onCustomInputChange={setCustomAudienceGoals}
        />

        <OptionSelector
          title="Blog Post Goals"
          options={blogGoalsOptions}
          selected={selectedBlogGoals}
          onSelect={setSelectedBlogGoals}
          customInput={customBlogGoals}
          onCustomInputChange={setCustomBlogGoals}
        />
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
