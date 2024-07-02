import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Option {
  value: string;
  rationale: string;
}

interface OptionSelectorProps {
  title: string;
  options: Option[];
  selected: string;
  onSelect: (value: string) => void;
  onCustom: (value: string) => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
  title,
  options,
  selected,
  onSelect,
  onCustom,
}) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <RadioGroup value={selected} onValueChange={onSelect}>
        {options.map((option, index) => (
          <div className="flex flex-col mb-2" key={index}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`${title}-${index}`} />
              <Label htmlFor={`${title}-${index}`}>{option.value}</Label>
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              {option.rationale}
            </p>
          </div>
        ))}
        <div className="flex items-center space-x-2 mt-4">
          <RadioGroupItem value="custom" id={`${title}-custom`} />
          <Label htmlFor={`${title}-custom`}>Custom:</Label>
          <Input
            placeholder="Enter your own"
            onChange={(e) => onCustom(e.target.value)}
            className="ml-2"
          />
        </div>
      </RadioGroup>
    </CardContent>
  </Card>
);

interface ReaderObjectiveAnalyzerProps {
  onSubmit: (data: {
    targetAudience: string;
    audienceGoals: string;
    blogGoals: string;
  }) => void;
}

export default function ReaderObjectiveAnalyzer({
  onSubmit,
}: ReaderObjectiveAnalyzerProps) {
  const [targetAudience, setTargetAudience] = useState("");
  const [audienceGoals, setAudienceGoals] = useState("");
  const [blogGoals, setBlogGoals] = useState("");
  const [customTargetAudience, setCustomTargetAudience] = useState("");
  const [customAudienceGoals, setCustomAudienceGoals] = useState("");
  const [customBlogGoals, setCustomBlogGoals] = useState("");

  const handleSubmit = () => {
    onSubmit({
      targetAudience:
        targetAudience === "custom" ? customTargetAudience : targetAudience,
      audienceGoals:
        audienceGoals === "custom" ? customAudienceGoals : audienceGoals,
      blogGoals: blogGoals === "custom" ? customBlogGoals : blogGoals,
    });
  };

  // These would be populated by AI analysis in a real scenario
  const targetAudienceOptions: Option[] = [
    {
      value: "Aspiring SaaS entrepreneurs",
      rationale:
        "They are looking for insights to start their own SaaS business.",
    },
    {
      value: "Junior developers",
      rationale:
        "They need guidance and practical knowledge to grow in their careers.",
    },
    {
      value: "Tech enthusiasts",
      rationale: "They are interested in the latest trends and technologies.",
    },
  ];

  const audienceGoalsOptions: Option[] = [
    {
      value: "Gain practical insights",
      rationale: "They want actionable advice they can apply immediately.",
    },
    {
      value: "Find inspiration",
      rationale:
        "They are looking for motivational content to spark new ideas.",
    },
    {
      value: "Acquire technical knowledge",
      rationale:
        "They seek in-depth technical information to enhance their skills.",
    },
  ];

  const blogGoalsOptions: Option[] = [
    {
      value: "Inspire action",
      rationale:
        "Encourage readers to take specific actions based on the content.",
    },
    {
      value: "Educate readers",
      rationale:
        "Provide valuable information that helps readers learn something new.",
    },
    {
      value: "Showcase a unique approach",
      rationale: "Highlight a distinctive method or perspective on a topic.",
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Reader Objective Analyzer</CardTitle>
        <CardDescription>
          Tell us about your target audience and the goals you want to achieve
          with your blog post.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OptionSelector
          title="Target Audience"
          options={targetAudienceOptions}
          selected={targetAudience}
          onSelect={setTargetAudience}
          onCustom={setCustomTargetAudience}
        />

        <OptionSelector
          title="Audience Goals"
          options={audienceGoalsOptions}
          selected={audienceGoals}
          onSelect={setAudienceGoals}
          onCustom={setCustomAudienceGoals}
        />

        <OptionSelector
          title="Blog Post Goals"
          options={blogGoalsOptions}
          selected={blogGoals}
          onSelect={setBlogGoals}
          onCustom={setCustomBlogGoals}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="mt-4">
          Confirm Selections
        </Button>
      </CardFooter>
    </Card>
  );
}
