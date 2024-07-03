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
    description:
      "Strip an idea to its core. Find the most essential concept and express it succinctly.",
    placeholder: "'Freedom is the power to choose our own chains.'",
  },
  {
    name: "Unexpected",
    description:
      "Grab people's attention by surprising them. Break a pattern or defy expectations.",
    placeholder:
      "'The most important scientific revolutions all include, as their only common feature, the dethronement of human arrogance from one pedestal after another of previous convictions about our centrality in the cosmos.'",
  },
  {
    name: "Concrete",
    description:
      "Make ideas clear by explaining them in terms of human actions and sensory information.",
    placeholder: "'Put your money where your mouth is.'",
  },
  {
    name: "Credible",
    description:
      "Help people believe and agree with your ideas using supportive evidence or authorities.",
    placeholder:
      "'A Cornell University study found that people eat 22% more when using a 12-inch plate instead of a 10-inch plate.'",
  },
  {
    name: "Emotional",
    description:
      "Make people care about your ideas by appealing to things that matter to them.",
    placeholder:
      "'If we don't act now, by the time today's children are middle-aged, the rainforests will be gone.'",
  },
  {
    name: "Stories",
    description:
      "Use narratives to inspire and motivate people to act on your ideas.",
    placeholder:
      "'In 1975, a young man dropped out of Harvard to start a company in his garage. That company became Microsoft, and that man was Bill Gates.'",
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
              <AccordionContent className="ml-4">
                <p className="mb-2 text-base">{principle.description}</p>
                <Textarea
                  value={principles[principle.name.toLowerCase()]}
                  onChange={(e) =>
                    handlePrincipleChange(principle.name, e.target.value)
                  }
                  className="min-h-[100px]"
                />

                <p className="mt-2 text-sm text-muted-foreground">
                  <strong>Example:</strong> {principle.placeholder}
                </p>

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
