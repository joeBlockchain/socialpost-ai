"use client";

import { useState } from "react";
import ProvideRefContent from "./provide-ref-content";
import ContentAnalyzer from "./content-analyzer";
import ReaderObjectiveAnalyzer from "./reader-objective-analyzer";
import CoreMessageCrafter from "./core-message-crafter";
import BlogOutline from "./blog-outline";
import BlogDraft from "./blog-draft";
import BlogPreview from "./blog-preview";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

interface BlogIdea {
  title: string;
  description: string;
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
  targetAudience: string;
  audienceGoals: string;
  blogGoals: string;
}

interface BlogSection {
  header: string;
  description: string;
}

export default function CreateBlogPost() {
  const { toast } = useToast();
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
  const [showPreview, setShowPreview] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertDialogContent, setAlertDialogContent] = useState({
    title: "",
    description: "",
  });

  const [contentAnalysis, setContentAnalysis] = useState<{
    contentDescription: string;
    selectedBlogIdea: string;
  } | null>(null);
  const [contentDescription, setContentDescription] = useState("");
  const [blogIdeas, setBlogIdeas] = useState<BlogIdea[]>([]);
  const [selectedBlogIdea, setSelectedBlogIdea] = useState<BlogIdea | null>(
    null
  );

  const handleContentAnalysis = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    showFetchStartToast("Fetching content analysis...");
    try {
      const response = await fetch("/api/content-analysis", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        handleApiError(response);
        throw new Error("Failed to fetch content analysis");
      }

      const data = await response.json();
      if (data.jsonResponse) {
        const parsedResponse = JSON.parse(data.jsonResponse);
        setContentDescription(parsedResponse.contentDescription);
        setBlogIdeas(parsedResponse.blogIdeas);
        setSelectedBlogIdea(parsedResponse.blogIdeas[0] || null);
        showFetchEndToast("Content analysis fetched successfully!");
        return parsedResponse;
      } else if (data.errorResponse) {
        console.log("Error in fetchContentAnalysis:", data.errorResponse);
        toast({
          title: "Woops!",
          description: data.errorResponse,
        });
      }
    } catch (error) {
      console.error("Error in handleContentAnalysis:", error);
      showFetchEndToast("Error fetching content analysis");
    }
  };

  const handleContentAnalyzerSubmit = async (
    contentDescription: string,
    selectedBlogIdea: BlogIdea
  ) => {
    setContentDescription(contentDescription);
    setSelectedBlogIdea(selectedBlogIdea);
    // You can add logic here to move to the next step or update other states
    await fetchBlogStrategy(null, selectedBlogIdea, contentDescription);
  };

  const fetchBlogStrategy = async (
    currentData: TargetAudienceData | null,
    selectedBlogIdea: BlogIdea,
    contentDescription: string
  ) => {
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
    formData.append("selectedBlogIdea", JSON.stringify(selectedBlogIdea));
    formData.append("contentDescription", contentDescription);
    showFetchStartToast("Fetching blog strategy...");

    try {
      const res = await fetch("/api/reader-objective", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        handleApiError(res);
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
        showFetchEndToast("Blog strategy fetched successfully!");
      } else if (data.errorResponse) {
        console.log("Error in fetchBlogStrategy:");
        toast({
          title: "Woops!",
          description: data.errorResponse,
        });
      }
    } catch (err) {
      console.error("Error in fetchBlogStrategy:", err);
      showFetchEndToast("Error fetching blog strategy");
    }
  };

  const handleSubmitRefContent = async () => {
    await handleContentAnalysis();
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
    formData.append("contentDescription", contentDescription);
    formData.append("selectedBlogIdea", JSON.stringify(selectedBlogIdea));

    showFetchStartToast("Fetching core message...");
    try {
      const res = await fetch("/api/core-message", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        handleApiError(res);
        throw new Error("Failed to fetch core message data");
      }

      const data = await res.json();
      setCoreMessageData(data.coreMessageData);
      showFetchEndToast("Core message fetched successfully!");
      if (data.errorResponse) {
        toast({
          title: "Woops!",
          description: data.errorResponse,
        });
      }
    } catch (err) {
      console.error("Error in fetchCoreMessageData:", err);
      showFetchEndToast("Error fetching core message");
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

    showFetchStartToast("Fetching blog outline...");
    try {
      const res = await fetch("/api/blog-outline", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        handleApiError(res);
        throw new Error("Failed to fetch blog outline");
      }

      const data = await res.json();

      if (data) {
        setBlogOutlineData(data.outlineData.blogSections);
        showFetchEndToast("Blog outline fetched successfully!");
      }

      if (data.errorResponse) {
        toast({
          title: "Woops!",
          description: data.errorResponse,
        });
      }
    } catch (err) {
      console.error("Error in fetchBlogOutline:", err);
      showFetchEndToast("Error fetching blog outline");
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
    const totalSections = Object.keys(outlineData).length;
    const currentSection = sectionIndex + 1;

    showFetchStartToast("Fetching blog draft section...");
    try {
      const res = await fetch("/api/blog-draft-section", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        handleApiError(res);
        throw new Error("Failed to fetch blog section");
      }

      const data = await res.json();

      const sectionHeader = Object.keys(outlineData)[sectionIndex];
      const newSection = {
        header: sectionHeader,
        content: data.sectionContent,
      };

      // Update blogDraft state
      setBlogDraft((prev) => ({
        ...prev,
        [sectionHeader]: data.sectionContent,
      }));

      // Update blogSections state for real-time preview
      setBlogSections((prev) => [...prev, newSection]);
      showFetchEndToast(
        `Blog section ${currentSection} of ${totalSections} fetched successfully!`
      );

      // If there are more sections, fetch the next one
      if (sectionIndex < Object.keys(outlineData).length - 1) {
        await fetchBlogDraftSection(sectionIndex + 1, outlineData);
      } else {
        showFetchEndToast("All blog draft sections fetched successfully!");
      }

      if (data.errorResponse) {
        console.log("Error in fetchBlogStrategy:");
        toast({
          title: "Woops!",
          description: data.errorResponse,
        });
      }
    } catch (err) {
      console.error("Error in fetchBlogDraftSection:", err);
      showFetchEndToast(
        `Failed to fetch blog draft section ${sectionIndex + 1}.`
      );
    }
  };

  const handleBlogDraftSubmit = (draftData: Record<string, string>) => {
    // const newSections = Object.entries(draftData).map(([header, content]) => ({
    //   header,
    //   content,
    // }));
    // setBlogSections(newSections);
    setShowPreview(true);
    console.log("Blog Draft:", draftData);
    // Move to the next step (e.g., engagement optimization)
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const handleBlogStructureSubmit = (coreMessage: Record<string, string>) => {
    console.log("Core Message:", coreMessage);
    // Store the core message and move to the next step
  };

  const handleApiError = (error: any) => {
    console.error("API Error:", error);
    if (error.status === 401) {
      setAlertDialogContent({
        title: "Whoops!",
        description:
          "We need to make sure you're a real person and not a sneaky bot. Mind signing in to prove you're not made of circuits?",
      });
    } else {
      setAlertDialogContent({
        title: "Error",
        description: error.statusText || "An unexpected error occurred.",
      });
    }
    setAlertDialogOpen(true);
  };

  const showFetchStartToast = (message: string) => {
    toast({
      title: "Fetching Data",
      description: message,
    });
  };

  const showFetchEndToast = (message: string) => {
    toast({
      title: "Fetch Complete",
      description: message,
    });
  };

  return (
    <main className="flex flex-col md:flex-row gap-4 pb-10">
      <div
        className={`flex flex-col space-y-5 max-w-2xl md:max-w-lg ${
          showPreview ? "hidden md:flex" : "flex"
        }`}
      >
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
          <ContentAnalyzer
            onSubmit={handleContentAnalyzerSubmit}
            onAnalyze={handleContentAnalysis}
            contentDescription={contentDescription}
            setContentDescription={setContentDescription}
            blogIdeas={blogIdeas}
            selectedBlogIdea={selectedBlogIdea}
            setSelectedBlogIdea={setSelectedBlogIdea}
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
            selectedBlogIdea={selectedBlogIdea}
            contentDescription={contentDescription}
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
          <BlogOutline
            onSubmit={handleBlogOutlineSubmit}
            blogSections={blogOutlineData || []}
          />
        </div>
        <div className="flex flex-row space-x-4 w-full">
          <div className="flex h-8 w-8 border border-border rounded-full items-center justify-center">
            <span className="">6</span>
          </div>
          <BlogDraft
            onSubmit={handleBlogDraftSubmit}
            blogSections={blogOutlineData || []}
            blogOutline={blogOutline}
            blogDraft={blogDraft}
          />
        </div>
      </div>
      <div
        className={`w-full md:min-w-96 ${
          showPreview ? "block" : "hidden md:block"
        }`}
      >
        <BlogPreview blogSections={blogSections} />
      </div>
      <Button
        onClick={togglePreview}
        className="md:hidden fixed bottom-4 right-4 "
      >
        {showPreview ? "Show Steps" : "Preview Blog"}
      </Button>
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertDialogContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertDialogContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlertDialogOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
