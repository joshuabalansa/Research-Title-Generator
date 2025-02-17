import type { NextApiRequest, NextApiResponse } from "next";
import { generateCapstoneTitle, validOptions } from "../lib/ai";
import type { CapstoneProject } from "../lib/ai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== "POST") {
    console.log('Invalid method:', req.method);
    return res.status(405).json({ error: "Method Not Allowed. Use POST request." });
  }

  try {
    const { industry, projectType, difficulty } = req.body;
    console.log('Received request with body:', { industry, projectType, difficulty });

    // Validate request body
    if (!industry || !projectType || !difficulty) {
      console.log('Missing required fields');
      return res.status(400).json({ error: "All fields (industry, projectType, difficulty) are required." });
    }

    // Ensure values are valid
    if (!validOptions.industry.includes(industry.toLowerCase())) {
      console.log('Invalid industry:', industry);
      return res.status(400).json({
        error: `Invalid industry. Must be one of: ${validOptions.industry.join(", ")}`,
        validOptions: validOptions.industry
      });
    }

    if (!validOptions.projectType.includes(projectType.toLowerCase())) {
      console.log('Invalid project type:', projectType);
      return res.status(400).json({
        error: `Invalid project type. Must be one of: ${validOptions.projectType.join(", ")}`,
        validOptions: validOptions.projectType
      });
    }

    if (!validOptions.difficulty.includes(difficulty.toLowerCase())) {
      console.log('Invalid difficulty:', difficulty);
      return res.status(400).json({
        error: `Invalid difficulty level. Must be one of: ${validOptions.difficulty.join(", ")}`,
        validOptions: validOptions.difficulty
      });
    }

    // Call AI function to generate capstone project
    console.log('Generating capstone project...');
    const capstoneProject: CapstoneProject = await generateCapstoneTitle(industry, projectType, difficulty);

    if (!capstoneProject || !capstoneProject.project_title) {
      throw new Error('Invalid response from AI model');
    }

    console.log('Generated capstone project:', capstoneProject);
    return res.status(200).json(capstoneProject);
  } catch (error) {
    console.error("Error generating capstone project:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal Server Error",
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}