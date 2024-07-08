import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

interface ReaderObjectiveData {
  targetAudience: {
    value: string;
    rationale: string;
  };
  audienceGoals: {
    value: string;
    rationale: string;
  };
  blogGoals: {
    value: string;
    rationale: string;
  };
}

interface BlogIdea {
  title: string;
  description: string;
}

interface BlogSection {
  title: string;
  description: string;
  content: string;
}

export async function POST(req: NextRequest) {
  console.log("calling POST /api/blog-draft-section");
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const contentDescription = formData.get("contentDescription") as string;
    const selectedBlogIdea: BlogIdea = JSON.parse(
      formData.get("selectedBlogIdea") as string
    );
    const readerObjectiveData = JSON.parse(
      formData.get("readerObjectiveData") as string
    );
    const blogOutline = JSON.parse(formData.get("blogOutline") as string);
    const completedSections = JSON.parse(
      formData.get("completedSections") as string
    );
    const currentSectionIndex = parseInt(
      formData.get("currentSectionIndex") as string
    );

    // Process files and extract their content
    const fileContents = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        const content = new TextDecoder().decode(buffer);
        return { name: file.name, content };
      })
    );

    // Prepare the reference files content for Claude
    const referenceFilesContent = fileContents
      .map((file) => `File: ${file.name}\n\n${file.content}\n\n`)
      .join("");

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const currentSection = Object.keys(blogOutline)[currentSectionIndex];
    const currentSectionContent = blogOutline[currentSection];

    console.log("referenceFilesContent", referenceFilesContent);
    console.log("contentDescription", contentDescription);
    console.log("selectedBlogIdea.title", selectedBlogIdea.title);
    console.log("selectedBlogIdea.description", selectedBlogIdea.description);
    console.log(`Target Audience: ${readerObjectiveData.targetAudience.value}
Target Audience Rationale: ${readerObjectiveData.targetAudience.rationale}
Audience Goals: ${readerObjectiveData.audienceGoals.value}
Audience Goals Rationale: ${readerObjectiveData.audienceGoals.rationale}
Blog Goals: ${readerObjectiveData.blogGoals.value}
Blog Goals Rationale: ${readerObjectiveData.blogGoals.rationale}`);
    console.log("blogOutline", JSON.stringify(blogOutline));

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1000,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an AI assistant tasked with writing a section of a blog post. Here's the current context:

              Reference Files:
              ${referenceFilesContent}
              
              Content Description:
              ${contentDescription}
              
              Selected Blog Idea:
              Title: ${selectedBlogIdea.title}
              Description: ${selectedBlogIdea.description}

              Target Audience: ${readerObjectiveData.targetAudience.value}
              Target Audience Rationale: ${
                readerObjectiveData.targetAudience.rationale
              }
              Audience Goals: ${readerObjectiveData.audienceGoals.value}
              Audience Goals Rationale: ${
                readerObjectiveData.audienceGoals.rationale
              }
              Blog Goals: ${readerObjectiveData.blogGoals.value}
              Blog Goals Rationale: ${readerObjectiveData.blogGoals.rationale}

Blog Outline:
${JSON.stringify(blogOutline, null, 2)}

Completed Sections:
${JSON.stringify(completedSections, null, 2)}

Current Section:
${currentSection}: ${currentSectionContent}

Please write the content for the current section (index ${currentSectionIndex}). Use the section's title and description as a guide, and ensure it flows well with the previously completed sections. The content should be engaging, informative, and tailored to the blog's target audience. Incorporate relevant information from the reference files, align with the reader objectives, and reflect the core message.

Provide your response in the following JSON format:

<jsonResponse>
{
  "sectionContent": "The generated content for the section goes here."
}
</jsonResponse>

<errorResponse>
If there is an issue following the instructions, please provide the reason you cannot comply within this error tag.
</errorResponse>
`,
            },
          ],
        },
      ],
    });

    // Extract the JSON data from Claude's response
    const response = msg.content[0].type === "text" ? msg.content[0].text : "";

    // Extract the sectionContent directly using regex
    const sectionContentMatch = response.match(
      /<jsonResponse>\s*{\s*"sectionContent":\s*"([\s\S]*?)"\s*}\s*<\/jsonResponse>/
    );
    const sectionContent = sectionContentMatch
      ? sectionContentMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"')
      : null;

    // Extract any error response
    const errorResponse =
      response
        .match(/<errorResponse>([\s\S]*?)<\/errorResponse>/)?.[1]
        ?.trim() || null;

    if (sectionContent) {
      return NextResponse.json(
        {
          sectionContent,
          errorResponse,
          usage: msg.usage, //return usage for input and output tokens
        },
        { status: 200 }
      );
    } else {
      console.error(
        "Failed to extract section content from response:",
        response
      );
      return NextResponse.json(
        { error: "Failed to generate blog section content", errorResponse },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
