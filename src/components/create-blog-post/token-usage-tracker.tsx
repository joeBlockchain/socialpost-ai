"use client";

import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { CircleHelp, HelpCircle, Info } from "lucide-react";
import { Label } from "../ui/label";

interface TokenUsage {
  input_tokens: number;
  output_tokens: number;
}

// Cost constants (in dollars per million tokens)
const INPUT_TOKEN_COST = 3;
const OUTPUT_TOKEN_COST = 15;

export default function TokenUsageTracker() {
  const [totalUsage, setTotalUsage] = useState<TokenUsage>({
    input_tokens: 0,
    output_tokens: 0,
  });
  const [showCost, setShowCost] = useState(false);

  useEffect(() => {
    const handleTokenUsageUpdate = (event: CustomEvent<TokenUsage>) => {
      setTotalUsage((prev) => ({
        input_tokens: prev.input_tokens + event.detail.input_tokens,
        output_tokens: prev.output_tokens + event.detail.output_tokens,
      }));
    };

    window.addEventListener(
      "tokenUsageUpdate" as any,
      handleTokenUsageUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "tokenUsageUpdate" as any,
        handleTokenUsageUpdate as EventListener
      );
    };
  }, []);

  const calculateCost = (tokens: number, costPerMillion: number) => {
    return (tokens / 1000000) * costPerMillion;
  };

  const inputCost = calculateCost(totalUsage.input_tokens, INPUT_TOKEN_COST);
  const outputCost = calculateCost(totalUsage.output_tokens, OUTPUT_TOKEN_COST);
  const totalCost = inputCost + outputCost;

  return (
    <div className="flex flex-row items-center p-1 bg-background border border-border rounded-lg">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowCost(!showCost)}
        className="h-6 mr-2"
      >
        {showCost ? "Cost" : "Tokens"}
      </Button>
      {showCost ? (
        <div className="flex flex-row items-center mr-1">
          <Popover>
            <PopoverTrigger className="flex flex-row space-x-3 items-center">
              <p className="text-sm">${totalCost.toFixed(4)}</p>

              <HelpCircle
                strokeWidth={1}
                className="w-5 h-5 ml-2 text-muted-foreground"
              />
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              <p className="text-sm">Input: ${inputCost.toFixed(4)}</p>
              <p className="text-sm">Output: ${outputCost.toFixed(4)}</p>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <div className="flex flex-row items-center mr-1">
          <Popover>
            <PopoverTrigger className="flex flex-row space-x-3 items-center">
              <p className="text-sm">
                {(
                  totalUsage.input_tokens + totalUsage.output_tokens
                ).toLocaleString()}
              </p>
              <HelpCircle
                strokeWidth={1}
                className="w-5 h-5 ml-2 text-muted-foreground"
              />
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              <p className="text-sm">
                <span className="mr-2">Input:</span>
                {totalUsage.input_tokens.toLocaleString()}
              </p>

              <p className="text-sm">
                <span className="mr-2">Output:</span>
                {totalUsage.output_tokens.toLocaleString()}
              </p>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
