"use client";

import { useState } from "react";

import ProvideRefContent from "./provide-ref-content";
import CustomInstructions from "./custom-instructions";
import ReaderObjectiveAnalyzer from "./reader-objective-analyzer";
import CoreMessageCrafter from "./core-message-crafter";
import EngagementOptimization from "./engagement-optimization";
import BlogOutline from "./blog-outline";
import BlogDraft from "./blog-draft";

export default function CreateBlogPost() {
  const [files, setFiles] = useState<File[]>([]);

  const handleCustomInstructions = (instructions: string) => {
    // Handle the submitted instructions, e.g., store them in state
    console.log("Custom instructions:", instructions);
    // Move to the next step
  };

  const handleReaderObjectiveAnalyzerSubmit = (data: {
    targetAudience: string;
    audienceGoals: string;
    blogGoals: string;
  }) => {
    console.log("Audience and Goals:", data);
    // Store the selections and move to the next step
  };

  const handleCoreMessageSubmit = (coreMessage: Record<string, string>) => {
    console.log("Core Message:", coreMessage);
    // Store the core message and move to the next step
  };

  const handleBlogStructureSubmit = (coreMessage: Record<string, string>) => {
    console.log("Core Message:", coreMessage);
    // Store the core message and move to the next step
  };

  const handleBlogOutlineSubmit = (coreMessage: Record<string, string>) => {
    console.log("Core Message:", coreMessage);
    // Store the core message and move to the next step
  };

  return (
    <main className="space-y-5">
      <div className="flex flex-row space-x-4 w-full">
        <div className="flex h-8 w-8 border border-border rounded-full items-center justify-center">
          <span className="">1</span>
        </div>
        <ProvideRefContent files={files} setFiles={setFiles} />
      </div>
      <div className="flex flex-row space-x-4 w-full">
        <div className="flex h-8 w-8 border border-border rounded-full items-center justify-center">
          <span className="">2</span>
        </div>
        <CustomInstructions onSubmit={handleCustomInstructions} />
      </div>
      <div className="flex flex-row space-x-4 w-full">
        <div className="flex h-8 w-8 border border-border rounded-full items-center justify-center">
          <span className="">3</span>
        </div>
        <ReaderObjectiveAnalyzer
          onSubmit={handleReaderObjectiveAnalyzerSubmit}
        />
      </div>
      <div className="flex flex-row space-x-4 w-full">
        <div className="flex h-8 w-8 border border-border rounded-full items-center justify-center">
          <span className="">4</span>
        </div>
        <CoreMessageCrafter onSubmit={handleCoreMessageSubmit} />
      </div>
      <div className="flex flex-row space-x-4 w-full">
        <div className="flex h-8 w-8 border border-border rounded-full items-center justify-center">
          <span className="">5</span>
        </div>
        <BlogOutline onSubmit={handleBlogOutlineSubmit} />
      </div>
      <div className="flex flex-row space-x-4 w-full">
        <div className="flex h-8 w-8 border border-border rounded-full items-center justify-center">
          <span className="">6</span>
        </div>
        <BlogDraft onSubmit={handleBlogStructureSubmit} />
      </div>
      <div className="flex flex-row space-x-4 w-full">
        <div className="flex h-8 w-8 border border-border rounded-full items-center justify-center">
          <span className="">6</span>
        </div>
        <EngagementOptimization />
      </div>
    </main>
  );
}
