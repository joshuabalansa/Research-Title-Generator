"use client";

import Link from "next/link";
import { useState } from "react";
import type { CapstoneProject } from "./lib/ai";  // Import the type

export default function Home() {
  const [industry, setIndustry] = useState("");
  const [projectType, setProjectType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [result, setResult] = useState<CapstoneProject | null>(null);  // Use proper typing
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const industries = [
    // 🌍 Core Industries
    "Technology",
    "Healthcare",
    "Education",
    "Finance",
    "Agriculture",
    "Retail",
    "Manufacturing",
    "Engineering",
    "Environmental Science",
    "Business & Management",

    // 🔒 Security & Law
    "Cybersecurity",
    "Law & Policy",
    "Public Safety & Emergency Services",
    "Defense & Military",

    // 🚗 Transportation & Logistics
    "Automotive",
    "Transportation & Logistics",
    "Aviation & Aerospace",
    "Maritime & Shipping",

    // ⚡ Energy & Sustainability
    "Energy & Renewable Resources",
    "Oil & Gas",
    "Environmental Sustainability",

    // 🎨 Media, Arts & Entertainment
    "Media & Entertainment",
    "Film & Television",
    "Music & Audio Production",
    "Graphic Design & Animation",
    "Publishing & Journalism",

    // 🏨 Hospitality & Tourism
    "Hospitality & Tourism",
    "Food & Beverage",
    "Event Management",

    // ⚕️ Life Sciences & Research
    "Pharmaceuticals",
    "Biotechnology",
    "Medical Devices",
    "Neuroscience & Psychology",

    // 🏗️ Construction & Urban Development
    "Construction & Architecture",
    "Real Estate",
    "Urban Planning",

    // 🌐 Internet & Emerging Tech
    "E-Commerce",
    "AI & Machine Learning",
    "Blockchain & Cryptocurrency",
    "Cloud Computing",
    "IoT (Internet of Things)",

    // 🎮 Gaming & Digital Economy
    "Gaming & Esports",
    "Metaverse & Virtual Reality",
    "Streaming & Content Creation",

    // 🏋️‍♂️ Sports & Health
    "Sports & Fitness",
    "Wellness & Mental Health",
    "Rehabilitation & Physical Therapy",

    // 🔬 Science & Innovation
    "Astronomy & Space Exploration",
    "Nanotechnology",
    "Quantum Computing",
    "Material Science",

    // 📊 Economics & Market Trends
    "Stock Market & Investment",
    "Insurance",
    "Actuarial Science",

    // 🏛️ Public & Nonprofit Sectors
    "Social Services",
    "Nonprofit & Philanthropy",
    "Government & Public Administration",
    "International Relations & Diplomacy"
  ];


  const projectTypes = ["Data", "Web", "Mobile", "IoT", "AI/ML", "Blockchain", "Cloud", "Cybersecurity"];
  const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Research Title Generator
        </h1>
        <h1 className="text-sm text-center text-gray-800 mb-4">
        <div>Made with ♥ by <Link className="font-bold" href={'https://balansajoshua.vercel.app/'}>JoshuaB</Link></div>
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

          {/* Difficulty Select */}
          <div>
            <label className="block font-medium text-gray-700">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full border-gray-300 rounded-lg p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Difficulty</option>
              {difficultyLevels.map((level) => (
                <option key={level} value={level.toLowerCase()}>{level}</option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Research Title"}
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {/* Result Section */}
        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800">{result.project_title}</h2>
            <p className="text-gray-600 mt-2">{result.description}</p>
            <h3 className="text-lg font-medium mt-4">Objectives:</h3>
            <ul className="list-disc pl-5 mt-2 text-gray-700">
              {result.objectives.map((obj: string, index: number) => (
                <li key={index}>{obj}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}