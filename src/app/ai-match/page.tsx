"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, Cpu, Clock, MapPin, Zap, Bot, Send } from "lucide-react";
import { Resource } from "@/types";
import { getConditionBadgeVariant } from "@/lib/utils";

interface Recommendation {
  resource: Resource;
  matchScore: number;
  reasoning: string;
  recommendedWorkflow: string;
}

const SAMPLE_PROMPTS = [
  "I need equipment to build an IoT-based smart irrigation prototype with sensors and circuit debugging.",
  "Distributed fine-tuning of an Indic language vision model using enterprise GPUs.",
  "Robotic arm trajectory kinematics and soft gripper object compliance testbed.",
  "High-resolution resin 3D printing of drone propeller mounts and lightweight brackets.",
  "Filming a high quality documentary series with cinema optical prime lenses.",
];

export default function AiMatchPage() {
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [engine, setEngine] = useState<string>("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [searched, setSearched] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRecommend = async (customPrompt?: string) => {
    const query = (customPrompt || prompt).trim();
    if (!query) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch("/api/ai-discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: query }),
      });

      const data = await res.json();
      if (data.success) {
        setEngine(data.engine);
        setRecommendations(data.recommendations);
      } else {
        setError(data.error || "Failed to generate recommendations.");
      }
    } catch (e: any) {
      setError(e.message || "Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 flex-1">
      
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>AI-Assisted Resource Discovery Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Describe Your Project. We'll Match the Equipment.
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Tell us about your prototype, experiment, or capstone milestone. Our semantic matching engine evaluates technical specifications, lab safety guidelines, and schedule availability.
        </p>
      </div>

      {/* INPUT FORM */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-premium space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRecommend();
          }}
          className="space-y-4"
        >
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Project Requirements or Research Idea:</label>
            <textarea
              rows={3}
              placeholder="e.g. I need equipment to build an IoT-based smart irrigation prototype with signal calibration..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" /> Evaluates 10+ campus categories and safety constraints
            </span>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-glow flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {loading ? (
                <span>Analyzing Equipment Specs...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Find Matching Equipment</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* QUICK DEMO PROMPTS */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Judge Try-it Prompts:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrompt(sample);
                  handleRecommend(sample);
                }}
                className="text-left text-xs bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-xl transition-all"
              >
                “{sample}”
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTS DISPLAY */}
      {searched && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recommended Hardware Allocations</h2>
            {engine && (
              <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                Engine: {engine}
              </span>
            )}
          </div>

          {recommendations.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-500 text-xs">
              No direct matches found. Try entering alternative engineering keywords.
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec, i) => (
                <div
                  key={rec.resource.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle hover:border-blue-400/80 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={rec.resource.thumbnail_url}
                        alt=""
                        className="w-16 h-16 rounded-2xl object-cover shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            {rec.resource.category}
                          </span>
                          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> {rec.matchScore}% Compatibility
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base sm:text-lg mt-0.5">
                          {rec.resource.name}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-500" /> {rec.resource.location}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/resources/${rec.resource.id}`}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0"
                    >
                      <span>Reserve Equipment</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* AI REASONING BOX */}
                  <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-xs space-y-1">
                    <p className="font-bold text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Technical Match Reasoning:
                    </p>
                    <p className="text-blue-800 leading-relaxed">{rec.reasoning}</p>
                    <p className="text-[11px] text-blue-600 font-medium pt-1">
                      💡 Suggested Protocol: {rec.recommendedWorkflow}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
