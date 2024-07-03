import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

interface ReaderObjectiveData {
  targetAudience: string;
  audienceGoals: string;
  blogGoals: string;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const readerObjectiveData: ReaderObjectiveData = JSON.parse(
      formData.get("readerObjectiveData") as string
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
      max_tokens: 1000,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an AI assistant tasked with helping a user craft the core message for their blog post using the SUCCESs principles from "Made to Stick". Based on the provided content and reader objective data, generate suggestions for each principle. Here's the input:

                Reference Files:
                ${referenceFilesContent}

                Reader Objective Data:
                Target Audience: ${readerObjectiveData.targetAudience}
                Audience Goals: ${readerObjectiveData.audienceGoals}
                Blog Goals: ${readerObjectiveData.blogGoals}

                Please provide your suggestions in the following JSON format:

                <jsonResponse>
                {
                "simple": "A concise, core message for the SaaS creation journey",
                "unexpected": "A surprising element or unconventional choice in the process",
                "concrete": "A tangible step or real-world example from the SaaS development",
                "credible": "A statement highlighting the developer's expertise or unique insights",
                "emotional": "A description of an emotional moment in the development journey",
                "stories": "A narrative hook or story element from the developer's experience"
                }
                </jsonResponse>

                Ensure that your suggestions are tailored to the target audience and align with the stated audience and blog goals. Each suggestion should be a complete sentence or short paragraph, ready to be used in the blog post.

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
      const coreMessageData = JSON.parse(jsonResponse);
      return NextResponse.json(
        {
          coreMessageData,
          errorResponse,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to generate core message data" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}