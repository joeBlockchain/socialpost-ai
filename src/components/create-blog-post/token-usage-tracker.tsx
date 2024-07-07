"use client";

import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";

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
    <div className="flex flex-row items-center p-0">
      <Button
        variant="ghost"
        onClick={() => setShowCost(!showCost)}
        className=""
      >
        {showCost ? "Cost" : "Tokens"}
      </Button>
      {showCost ? (
        <div className="flex flex-row items-center">
          <Popover>
            <PopoverTrigger>
              <p className="text-sm">${totalCost.toFixed(4)}</p>
            </PopoverTrigger>
            <PopoverContent className="">
              <p className="text-sm">Input: ${inputCost.toFixed(4)}</p>
              <p className="text-sm">Output: ${outputCost.toFixed(4)}</p>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <div className="flex flex-row items-center">
          <Popover>
            <PopoverTrigger>
              <p className="text-sm">
                {(
                  totalUsage.input_tokens + totalUsage.output_tokens
                ).toLocaleString()}
              </p>
            </PopoverTrigger>
            <PopoverContent>
              <p className="text-sm">
                Input: {totalUsage.input_tokens.toLocaleString()}
              </p>
              <p className="text-sm">
                Output: {totalUsage.output_tokens.toLocaleString()}
              </p>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
