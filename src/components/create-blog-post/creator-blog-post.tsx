"use client";

import { useState } from "react";
import ProvideRefContent from "./provide-ref-content";
import ContentAnalyzer from "./content-analyzer";
import ReaderObjectiveAnalyzer from "./reader-objective-analyzer";
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
import { ArrowLeft } from "lucide-react";

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
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [targetAudienceData, setTargetAudienceData] =
    useState<TargetAudienceData | null>(null);
  const [previousTargetAudiences, setPreviousTargetAudiences] = useState<
    TargetAudienceData[]
  >([]);
  const [readerObjectiveData, setReaderObjectiveData] =
    useState<ReaderObjectiveData | null>(null);
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
    await fetchBlogOutline();
  };

  const fetchBlogOutline = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("contentDescription", contentDescription);
    formData.append("selectedBlogIdea", JSON.stringify(selectedBlogIdea));
    formData.append("readerObjectiveData", JSON.stringify(readerObjectiveData));

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
    outlineData: Record<string, BlogSection>,
    singleSection: boolean = false
  ) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("readerObjectiveData", JSON.stringify(readerObjectiveData));

    formData.append("blogOutline", JSON.stringify(outlineData));
    formData.append("completedSections", JSON.stringify(blogDraft));
    formData.append("currentSectionIndex", sectionIndex.toString());
    const totalSections = Object.keys(outlineData).length;
    const currentSection = sectionIndex + 1;

    showFetchStartToast(`Fetching blog draft section ${currentSection}...`);
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
      setBlogSections((prev) => {
        const newSections = [...prev];
        const existingIndex = newSections.findIndex(
          (s) => s.header === sectionHeader
        );
        if (existingIndex !== -1) {
          newSections[existingIndex] = newSection;
        } else {
          newSections.push(newSection);
        }
        return newSections;
      });

      showFetchEndToast(
        `Blog section ${currentSection} of ${totalSections} fetched successfully!`
      );

      // If there are more sections and we're not in single section mode, fetch the next one
      if (
        !singleSection &&
        sectionIndex < Object.keys(outlineData).length - 1
      ) {
        await fetchBlogDraftSection(sectionIndex + 1, outlineData);
      } else if (singleSection) {
        showFetchEndToast("Section re-draft completed successfully!");
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

  const handleRequeryBlogDraft = async () => {
    await fetchBlogDraftSection(0, blogOutline, false);
  };

  const handleRequeryBlogDraftSection = async (sectionHeader: string) => {
    const sectionIndex = blogOutlineData?.findIndex(
      (section) => section.header === sectionHeader
    );

    if (sectionIndex !== undefined && sectionIndex !== -1) {
      await fetchBlogDraftSection(sectionIndex, blogOutline, true);
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

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <main className="flex flex-col md:flex-row gap-4 pb-10">
      <div
        className={`flex flex-col space-y-5 max-w-2xl md:max-w-lg ${
          showPreview ? "hidden md:flex" : "flex"
        }`}
      >
        {currentStep === 1 && (
          <StepWrapper stepNumber={1} onBack={handleBack}>
            <ProvideRefContent
              files={files}
              setFiles={setFiles}
              onSubmit={() => {
                handleSubmitRefContent();
                setCurrentStep(2);
              }}
            />
          </StepWrapper>
        )}
        {currentStep === 2 && (
          <StepWrapper stepNumber={2} onBack={handleBack}>
            <ContentAnalyzer
              onSubmit={(contentDescription, selectedBlogIdea) => {
                handleContentAnalyzerSubmit(
                  contentDescription,
                  selectedBlogIdea
                );
                setCurrentStep(3);
              }}
              onAnalyze={handleContentAnalysis}
              contentDescription={contentDescription}
              setContentDescription={setContentDescription}
              blogIdeas={blogIdeas}
              selectedBlogIdea={selectedBlogIdea}
              setSelectedBlogIdea={setSelectedBlogIdea}
            />
          </StepWrapper>
        )}
        {currentStep === 3 && (
          <StepWrapper stepNumber={3} onBack={handleBack}>
            <ReaderObjectiveAnalyzer
              onSubmit={(data) => {
                handleReaderObjectiveAnalyzerSubmit(data);
                setCurrentStep(4);
              }}
              targetAudienceData={targetAudienceData}
              fetchBlogStrategy={fetchBlogStrategy}
              selectedBlogIdea={selectedBlogIdea}
              contentDescription={contentDescription}
            />
          </StepWrapper>
        )}
        {currentStep === 4 && (
          <StepWrapper stepNumber={4} onBack={handleBack}>
            <BlogOutline
              onSubmit={(outlineData) => {
                handleBlogOutlineSubmit(outlineData);
                setCurrentStep(5);
              }}
              onRequery={fetchBlogOutline}
              blogSections={blogOutlineData || []}
            />
          </StepWrapper>
        )}
        {currentStep === 5 && (
          <StepWrapper stepNumber={5} onBack={handleBack}>
            <BlogDraft
              onSubmit={handleBlogDraftSubmit}
              onRequery={handleRequeryBlogDraft}
              onRequerySection={handleRequeryBlogDraftSection}
              blogSections={blogOutlineData || []}
              blogOutline={blogOutline}
              blogDraft={blogDraft}
            />
          </StepWrapper>
        )}
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

const StepWrapper: React.FC<{
  stepNumber: number;
  onBack: () => void;
  children: React.ReactNode;
}> = ({ stepNumber, onBack, children }) => (
  <div className="relative flex flex-row items-start space-x-4 w-full">
    <div className="flex flex-row space-x-4 items-center mb-4">
      <div className="flex h-8 w-8 border border-border rounded-full items-center justify-center">
        <span>{stepNumber}</span>
      </div>
    </div>
    {children}
    {stepNumber > 1 && (
      <Button
        variant="secondary"
        onClick={onBack}
        className="absolute left-14 bottom-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
    )}
  </div>
);
