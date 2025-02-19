import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error('GEMINI_API_KEY is not defined in environment variables');

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
Generate a **capstone project title and objectives** based on the provided inputs.

### **Content Requirements**:
- The output should include:
  1. **Project Title** – A **concise, engaging, and relevant** title based on the given inputs.
  2. **Project Description** – A **brief explanation** of what the project is about, highlighting its purpose and significance.
  3. **Objectives List** – A **list of 3-5 clear and actionable objectives**, each describing specific goals the project aims to achieve.

### **Inputs**:
- **Industry:** Specify an industry such as healthcare, education, agriculture, technology, etc.
- **Project Type:** Define whether it's a **data project, IoT system, web app, mobile app, etc.**
- **Difficulty Level:** Choose between **beginner, intermediate, or advanced**.

### **Output Format (Structured in JSON):**
\`\`\`json
{
  "project_title": "string",
  "description": "string",
  "objectives": [
    "string",
    "string",
    "string"
  ]
}
\`\`\`

### **Example Input:**
\`\`\`json
{
  "industry": "healthcare",
  "project_type": "data",
  "difficulty": "intermediate"
}
\`\`\`

### **Example Output:**
\`\`\`json
{
  "project_title": "Optimizing Healthcare Data Management for Improved Patient Insights",
  "description": "This project focuses on enhancing the storage, processing, and analysis of healthcare data, ensuring better accessibility and decision-making.",
  "objectives": [
    "Design an efficient healthcare data storage system to improve data accessibility and integrity.",
    "Develop a secure data pipeline for seamless integration of patient records across platforms.",
    "Implement data visualization techniques to help healthcare professionals interpret complex datasets.",
    "Optimize query performance for faster retrieval of patient information.",
    "Ensure compliance with healthcare regulations such as HIPAA for data security and privacy."
  ]
}
\`\`\`

### **Generation Guidelines:**
- Ensure the **title is unique and engaging**.
- The **description should be concise yet informative**.
- The **objectives must be actionable** and relevant to the project scope.
- The output must be **strictly formatted in JSON** for seamless API integration.
  `,
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 2048,
  responseMimeType: "application/json",
};

interface CapstoneProject {
  project_title: string;
  description: string;
  objectives: string[];
}

// Add interface for input validation
interface ProjectInput {
  industry: string;
  projectType: string;
  difficulty: string;
}

// Update valid options for input validation
const validOptions = {
  difficulty: ['beginner', 'intermediate', 'advanced'],
  projectType: ['data', 'web', 'mobile', 'iot', 'ai/ml', 'blockchain', 'cloud', 'cybersecurity'],
  industry: [
    // 🌍 Core Industries
    'technology',
    'healthcare',
    'education',
    'finance',
    'agriculture',
    'retail',
    'manufacturing',
    'engineering',
    'environmental science',
    'business & management',

    // 🔒 Security & Law
    'cybersecurity',
    'law & policy',
    'public safety & emergency services',
    'defense & military',

    // 🚗 Transportation & Logistics
    'automotive',
    'transportation & logistics',
    'aviation & aerospace',
    'maritime & shipping',

    // ⚡ Energy & Sustainability
    'energy & renewable resources',
    'oil & gas',
    'environmental sustainability',

    // 🎨 Media, Arts & Entertainment
    'media & entertainment',
    'film & television',
    'music & audio production',
    'graphic design & animation',
    'publishing & journalism',

    // 🏨 Hospitality & Tourism
    'hospitality & tourism',
    'food & beverage',
    'event management',

    // ⚕️ Life Sciences & Research
    'pharmaceuticals',
    'biotechnology',
    'medical devices',
    'neuroscience & psychology',

    // 🏗️ Construction & Urban Development
    'construction & architecture',
    'real estate',
    'urban planning',

    // 🌐 Internet & Emerging Tech
    'e-commerce',
    'ai & machine learning',
    'blockchain & cryptocurrency',
    'cloud computing',
    'iot (internet of things)',

    // 🎮 Gaming & Digital Economy
    'gaming & esports',
    'metaverse & virtual reality',
    'streaming & content creation',

    // 🏋️‍♂️ Sports & Health
    'sports & fitness',
    'wellness & mental health',
    'rehabilitation & physical therapy',

    // 🔬 Science & Innovation
    'astronomy & space exploration',
    'nanotechnology',
    'quantum computing',
    'material science',

    // 📊 Economics & Market Trends
    'stock market & investment',
    'insurance',
    'actuarial science',

    // 🏛️ Public & Nonprofit Sectors
    'social services',
    'nonprofit & philanthropy',
    'government & public administration',
    'international relations & diplomacy'
  ].map(industry => industry.toLowerCase())
};

// Add input validation function
function validateInput(input: ProjectInput): void {
  if (!input.industry || !input.projectType || !input.difficulty) {
    throw new Error('All fields (industry, projectType, difficulty) are required');
  }

  if (!validOptions.difficulty.includes(input.difficulty.toLowerCase())) {
    throw new Error(`Invalid difficulty level. Must be one of: ${validOptions.difficulty.join(', ')}`);
  }

  if (!validOptions.projectType.includes(input.projectType.toLowerCase())) {
    throw new Error(`Invalid project type. Must be one of: ${validOptions.projectType.join(', ')}`);
  }

  if (!validOptions.industry.includes(input.industry.toLowerCase())) {
    throw new Error(`Invalid industry. Must be one of: ${validOptions.industry.join(', ')}`);
  }
}

/**
 * Generates a capstone project title, description, and objectives.
 * @param {string} industry - The industry of the project.
 * @param {string} projectType - The type of project (e.g., web, data, IoT).
 * @param {string} difficulty - The difficulty level (beginner, intermediate, advanced).
 * @returns {Promise<CapstoneProject>} A promise that resolves to the capstone project details
 * @throws {Error} If input validation fails or API call fails
 */
async function generateCapstoneTitle(
  industry: string,
  projectType: string,
  difficulty: string
): Promise<CapstoneProject> {
  try {
    console.log('Starting capstone generation with inputs:', { industry, projectType, difficulty });

    // Validate inputs
    validateInput({ industry, projectType, difficulty });
    console.log('Input validation passed');

    const normalizedInput = {
      industry: industry.toLowerCase(),
      projectType: projectType.toLowerCase(),
      difficulty: difficulty.toLowerCase()
    };
    console.log('Normalized inputs:', normalizedInput);

    // Create a new chat session for each generation
    const chatSession = model.startChat({
      generationConfig: {
        ...generationConfig,
        // Add some randomness to ensure variety
        temperature: 0.7 + (Math.random() * 0.2), // Between 0.7 and 0.9
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 2048,
      }
    });

    console.log('Chat session started');

    const prompt = `Generate a unique and creative capstone project title and objectives for an ${normalizedInput.industry} ${normalizedInput.projectType} project at ${normalizedInput.difficulty} level. Ensure it is different from previous generations.`;
    console.log('Sending prompt:', prompt);

    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();
    console.log('Received raw response:', responseText);

    if (!responseText) {
      throw new Error('Received empty response from AI model');
    }

    let capstoneData: CapstoneProject;
    try {
      capstoneData = JSON.parse(responseText) as CapstoneProject;
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      throw new Error('Invalid JSON response from AI model');
    }

    console.log('Parsed response:', capstoneData);

    // Validate response structure
    if (!capstoneData.project_title || !capstoneData.description || !Array.isArray(capstoneData.objectives)) {
      throw new Error('Invalid response structure from AI model');
    }

    return capstoneData;

  } catch (error) {
    console.error("Error generating capstone project:", error);
    throw error;
  }
}

export { generateCapstoneTitle, validOptions };
export type { CapstoneProject, ProjectInput };
