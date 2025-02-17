import { NextRequest, NextResponse } from "next/server";
import { generateCapstoneTitle, validOptions } from "../../lib/ai";
import type { CapstoneProject } from "../../lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { industry, projectType, difficulty } = body;

    console.log('Received request with body:', { industry, projectType, difficulty });

    // Validate request body
    if (!industry || !projectType || !difficulty) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: "All fields (industry, projectType, difficulty) are required." },
        {
          status: 400,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      );
    }

    // Ensure values are valid
    if (!validOptions.industry.includes(industry.toLowerCase())) {
      console.log('Invalid industry:', industry);
      return NextResponse.json({
        error: `Invalid industry. Must be one of: ${validOptions.industry.join(", ")}`,
        validOptions: validOptions.industry
      }, { status: 400 });
    }

    if (!validOptions.projectType.includes(projectType.toLowerCase())) {
      console.log('Invalid project type:', projectType);
      return NextResponse.json({
        error: `Invalid project type. Must be one of: ${validOptions.projectType.join(", ")}`,
        validOptions: validOptions.projectType
      }, { status: 400 });
    }

    if (!validOptions.difficulty.includes(difficulty.toLowerCase())) {
      console.log('Invalid difficulty:', difficulty);
      return NextResponse.json({
        error: `Invalid difficulty level. Must be one of: ${validOptions.difficulty.join(", ")}`,
        validOptions: validOptions.difficulty
      }, { status: 400 });
    }

    // Call AI function to generate capstone project
    console.log('Generating capstone project...');
    const capstoneProject: CapstoneProject = await generateCapstoneTitle(industry, projectType, difficulty);

    if (!capstoneProject || !capstoneProject.project_title) {
      throw new Error('Invalid response from AI model');
    }

    console.log('Generated capstone project:', capstoneProject);
    return NextResponse.json(capstoneProject, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    console.error("Error generating capstone project:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Internal Server Error",
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  }
}