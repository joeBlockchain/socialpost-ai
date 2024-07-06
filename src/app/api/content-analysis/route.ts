import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  console.log("calling POST /api/content-analysis");
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

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
      max_tokens: 1000,
      temperature: 0.5,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an AI assistant tasked with analyzing content for a blog post. Please review the following files and provide:
              1. A concise description of the overall content (max 200 words).
              2. 5 unique ideas for blog posts based on this content.

              Here are the files:

              ${referenceFilesContent}

              Please format your response as follows:

              <jsonResponse>
              {
                "contentDescription": "Your concise description here",
                "blogIdeas": [
                  {
                    "title": "First blog post title",
                    "coreMessage": "Core message for the first blog post"
                  },
                  {
                    "title": "Second blog post title",
                    "coreMessage": "Core message for the second blog post"
                  },
                  {
                    "title": "Third blog post title",
                    "coreMessage": "Core message for the third blog post"
                  },
                  {
                    "title": "Fourth blog post title",
                    "coreMessage": "Core message for the fourth blog post"
                  },
                  {
                    "title": "Fifth blog post title",
                    "coreMessage": "Core message for the fifth blog post"
                  }
                ]
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

    // Extract the jsonResponse and error
    const jsonResponse = response
      .match(/<jsonResponse>([\s\S]*?)<\/jsonResponse>/)?.[1]
      .trim();

    const errorResponse = response
      .match(/<errorResponse>([\s\S]*?)<\/errorResponse>/)?.[1]
      .trim();

    return NextResponse.json(
      {
        jsonResponse: jsonResponse,
        errorResponse: errorResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
