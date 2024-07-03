"use client";

import { useState } from "react";
import ProvideRefContent from "./provide-ref-content";
import ReaderObjectiveAnalyzer from "./reader-objective-analyzer";
import CoreMessageCrafter from "./core-message-crafter";
import EngagementOptimization from "./engagement-optimization";
import BlogOutline from "./blog-outline";
import BlogDraft from "./blog-draft";

// Add this interface
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

export default function CreateBlogPost() {
  const [files, setFiles] = useState<File[]>([]);
  const [targetAudienceData, setTargetAudienceData] =
    useState<TargetAudienceData | null>(null);
  const [previousTargetAudiences, setPreviousTargetAudiences] = useState<
    TargetAudienceData[]
  >([]);
  const [readerObjectiveData, setReaderObjectiveData] =
    useState<ReaderObjectiveData | null>(null);
  const [coreMessageData, setCoreMessageData] = useState<Record<
    string,
    string
  > | null>(null);

  const fetchBlogStrategy = async (currentData: TargetAudienceData | null) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    // Send all previous target audiences, including the current one
    const allTargetAudiences = currentData
      ? [...previousTargetAudiences, currentData]
      : previousTargetAudiences;

    formData.append(
      "previousTargetAudiences",
      JSON.stringify(allTargetAudiences)
    );

    console.log("called fetchBlogStrategy");
    try {
      const res = await fetch("/api/reader-objective", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Failed to fetch blog strategy");
      }

      const data = await res.json();
      console.log("JSON Response:", data.jsonResponse);
      console.log("Error Response:", data.errorResponse);

      if (data.jsonResponse) {
        const parsedResponse: TargetAudienceData = JSON.parse(
          data.jsonResponse
        );
        console.log("Parsed JSON Response:", parsedResponse);
        setTargetAudienceData(parsedResponse);

        // Add the new target audience to the previous ones
        setPreviousTargetAudiences((prev) => [...prev, parsedResponse]);
      }
    } catch (err) {
      console.error("Error in fetchBlogStrategy:", err);
    }
  };

  const handleSubmitRefContent = async () => {
    await fetchBlogStrategy(null);
  };

  const handleReaderObjectiveAnalyzerSubmit = async (
    data: ReaderObjectiveData
  ) => {
    setReaderObjectiveData(data);
    await fetchCoreMessageData(data);
  };

  const fetchCoreMessageData = async (
    readerObjectiveData: ReaderObjectiveData
  ) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("readerObjectiveData", JSON.stringify(readerObjectiveData));

    try {
      const res = await fetch("/api/core-message", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Failed to fetch core message data");
      }

      const data = await res.json();
      setCoreMessageData(data.coreMessageData);
    } catch (err) {
      console.error("Error in fetchCoreMessageData:", err);
    }
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
        <ProvideRefContent
          files={files}
          setFiles={setFiles}
          onSubmit={handleSubmitRefContent}
        />
      </div>
      <div className="flex flex-row space-x-4 w-full">
        <div className="flex h-8 w-8 border border-border rounded-full items-center justify-center">
          <span className="">3</span>
        </div>
        <ReaderObjectiveAnalyzer
          onSubmit={handleReaderObjectiveAnalyzerSubmit}
          targetAudienceData={targetAudienceData}
          fetchBlogStrategy={fetchBlogStrategy}
        />
      </div>
      <div className="flex flex-row space-x-4 w-full">
        <div className="flex h-8 w-8 border border-border rounded-full items-center justify-center">
          <span className="">4</span>
        </div>
        <CoreMessageCrafter
          onSubmit={handleCoreMessageSubmit}
          aiGeneratedContent={coreMessageData}
        />
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
