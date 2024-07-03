"use client";

import { useState } from "react";
import ProvideRefContent from "./provide-ref-content";
import ReaderObjectiveAnalyzer from "./reader-objective-analyzer";
import CoreMessageCrafter from "./core-message-crafter";
import BlogOutline from "./blog-outline";
import BlogDraft from "./blog-draft";
import BlogPreview from "./blog-preview";
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

interface ReaderObjectiveData {
  targetAudience: string;
  audienceGoals: string;
  blogGoals: string;
}

interface BlogSection {
  header: string;
  description: string;
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
  const [blogOutlineData, setBlogOutlineData] = useState<BlogSection[] | null>(
    null
  );
  const [blogOutline, setBlogOutline] = useState<Record<string, BlogSection>>(
    {}
  );
  const [blogDraft, setBlogDraft] = useState<Record<string, string>>({});
  const [blogSections, setBlogSections] = useState<
    Array<{ header: string; content: string }>
  >([]);

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

    try {
      const res = await fetch("/api/reader-objective", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Failed to fetch blog strategy");
      }

      const data = await res.json();

      if (data.jsonResponse) {
        const parsedResponse: TargetAudienceData = JSON.parse(
          data.jsonResponse
        );
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

  const handleCoreMessageSubmit = async (
    coreMessage: Record<string, string>
  ) => {
    setCoreMessageData(coreMessage);
    await fetchBlogOutline(coreMessage);
  };

  const fetchBlogOutline = async (coreMessage: Record<string, string>) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("readerObjectiveData", JSON.stringify(readerObjectiveData));
    formData.append("coreMessageData", JSON.stringify(coreMessage));

    try {
      const res = await fetch("/api/blog-outline", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Failed to fetch blog outline");
      }

      const data = await res.json();
      setBlogOutlineData(data.outlineData.blogSections);
    } catch (err) {
      console.error("Error in fetchBlogOutline:", err);
    }
  };

  const handleBlogOutlineSubmit = async (
    outlineData: Record<string, BlogSection>
  ) => {
    setBlogOutline(outlineData);

    // Start drafting the first section
    await fetchBlogDraftSection(0, outlineData);
  };

  const fetchBlogDraftSection = async (
    sectionIndex: number,
    outlineData: Record<string, BlogSection>
  ) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("readerObjectiveData", JSON.stringify(readerObjectiveData));
    formData.append("coreMessageData", JSON.stringify(coreMessageData));
    formData.append("blogOutline", JSON.stringify(outlineData));
    formData.append("completedSections", JSON.stringify({})); // Initially empty
    formData.append("currentSectionIndex", sectionIndex.toString());

    try {
      const response = await fetch("/api/blog-draft-section", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch blog section");
      }

      const data = await response.json();

      // Update the blog draft state with the new section
      setBlogDraft((prev) => ({
        ...prev,
        [Object.keys(outlineData)[sectionIndex]]: data.sectionContent,
      }));

      // If there are more sections, fetch the next one
      if (sectionIndex < Object.keys(outlineData).length - 1) {
        await fetchBlogDraftSection(sectionIndex + 1, outlineData);
      }
    } catch (error) {
      console.error("Error fetching blog section:", error);
    }
  };

  const handleBlogDraftSubmit = (draftData: Record<string, string>) => {
    const newSections = Object.entries(draftData).map(([header, content]) => ({
      header,
      content,
    }));
    setBlogSections(newSections);
    console.log("Blog Draft:", draftData);
    // Move to the next step (e.g., engagement optimization)
  };

  const handleBlogStructureSubmit = (coreMessage: Record<string, string>) => {
    console.log("Core Message:", coreMessage);
    // Store the core message and move to the next step
  };

  return (
    <main className="space-y-5 pb-10">
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
          <span className="">2</span>
        </div>
        <ReaderObjectiveAnalyzer
          onSubmit={handleReaderObjectiveAnalyzerSubmit}
          targetAudienceData={targetAudienceData}
          fetchBlogStrategy={fetchBlogStrategy}
        />
      </div>
      <div className="flex flex-row space-x-4 w-full">
        <div className="flex h-8 w-8 border border-border rounded-full items-center justify-center">
          <span className="">3</span>
        </div>
        <CoreMessageCrafter
          onSubmit={handleCoreMessageSubmit}
          aiGeneratedContent={coreMessageData}
        />
      </div>
      <div className="flex flex-row space-x-4 w-full">
        <div className="flex h-8 w-8 border border-border rounded-full items-center justify-center">
          <span className="">4</span>
        </div>
        <BlogOutline
          onSubmit={handleBlogOutlineSubmit}
          blogSections={blogOutlineData || []}
        />
      </div>
      <div className="flex flex-row space-x-4 w-full">
        <div className="flex h-8 w-8 border border-border rounded-full items-center justify-center">
          <span className="">5</span>
        </div>
        <BlogDraft
          onSubmit={handleBlogDraftSubmit}
          blogSections={blogOutlineData || []}
          blogOutline={blogOutline}
          blogDraft={blogDraft}
        />
      </div>
      <BlogPreview blogSections={blogSections} />
    </main>
  );
}
