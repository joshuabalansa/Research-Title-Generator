"use client";

import Link from "next/link";
import { useState } from "react";
import type { CapstoneProject } from "./lib/ai";  // Import the type
import industriesData from "./data/industries.json";  // Import the industries JSON

export default function Home() {
  const [industry, setIndustry] = useState("");
  const [projectType, setProjectType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [result, setResult] = useState<CapstoneProject | null>(null);  // Use proper typing
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Generating...");

  const loadingMessages = [
    "Thinking of a brilliant title...",
    "Analyzing the best research ideas...",
    "Compiling innovative topics...",
    "Brainstorming an impactful project...",
    "Exploring new research frontiers...",
    "Unleashing creativity...",
    "Your research breakthrough is coming...",
    "Scanning the academic universe...",
    "Letting AI work its magic...",
    "Formulating an insightful title...",
  ];

  const getRandomLoadingMessage = () => {
    return loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  };

  const industries = industriesData.industries;

  const projectTypes = ["Data", "Web", "Mobile", "IoT", "AI/ML", "Blockchain", "Cloud", "Cybersecurity"];
  const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setLoadingMessage(getRandomLoadingMessage());

    console.log('Submitting form with values:', { industry, projectType, difficulty });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        },
        body: JSON.stringify({
          industry,
          projectType,
          difficulty,
          timestamp: Date.now(),
          random: Math.random() // Add additional randomness
        }),
        // Add these fetch options
        cache: 'no-store',
        next: { revalidate: 0 }
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate capstone project');
      }

      console.log('Received response:', data);
      setResult(data);
    } catch (err) {
      console.error('Error in form submission:', err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white lg:shadow-md rounded-lg p-6 flex flex-col md:flex-row">
        {/* Form Section */}
        <div className="w-full md:w-1/2 md:pr-4">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Research Title Generator
          </h1>
          <h1 className="text-sm text-center text-gray-800 mb-4">
            <div>Developed by <Link className="font-bold" href={'https://balansajoshua.vercel.app/'}>JOSH</Link></div>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Industry Select */}
            <div>
              <label className="block font-medium text-gray-700">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full border-gray-300 rounded-lg p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Industry</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind.toLowerCase()}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Project Type Select */}
            <div>
              <label className="block font-medium text-gray-700">Project Type</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full border-gray-300 rounded-lg p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Project Type</option>
                {projectTypes.map((type) => (
                  <option key={type} value={type.toLowerCase()}>{type}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Radio Buttons */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">Difficulty</label>
              <div className="space-y-2">
                {difficultyLevels.map((level) => (
                  <div key={level} className="flex items-center">
                    <input
                      id={`radio-${level}`}
                      type="radio"
                      name="difficulty"
                      value={level.toLowerCase()}
                      checked={difficulty === level.toLowerCase()}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="hidden checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100"
                    />
                    <label
                      htmlFor={`radio-${level}`}
                      className="flex items-center cursor-pointer text-gray-600 text-sm font-normal"
                    >
                      <span className={`border border-gray-300 rounded-full mr-2 w-4 h-4 flex items-center justify-center ${
                        difficulty === level.toLowerCase() ? 'border-indigo-500 bg-indigo-100' : ''
                      }`}>
                        {difficulty === level.toLowerCase() && (
                          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        )}
                      </span>
                      {level}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              disabled={loading}
            >
              Generate Research Title
            </button>
          </form>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>

        {/* Result Section */}
        <div className="w-full md:w-1/2 md:pl-4 mt-6 md:mt-0 flex items-center justify-center">
          {loading ? (
            <div className="p-4 rounded-lg flex items-center justify-center h-full">
              <p className="text-lg font-medium text-gray-800">{loadingMessage}</p>
            </div>
          ) : (
            result && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800">{result.project_title}</h2>
                <p className="text-gray-600 mt-2">{result.description}</p>
                <h3 className="text-lg font-medium mt-4">Objectives:</h3>
                <ul className="list-disc pl-5 mt-2 text-gray-700">
                  {result.objectives.map((obj: string, index: number) => (
                    <li key={index}>{obj}</li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}