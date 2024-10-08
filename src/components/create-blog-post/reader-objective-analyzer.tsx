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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, RotateCcw } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface BlogIdea {
  title: string;
  description: string;
}

interface Option {
  value: string;
  rationale: string;
}

interface OptionSelectorProps {
  title: string;
  options: Option[];
  selected: string;
  onSelect: (value: string) => void;
  customInput: string;
  onCustomInputChange: (value: string) => void;
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
    <div className="">
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
      {(selected === "custom" || options.length === 0) && (
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

interface ReaderObjectiveData {
  targetAudience: {
    value: string;
    rationale: string;
  };
  audienceGoals: {
    value: string;
    rationale: string;
  };
  blogGoals: {
    value: string;
    rationale: string;
  };
}

interface ReaderObjectiveAnalyzerProps {
  onSubmit: (data: ReaderObjectiveData) => void;
  targetAudienceData: TargetAudienceData | null;
  fetchBlogStrategy: (
    currentData: TargetAudienceData | null,
    selectedBlogIdea: BlogIdea,
    contentDescription: string
  ) => Promise<void>;
  selectedBlogIdea: BlogIdea | null;
  contentDescription: string;
  readerObjectiveData: ReaderObjectiveData | null;
}

export default function ReaderObjectiveAnalyzer({
  onSubmit,
  targetAudienceData,
  fetchBlogStrategy,
  selectedBlogIdea,
  contentDescription,
  readerObjectiveData,
}: ReaderObjectiveAnalyzerProps) {
  const [selectedTargetAudience, setSelectedTargetAudience] =
    useState("custom");
  const [customTargetAudience, setCustomTargetAudience] = useState("");
  const [selectedAudienceGoals, setSelectedAudienceGoals] = useState("custom");
  const [customAudienceGoals, setCustomAudienceGoals] = useState("");
  const [selectedBlogGoals, setSelectedBlogGoals] = useState("custom");
  const [customBlogGoals, setCustomBlogGoals] = useState("");

  const [openAccordionItem, setOpenAccordionItem] = useState<
    string | undefined
  >("target-audience");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (readerObjectiveData) {
      setSelectedTargetAudience(readerObjectiveData.targetAudience.value);
      setCustomTargetAudience(readerObjectiveData.targetAudience.value);
      setSelectedAudienceGoals(readerObjectiveData.audienceGoals.value);
      setCustomAudienceGoals(readerObjectiveData.audienceGoals.value);
      setSelectedBlogGoals(readerObjectiveData.blogGoals.value);
      setCustomBlogGoals(readerObjectiveData.blogGoals.value);
    } else if (targetAudienceData) {
      setSelectedTargetAudience(targetAudienceData.targetAudience.name);
      setSelectedAudienceGoals(
        targetAudienceData.audienceInterest[0]?.reason || "custom"
      );
      setSelectedBlogGoals(
        targetAudienceData.authorMotivation[0]?.reason || "custom"
      );
    }
  }, [readerObjectiveData, targetAudienceData]);

  const handleSubmit = () => {
    const getValueAndRationale = (
      selected: string,
      custom: string,
      options: Option[]
    ) => {
      if (selected === "custom") {
        return { value: custom, rationale: "Custom input" };
      }
      const option = options.find((opt) => opt.value === selected);
      return option
        ? { value: option.value, rationale: option.rationale }
        : { value: "", rationale: "" };
    };

    const data: ReaderObjectiveData = {
      targetAudience: getValueAndRationale(
        selectedTargetAudience,
        customTargetAudience,
        targetAudienceOptions
      ),
      audienceGoals: getValueAndRationale(
        selectedAudienceGoals,
        customAudienceGoals,
        audienceGoalsOptions
      ),
      blogGoals: getValueAndRationale(
        selectedBlogGoals,
        customBlogGoals,
        blogGoalsOptions
      ),
    };
    onSubmit(data);
  };

  const handleNextAccordionItem = () => {
    const items = ["target-audience", "audience-goals", "blog-post-goals"];
    const currentIndex = items.indexOf(openAccordionItem || "");
    if (currentIndex < items.length - 1) {
      setOpenAccordionItem(items[currentIndex + 1]);
    }
  };

  const handleNewAISuggestions = async () => {
    if (selectedBlogIdea) {
      setIsLoading(true); // Add this line
      try {
        await fetchBlogStrategy(
          targetAudienceData,
          selectedBlogIdea,
          contentDescription
        );
      } finally {
        setIsLoading(false); // Add this line
      }
    }
  };

  const targetAudienceOptions: Option[] = targetAudienceData
    ? [
        {
          value: targetAudienceData.targetAudience.name,
          rationale: targetAudienceData.targetAudience.description,
        },
      ]
    : [];

  const audienceGoalsOptions: Option[] = targetAudienceData
    ? targetAudienceData.audienceInterest.map((interest) => ({
        value: interest.reason,
        rationale: interest.explanation,
      }))
    : [];

  const blogGoalsOptions: Option[] = targetAudienceData
    ? targetAudienceData.authorMotivation.map((motivation) => ({
        value: motivation.reason,
        rationale: motivation.explanation,
      }))
    : [];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Reader Objective Analyzer</CardTitle>
          <CardDescription>
            {targetAudienceData
              ? "Review the AI-generated target audience and goals for your blog post."
              : "Define your target audience and goals for your blog post."}
          </CardDescription>
        </div>
        <Button
          variant="outline"
          onClick={handleNewAISuggestions}
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
          value={openAccordionItem}
          onValueChange={setOpenAccordionItem}
        >
          <AccordionItem value="target-audience">
            <AccordionTrigger>Target Audience</AccordionTrigger>
            <AccordionContent>
              <div className="ml-4">
                <p className="mb-4 text-base">
                  Knowing your audience allows us to tailor our content to their
                  interests, needs, and problems. This increases engagement and
                  the likelihood that they will find our content valuable.
                </p>
                <OptionSelector
                  title="Target Audience"
                  options={targetAudienceOptions}
                  selected={selectedTargetAudience}
                  onSelect={setSelectedTargetAudience}
                  customInput={customTargetAudience}
                  onCustomInputChange={setCustomTargetAudience}
                />
                <Button
                  variant="secondary"
                  onClick={handleNextAccordionItem}
                  className="mt-4"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="audience-goals">
            <AccordionTrigger>Audience Goals</AccordionTrigger>
            <AccordionContent>
              <div className="ml-4">
                <p className="mb-4 text-base">
                  Defining why we want our audience to read our content ensures
                  that our writing has a clear purpose. Whether it is to inform,
                  entertain, or persuade, having a defined objective helps us
                  stay focused and deliver value.
                </p>
                <OptionSelector
                  title="Audience Goals"
                  options={audienceGoalsOptions}
                  selected={selectedAudienceGoals}
                  onSelect={setSelectedAudienceGoals}
                  customInput={customAudienceGoals}
                  onCustomInputChange={setCustomAudienceGoals}
                />
                <Button
                  variant="secondary"
                  onClick={handleNextAccordionItem}
                  className="mt-4"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="blog-post-goals">
            <AccordionTrigger>Blog Post Goals</AccordionTrigger>
            <AccordionContent>
              <div className="ml-4">
                <p className="mb-4 text-base">
                  By aligning our personal goals with our audiences interests,
                  we can create content that is more relevant and engaging. This
                  alignment ensures that our post resonates with our readers and
                  meets their expectations.
                </p>
                <OptionSelector
                  title="Blog Post Goals"
                  options={blogGoalsOptions}
                  selected={selectedBlogGoals}
                  onSelect={setSelectedBlogGoals}
                  customInput={customBlogGoals}
                  onCustomInputChange={setCustomBlogGoals}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
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
