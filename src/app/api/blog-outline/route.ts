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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const readerObjectiveData: ReaderObjectiveData = JSON.parse(
      formData.get("readerObjectiveData") as string
    );
    const selectedBlogIdea: BlogIdea = JSON.parse(
      formData.get("selectedBlogIdea") as string
    );
    const contentDescription = formData.get("contentDescription") as string;

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

    console.log("referenceFilesContent", referenceFilesContent);
    console.log("contentDescription", contentDescription);
    console.log("selectedBlogIdea.title", selectedBlogIdea.title);
    console.log("selectedBlogIdea.description", selectedBlogIdea.description);
    console.log(JSON.stringify(readerObjectiveData, null, 2));

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1500,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an AI assistant tasked with creating a blog outline based on the provided content, reader objective data, and core message. Generate an outline with 5 sections, including an introduction and conclusion. For each section, provide a title, description, and placeholder example. Here's the input:

Reference Files:
${referenceFilesContent}

Content Description:
${contentDescription}

Selected Blog Idea:
Title: ${selectedBlogIdea.title}
Description: ${selectedBlogIdea.description}

Reader Objective Data following the target audience and blog goals. This is who our audience is, and they should gain from our content and also the author's motivation and goals for reaching out to them:
Target Audience: ${readerObjectiveData.targetAudience.value}
Target Audience Rationale: ${readerObjectiveData.targetAudience.rationale}
Audience Goals: ${readerObjectiveData.audienceGoals.value}
Audience Goals Rationale: ${readerObjectiveData.audienceGoals.rationale}
Blog Goals: ${readerObjectiveData.blogGoals.value}
Blog Goals Rationale: ${readerObjectiveData.blogGoals.rationale}

Please provide your outline in the following JSON format:

<jsonResponse>
{
  "blogSections": [
    {
      "header": "Section header",
      "description": "detailed description in outline format of the section's purpose and content",
    },
  ]
}
</jsonResponse>

Ensure that the outline is tailored to the target audience, aligns with the stated goals, and incorporates elements from the core message. The sections should flow logically and tell a compelling story about the SaaS development journey.

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

    // Extract the jsonResponse and error
    const jsonResponse = response
      .match(/<jsonResponse>([\s\S]*?)<\/jsonResponse>/)?.[1]
      .trim();

    const errorResponse = response
      .match(/<errorResponse>([\s\S]*?)<\/errorResponse>/)?.[1]
      .trim();

    if (jsonResponse) {
      const outlineData = JSON.parse(jsonResponse);
      return NextResponse.json(
        {
          outlineData,
          usage: msg.usage, //return usage for input and output tokens
        },
        { status: 200 }
      );
    } else if (errorResponse) {
      return NextResponse.json(
        {
          errorResponse,
          usage: msg.usage, //return usage for input and output tokens
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
