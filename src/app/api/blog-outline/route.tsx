import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

interface ReaderObjectiveData {
  targetAudience: string;
  audienceGoals: string;
  blogGoals: string;
}

interface CoreMessageData {
  simple: string;
  unexpected: string;
  concrete: string;
  credible: string;
  emotional: string;
  stories: string;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const readerObjectiveData: ReaderObjectiveData = JSON.parse(
      formData.get("readerObjectiveData") as string
    );
    const coreMessageData: CoreMessageData = JSON.parse(
      formData.get("coreMessageData") as string
    );

    // Process files and extract their content
    const fileContents = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        const content = new TextDecoder().decode(buffer);
        return { name: file.name, content };
      })
    );

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // Prepare the reference files content for Claude
    const referenceFilesContent = fileContents
      .map((file) => `File: ${file.name}\n\n${file.content}\n\n`)
      .join("");

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

Reader Objective Data:
${JSON.stringify(readerObjectiveData, null, 2)}

Core Message Data:
${JSON.stringify(coreMessageData, null, 2)}

Please provide your outline in the following JSON format:

<jsonResponse>
{
  "blogSections": [
    {
      "title": "Section Title",
      "description": "Brief description of the section's purpose and content",
      "placeholder": "Example or placeholder text for this section"
    },
    // ... (repeat for all 5 sections)
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
    console.log(response);

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
          errorResponse,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to generate blog outline" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
