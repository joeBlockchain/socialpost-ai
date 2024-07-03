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

interface SUCCESsPrinciple {
  name: string;
  description: string;
  placeholder: string;
}

const successPrinciples: SUCCESsPrinciple[] = [
  {
    name: "Simple",
    description: "Distill the core message of the SaaS creation journey",
    placeholder:
      "E.g., 'Building a SaaS is about solving real problems efficiently'",
  },
  {
    name: "Unexpected",
    description:
      "Identify surprising elements or unconventional choices in the process",
    placeholder: "E.g., 'We chose to launch without a pricing model'",
  },
  {
    name: "Concrete",
    description: "Focus on tangible steps and real-world examples",
    placeholder:
      "E.g., 'We reduced server costs by 50% by optimizing our database queries'",
  },
  {
    name: "Credible",
    description: "Highlight the developer's expertise or unique insights",
    placeholder:
      "E.g., 'With 10 years of experience in scaling applications, I knew we had to focus on...'",
  },
  {
    name: "Emotional",
    description: "Capture the ups and downs of the development journey",
    placeholder:
      "E.g., 'The moment we got our first paying customer, we felt a rush of validation'",
  },
  {
    name: "Stories",
    description:
      "Structure the post as a narrative of the developer's experience",
    placeholder:
      "E.g., 'It all started when I noticed a recurring problem in my daily workflow...'",
  },
];

interface CoreMessageCrafterProps {
  onSubmit: (data: Record<string, string>) => void;
  aiGeneratedContent: Record<string, string> | null;
}

export default function CoreMessageCrafter({
  onSubmit,
  aiGeneratedContent,
}: CoreMessageCrafterProps) {
  const [principles, setPrinciples] = useState<Record<string, string>>(
    Object.fromEntries(successPrinciples.map((p) => [p.name.toLowerCase(), ""]))
  );
  const [openAccordionItem, setOpenAccordionItem] = useState<
    string | undefined
  >(successPrinciples[0].name);

  useEffect(() => {
    if (aiGeneratedContent) {
      setPrinciples(aiGeneratedContent);
    }
  }, [aiGeneratedContent]);

  const handlePrincipleChange = (name: string, value: string) => {
    setPrinciples((prev) => ({ ...prev, [name.toLowerCase()]: value }));
  };

  const handleSubmit = () => {
    onSubmit(principles);
  };

  const handleNextAccordionItem = () => {
    const currentIndex = successPrinciples.findIndex(
      (p) => p.name === openAccordionItem
    );
    if (currentIndex < successPrinciples.length - 1) {
      setOpenAccordionItem(successPrinciples[currentIndex + 1].name);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Craft a Compelling Core Message</CardTitle>
        <CardDescription>
          Apply the SUCCESs principles from Made to Stick to create a powerful
          message for your blog post.
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
          {successPrinciples.map((principle, index) => (
            <AccordionItem value={principle.name} key={index}>
              <AccordionTrigger>{principle.name}</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2 text-sm text-muted-foreground">
                  {principle.description}
                </p>
                <Textarea
                  placeholder={principle.placeholder}
                  value={principles[principle.name.toLowerCase()]}
                  onChange={(e) =>
                    handlePrincipleChange(principle.name, e.target.value)
                  }
                  className="min-h-[100px]"
                />
                {index < successPrinciples.length - 1 && (
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
