import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

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

export async function POST(req: NextRequest) {
  console.log("calling POST /api/reader-objective");
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const previousTargetAudiences = JSON.parse(
      (formData.get("previousTargetAudiences") as string) || "[]"
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

    let previousAudiencesInstruction = "";
    if (previousTargetAudiences.length > 0) {
      previousAudiencesInstruction = `
        The following target audiences have already been suggested:
        ${JSON.stringify(previousTargetAudiences, null, 2)}
        
        Please provide a different target audience that has not been suggested before and would also be interested in this content.
      `;
    }

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
              text: `You are an AI assistant tasked with helping a user refine their blog post strategy for Medium. Your goal is to analyze the provided content and generate a focused target audience profile along with reasons for mutual interest. Here's how to proceed:
      
                    1. First, carefully review the following input:
                    
                    <reference_files>
                    ${referenceFilesContent}
                    </reference_files>
                    
                    ${previousAudiencesInstruction}
                    
                    2. Analyze the content:
                      - Identify the main topics and themes
                      - Note any specific expertise or unique perspectives presented
                      - Consider the tone and style of the writing
                    
                    3. Based on your analysis, identify ONE specific target audience that would be most interested in and benefit from this content.
                    
                    4. Generate THREE reasons why this target audience would be interested in the blog post.
                    
                    5. Generate THREE reasons why the blog author (user) would want to reach out to this specific audience.
                    
                    6. Present your findings in the following JSON format:

                    <jsonResponse>
                    {
                      "targetAudience": {
                        "name": "Specific name of the target audience",
                        "description": "1 brief sentence describing the target audience"
                      },
                      "audienceInterest": [
                        {
                          "reason": "First reason for audience interest",
                          "explanation": "1 brief sentence describing why this reason is relevant"
                        },
                        {
                          "reason": "Second reason for audience interest",
                          "explanation": "1 brief sentence describing why this reason is relevant"
                        },
                        {
                          "reason": "Third reason for audience interest",
                          "explanation": "1 brief sentence describing why this reason is relevant"
                        },
                      ],
                      "authorMotivation": [
                        {
                          "reason": "First reason for author to reach this audience",
                          "explanation": "1 brief sentence explanation of the potential benefit for the author"
                        },
                        {
                          "reason": "Second reason for author to reach this audience",
                          "explanation": "1 brief sentence explanation of the potential benefit for the author"
                        },
                        {
                          "reason": "Third reason for author to reach this audience",
                          "explanation": "1 brief sentence explanation of the potential benefit for the author"
                        }
                      ]
                    }
                    </jsonResponse>
                    
                    Remember to be specific and tailor your suggestions to the content provided in the reference files and user instructions. Your analysis should help the user refine their blog post strategy and maximize its impact on Medium.
                    
                    <errorResponse>
                    If there is an issue following the instructions please provide the reason you cannot comply within the error tag
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
