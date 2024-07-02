import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface CustomInstructionsProps {
  onSubmit: (instructions: string) => void;
}

export default function CustomInstructions({
  onSubmit,
}: CustomInstructionsProps) {
  const [instructions, setInstructions] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(instructions);
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Set Custom Instructions</CardTitle>
          <CardDescription>
            Provide instructions for the AI to process your uploaded files.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter your instructions here..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="min-h-[200px]"
          />
        </CardContent>
        <CardFooter>
          <Button variant="secondary" type="submit">
            Submit
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
